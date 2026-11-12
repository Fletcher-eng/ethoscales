/**
 * EthosScales statistics collector.
 *
 * This runs inside a Google Sheet (Extensions > Apps Script). The site sends
 * one anonymous row per person who chooses to share at the end of the test.
 * No name, email or IP address is ever written to the sheet.
 *
 * Set up:
 *   1. Make a new Google Sheet.
 *   2. Extensions > Apps Script. Delete what is there and paste this file.
 *   3. Deploy > New deployment > Web app.
 *      Execute as: Me.   Who has access: Anyone.
 *   4. Copy the web app URL into `collectUrl` at the top of app.js.
 */

var COLUMNS = ['time', 'mode', 'match', 'country', 'age', 'gender', 'religion',
  'right', 'limits', 'nature', 'label', 'trust',
  'econ', 'own', 'rights', 'rule', 'struct', 'nation', 'ident', 'cult', 'tech', 'eco', 'relig', 'force'];
var AXES = COLUMNS.slice(12);
var MAX_ROWS_PER_MINUTE = 60;

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    if (!isReal(data)) return reply('ignored');

    // A crude flood limit: bots that hammer the endpoint get dropped.
    var cache = CacheService.getScriptCache();
    var minute = 'm' + Math.floor(Date.now() / 60000);
    var count = Number(cache.get(minute) || 0);
    if (count >= MAX_ROWS_PER_MINUTE) return reply('busy');
    cache.put(minute, String(count + 1), 120);

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) sheet.appendRow(COLUMNS);
    sheet.appendRow(COLUMNS.map(function (key) {
      if (key === 'time') return new Date();
      return clean(data[key]);
    }));
    return reply('ok');
  } catch (err) {
    return reply('error');
  }
}

/** Drop anything that does not look like a finished test from a person. */
function isReal(data) {
  if (!data || data.website) return false;            // hidden field only bots fill in
  if (data.age === 'Under 13') return false;           // never stored
  if (!(Number(data.seconds) >= 45)) return false;     // nobody finishes that fast
  for (var i = 0; i < AXES.length; i++) {
    var n = Number(data[AXES[i]]);
    if (!isFinite(n) || n < 0 || n > 100) return false;
  }
  return true;
}

/** Keep cells short and stop anything being run as a spreadsheet formula. */
function clean(value) {
  if (typeof value === 'number') return value;
  var text = String(value === undefined || value === null ? '' : value).slice(0, 60);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function reply(text) {
  return ContentService.createTextOutput(text);
}
