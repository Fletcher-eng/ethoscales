/* ------------------------------------------------------------------ */
/* EthosScales: the end survey and the party list                      */
/*                                                                     */
/* Axis order for coords(): econ, own, rights, rule, struct, nation,    */
/* ident, cult, tech, eco, relig, force. Every value is 0 to 100.       */
/* ------------------------------------------------------------------ */

/**
 * The belief questions. Each answer nudges a few axes by a small amount,
 * so what someone says they believe counts a little next to how they
 * answered the statements. `nudge` is added to the 0 to 100 score.
 */
const SURVEY_BELIEFS = [
  { id: 'right', text: 'What makes an action right?', options: [
    { v: 'results', label: 'Its results: the most good for the most people', nudge: { rule: 2, tech: -3 } },
    { v: 'rules', label: 'Following rules and duties, whatever the outcome', nudge: { rights: -3, cult: 3 } },
    { v: 'character', label: 'Being what a good person would do', nudge: { cult: 4 } },
    { v: 'divine', label: 'What God commands', nudge: { relig: 8, cult: 4 } }
  ] },
  { id: 'limits', text: 'Are there rights no majority may ever vote away?', options: [
    { v: 'yes', label: 'Yes, some rights come before any vote', nudge: { rights: -5, rule: -3 } },
    { v: 'no', label: 'No, the people decide everything', nudge: { rule: -4, rights: 4 } }
  ] },
  { id: 'nature', text: 'Left alone, are people mostly cooperative or mostly self interested?', options: [
    { v: 'coop', label: 'Cooperative', nudge: { own: 4, rights: -3, struct: -3 } },
    { v: 'self', label: 'Self interested', nudge: { own: -4, rights: 4, econ: -3 } }
  ] },
  { id: 'label', text: 'Which label would you give yourself today?', options: [
    { v: 'left', label: 'Left wing', nudge: { econ: 4, own: 4 }, check: { axis: 'econ', high: true } },
    { v: 'liberal', label: 'Liberal', nudge: { rights: -4, cult: -3 }, check: { axis: 'rights', high: false } },
    { v: 'centrist', label: 'Centrist', nudge: {} },
    { v: 'conservative', label: 'Conservative', nudge: { cult: 5, nation: 3 }, check: { axis: 'cult', high: true } },
    { v: 'libertarian', label: 'Libertarian', nudge: { econ: -5, rights: -5 }, check: { axis: 'rights', high: false } },
    { v: 'nationalist', label: 'Nationalist', nudge: { nation: 6, ident: 4 }, check: { axis: 'nation', high: true } },
    { v: 'none', label: 'None of these', nudge: {} }
  ] },
  { id: 'trust', text: 'Which kind of rule do you trust most?', options: [
    { v: 'demo', label: 'Democracy: decided by votes', nudge: { rule: -5 } },
    { v: 'leader', label: 'A strong leader who gets things done', nudge: { rule: 7, rights: 3 } },
    { v: 'nostate', label: 'As little government as possible, or none', nudge: { rule: -4, struct: -6, rights: -5 } }
  ] }
];

/** The questions about the person. None of these change the result. */
const SURVEY_ABOUT = [
  { id: 'age', label: 'Age', options: ['Under 13', '13 to 15', '16 to 17', '18 to 24', '25 to 34', '35 to 49', '50 or over'] },
  { id: 'gender', label: 'Gender', options: ['Woman', 'Man', 'Another answer'] },
  { id: 'religion', label: 'Religion', options: ['None', 'Christian', 'Muslim', 'Jewish', 'Hindu', 'Buddhist', 'Sikh', 'Another'] }
];

/** ISO country codes offered in the survey. Names come from the browser. */
const SURVEY_COUNTRIES = ('GB US CA AU IE NZ DE FR ES IT NL BE PT SE NO DK FI PL CZ AT CH GR RO HU UA RU TR IL SA AE EG ZA NG KE GH ' +
  'IN PK BD LK CN JP KR TW HK SG MY ID PH TH VN BR AR MX CL CO PE').split(' ');

function partyCoords(econ, own, rights, rule, struct, nation, ident, cult, tech, eco, relig, force) {
  return { econ, own, rights, rule, struct, nation, ident, cult, tech, eco, relig, force };
}

/**
 * Parties, each placed from the document named in `doc`. The numbers are
 * editorial estimates of what that document says, not of how the party
 * governed. `restricted` parties get no emblem.
 */
const PARTIES = [
  // United Kingdom
  { name: 'Labour Party', group: 'uk', where: 'United Kingdom', doc: 'Change', year: 2024, color: '#C42318', coords: partyCoords(52, 42, 50, 22, 58, 45, 38, 38, 40, 52, 25, 55) },
  { name: 'Conservative Party', group: 'uk', where: 'United Kingdom', doc: 'Clear Plan. Bold Action. Secure Future.', year: 2024, color: '#1D3FBB', coords: partyCoords(32, 25, 60, 28, 58, 65, 62, 62, 40, 38, 38, 65) },
  { name: 'Liberal Democrats', group: 'uk', where: 'United Kingdom', doc: 'For a Fair Deal', year: 2024, color: '#B26F00', coords: partyCoords(45, 35, 28, 15, 38, 25, 25, 25, 40, 62, 22, 42) },
  { name: 'Green Party of England and Wales', group: 'uk', where: 'United Kingdom', doc: 'Real Hope. Real Change.', year: 2024, color: '#10743F', coords: partyCoords(65, 55, 30, 15, 35, 20, 20, 18, 62, 85, 20, 22) },
  { name: 'Reform UK', group: 'uk', where: 'United Kingdom', doc: 'Our Contract with You', year: 2024, color: '#0B6C75', coords: partyCoords(25, 22, 62, 32, 50, 82, 80, 70, 38, 18, 40, 65) },
  { name: 'Scottish National Party', group: 'uk', where: 'United Kingdom', doc: 'A Future Made in Scotland', year: 2024, color: '#7A6000', coords: partyCoords(55, 45, 38, 18, 35, 50, 25, 28, 45, 62, 22, 30) },

  // United States
  { name: 'Democratic Party', group: 'us', where: 'United States', doc: 'Democratic Party Platform', year: 2024, color: '#1D3FBB', coords: partyCoords(45, 32, 42, 20, 55, 45, 28, 30, 35, 55, 35, 58) },
  { name: 'Republican Party', group: 'us', where: 'United States', doc: 'Republican Party Platform', year: 2024, color: '#C42318', coords: partyCoords(28, 20, 62, 35, 48, 82, 72, 72, 35, 15, 65, 68) },
  { name: 'Libertarian Party', group: 'us', where: 'United States', doc: 'Libertarian Party Platform', color: '#7A6000', coords: partyCoords(5, 8, 8, 15, 10, 35, 35, 35, 25, 25, 25, 12) },
  { name: 'Green Party of the United States', group: 'us', where: 'United States', doc: 'Green Party Platform', color: '#10743F', coords: partyCoords(68, 58, 25, 10, 22, 20, 18, 15, 62, 88, 20, 12) },

  // Famous historical parties
  { name: 'Bolsheviks', group: 'past', where: 'Russia', doc: 'Programme of the Russian Communist Party (Bolsheviks)', year: 1919, color: '#8E1A12', coords: partyCoords(92, 95, 82, 85, 90, 25, 45, 25, 15, 12, 5, 80) },
  { name: 'Jacobin Club', group: 'past', where: 'France', doc: 'Constitution of the Year I', year: 1793, color: '#6F45D0', coords: partyCoords(55, 35, 65, 45, 85, 70, 75, 25, 35, 30, 20, 80) },
  { name: 'Chartists', group: 'past', where: 'United Kingdom', doc: "The People's Charter", year: 1838, color: '#0B6C75', coords: partyCoords(45, 35, 25, 8, 40, 45, 45, 45, 45, 40, 40, 30) },
  { name: 'Liberal Party', group: 'past', where: 'United Kingdom', doc: 'The Newcastle Programme', year: 1891, color: '#A2571A', coords: partyCoords(25, 18, 25, 22, 35, 40, 40, 40, 30, 25, 40, 35) },
  { name: 'Kuomintang', group: 'past', where: 'China', doc: 'Three Principles of the People', year: 1924, color: '#1D3FBB', coords: partyCoords(55, 45, 65, 60, 75, 85, 65, 60, 25, 20, 30, 70) },
  { name: "National Socialist German Workers' Party", group: 'past', where: 'Germany', doc: 'The 25 Point Programme', year: 1920, restricted: true, coords: partyCoords(60, 35, 95, 98, 95, 100, 100, 85, 35, 35, 40, 100) },

  // Major parties worldwide
  { name: 'Christian Democratic Union', group: 'world', where: 'Germany', doc: 'In Freiheit leben', year: 2024, color: '#111111', coords: partyCoords(35, 25, 52, 22, 40, 48, 60, 60, 38, 45, 55, 60) },
  { name: 'Social Democratic Party of Germany', group: 'world', where: 'Germany', doc: 'Hamburg Programme', year: 2007, color: '#C42318', coords: partyCoords(55, 42, 40, 15, 45, 28, 30, 28, 42, 62, 22, 38) },
  { name: 'La France Insoumise', group: 'world', where: 'France', doc: "L'Avenir en commun", year: 2022, color: '#B0307A', coords: partyCoords(72, 60, 38, 15, 55, 45, 30, 22, 55, 78, 8, 35) },
  { name: 'National Rally', group: 'world', where: 'France', doc: '22 mesures pour 2022', year: 2022, color: '#16264D', coords: partyCoords(48, 32, 72, 35, 70, 90, 88, 68, 40, 30, 25, 68) },
  { name: 'Bharatiya Janata Party', group: 'world', where: 'India', doc: 'Modi Ki Guarantee', year: 2024, color: '#C2570B', coords: partyCoords(42, 30, 65, 40, 70, 88, 75, 75, 25, 30, 80, 72) },
  { name: "Workers' Party", group: 'world', where: 'Brazil', doc: 'Programa de Reconstrução e Transformação do Brasil', year: 2022, color: '#C42318', coords: partyCoords(65, 52, 42, 22, 55, 50, 25, 30, 42, 60, 35, 35) },
  { name: 'Liberal Democratic Party', group: 'world', where: 'Japan', doc: 'Party Platform', year: 2010, color: '#10743F', coords: partyCoords(38, 25, 58, 30, 62, 72, 72, 68, 30, 32, 45, 62) },
  { name: 'African National Congress', group: 'world', where: 'South Africa', doc: 'The Freedom Charter', year: 1955, color: '#10743F', coords: partyCoords(65, 58, 40, 18, 55, 50, 15, 35, 35, 35, 35, 40) },
  { name: 'Communist Party of China', group: 'world', where: 'China', doc: 'Constitution of the Communist Party of China', year: 2022, color: '#8E1A12', coords: partyCoords(62, 60, 90, 92, 95, 82, 78, 62, 10, 35, 5, 78) }
];

const PARTY_GROUPS = [
  { id: 'all', label: 'All' },
  { id: 'uk', label: 'UK' },
  { id: 'us', label: 'US' },
  { id: 'past', label: 'Historical' },
  { id: 'world', label: 'World' }
];
