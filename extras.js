/* ------------------------------------------------------------------ */
/* EthosScales: the end survey and the party list                      */
/*                                                                     */
/* Axis order for coords(): econ, own, rights, rule, struct, nation,    */
/* ident, cult, tech, eco, relig, force, trade. Every value is 0 to 100.       */
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

function partyCoords(econ, own, rights, rule, struct, nation, ident, cult, tech, eco, relig, force, trade) {
  return { econ, own, rights, rule, struct, nation, ident, cult, tech, eco, relig, force, trade };
}

/**
 * Parties, each placed from the document named in `doc`. The numbers are
 * editorial estimates of what that document says, not of how the party
 * governed. `restricted` parties get no emblem.
 */
const PARTIES = [
  // United Kingdom
  { name: 'Labour Party', group: 'uk', where: 'United Kingdom', doc: 'Change', year: 2024, color: '#C42318', coords: partyCoords(52, 42, 50, 22, 40, 45, 38, 38, 40, 52, 25, 55, 45) },
  { name: 'Conservative Party', group: 'uk', where: 'United Kingdom', doc: 'Clear Plan. Bold Action. Secure Future.', year: 2024, color: '#1D3FBB', coords: partyCoords(32, 25, 60, 28, 58, 65, 62, 62, 40, 38, 38, 65, 35) },
  { name: 'Liberal Democrats', group: 'uk', where: 'United Kingdom', doc: 'For a Fair Deal', year: 2024, color: '#B26F00', coords: partyCoords(45, 35, 28, 15, 38, 25, 25, 25, 40, 62, 22, 42, 15) },
  { name: 'Green Party of England and Wales', group: 'uk', where: 'United Kingdom', doc: 'Real Hope. Real Change.', year: 2024, color: '#10743F', coords: partyCoords(65, 55, 30, 15, 35, 20, 20, 18, 62, 85, 20, 22, 55) },
  { name: 'Reform UK', group: 'uk', where: 'United Kingdom', doc: 'Our Contract with You', year: 2024, color: '#0B6C75', coords: partyCoords(25, 35, 62, 32, 50, 82, 80, 70, 38, 18, 40, 65, 55) },
  { name: 'Scottish National Party', group: 'uk', where: 'United Kingdom', doc: 'A Future Made in Scotland', year: 2024, color: '#7A6000', coords: partyCoords(55, 45, 38, 18, 35, 50, 25, 28, 45, 62, 22, 30, 25) },
  { name: 'Democratic Unionist Party', group: 'uk', where: 'United Kingdom', doc: 'Speaking Up for Northern Ireland', year: 2024, color: '#16264D', coords: partyCoords(42, 35, 62, 25, 50, 75, 65, 75, 45, 40, 62, 70, 40) },
  { name: 'Plaid Cymru', group: 'uk', where: 'United Kingdom', doc: 'For Fairness, For Ambition, For Wales', year: 2024, color: '#C42318', coords: partyCoords(58, 50, 32, 15, 20, 48, 25, 25, 50, 68, 22, 22, 22) },
  { name: 'Sinn Féin in Northern Ireland', group: 'uk', where: 'United Kingdom', doc: 'Strong Leadership, Positive Change', year: 2024, color: '#C42318', coords: partyCoords(58, 50, 35, 20, 35, 65, 35, 30, 50, 58, 25, 22, 25) },

  // United States
  { name: 'Democratic Party', group: 'us', where: 'United States', doc: '2024 Democratic Party Platform', year: 2024, color: '#1D3FBB', coords: partyCoords(45, 32, 42, 20, 55, 45, 28, 30, 35, 55, 35, 58, 50) },
  { name: 'Republican Party', group: 'us', where: 'United States', doc: '2024 Republican Party Platform', year: 2024, color: '#C42318', coords: partyCoords(28, 20, 62, 35, 48, 82, 72, 72, 35, 15, 65, 68, 85) },
  { name: 'Libertarian Party', group: 'us', where: 'United States', doc: 'Libertarian Party Platform', year: 2022, color: '#7A6000', coords: partyCoords(5, 8, 8, 15, 10, 35, 18, 35, 25, 25, 25, 12, 0) },
  { name: 'Green Party of the United States', group: 'us', where: 'United States', doc: 'Platform of the Green Party of the United States', year: 2024, color: '#10743F', coords: partyCoords(68, 58, 25, 10, 22, 20, 18, 15, 62, 88, 20, 12, 70) },

  // Famous historical parties
  { name: 'Bolsheviks', group: 'past', where: 'Russia', doc: 'Programme of the Russian Communist Party', year: 1919, color: '#8E1A12', coords: partyCoords(92, 95, 82, 70, 90, 25, 25, 25, 15, 12, 5, 80, 90) },
  { name: 'Jacobin Club', group: 'past', where: 'France', doc: 'Constitution of the Year I', year: 1793, color: '#6F45D0', coords: partyCoords(40, 35, 20, 12, 85, 55, 30, 25, 35, 30, 20, 60, 45) },
  { name: 'Chartists', group: 'past', where: 'United Kingdom', doc: "The People's Charter", year: 1838, color: '#0B6C75', coords: partyCoords(45, 35, 25, 8, 40, 45, 45, 45, 45, 40, 40, 30, 40) },
  { name: 'Liberal Party', group: 'past', where: 'United Kingdom', doc: 'The Newcastle Programme', year: 1891, color: '#A2571A', coords: partyCoords(25, 18, 25, 22, 35, 40, 40, 40, 30, 25, 25, 35, 5) },
  { name: 'Kuomintang', group: 'past', where: 'China', doc: 'Three Principles of the People', year: 1924, color: '#1D3FBB', coords: partyCoords(55, 45, 65, 45, 75, 85, 65, 60, 25, 20, 30, 70, 70) },
  { name: "National Socialist German Workers' Party", group: 'past', where: 'Germany', doc: 'The 25 Point Programme', year: 1920, restricted: true, coords: partyCoords(60, 55, 95, 80, 95, 100, 100, 85, 35, 35, 60, 100, 90) },

  { name: 'Levellers', group: 'past', where: 'England', doc: 'An Agreement of the People', year: 1647, color: '#10743F', coords: partyCoords(30, 25, 15, 10, 25, 45, 45, 50, 50, 45, 25, 35, 30) },
  { name: 'Federalist Party', group: 'past', where: 'United States', doc: 'The Federalist Papers', year: 1788, color: '#16264D', coords: partyCoords(35, 20, 55, 40, 75, 60, 55, 60, 35, 20, 50, 60, 75) },
  { name: 'Democratic Republican Party', group: 'past', where: 'United States', doc: 'The Kentucky and Virginia Resolutions', year: 1798, color: '#10743F', coords: partyCoords(20, 15, 20, 25, 15, 50, 35, 50, 55, 45, 35, 30, 35) },
  { name: 'Tory Party', group: 'past', where: 'United Kingdom', doc: 'The Tamworth Manifesto', year: 1834, color: '#1D3FBB', coords: partyCoords(35, 20, 60, 45, 55, 60, 65, 65, 50, 35, 75, 55, 65) },
  { name: 'Whig Party', group: 'past', where: 'United States', doc: 'Whig Party Platform', year: 1844, color: '#A2571A', coords: partyCoords(40, 22, 45, 30, 60, 55, 55, 60, 25, 15, 55, 45, 85) },
  { name: 'Communist League', group: 'past', where: 'Europe', doc: 'Manifesto of the Communist Party', year: 1848, color: '#C42318', coords: partyCoords(85, 95, 45, 25, 70, 5, 25, 10, 10, 15, 5, 65, 35) },
  { name: 'Free Soil Party', group: 'past', where: 'United States', doc: 'Free Soil Party Platform', year: 1848, color: '#0B6C75', coords: partyCoords(30, 20, 20, 15, 45, 45, 40, 40, 30, 30, 45, 25, 40) },
  { name: 'Republican Party of 1860', group: 'past', where: 'United States', doc: 'Republican Party Platform', year: 1860, color: '#C42318', coords: partyCoords(35, 22, 35, 22, 55, 55, 35, 50, 25, 15, 50, 50, 75) },
  { name: 'Radical Republicans', group: 'past', where: 'France', doc: 'The Belleville Programme', year: 1869, color: '#B0307A', coords: partyCoords(35, 25, 20, 10, 35, 55, 60, 25, 30, 30, 5, 20, 35) },
  { name: 'Social Democratic Party of 1891', group: 'past', where: 'Germany', doc: 'The Erfurt Programme', year: 1891, color: '#C42318', coords: partyCoords(80, 80, 30, 10, 40, 20, 30, 25, 25, 25, 10, 20, 30) },
  { name: "People's Party", group: 'past', where: 'United States', doc: 'The Omaha Platform', year: 1892, color: '#7A6000', coords: partyCoords(60, 50, 35, 12, 65, 55, 60, 55, 50, 45, 50, 30, 45) },
  { name: 'Constitutional Democratic Party', group: 'past', where: 'Russia', doc: 'Programme of the Constitutional Democratic Party', year: 1905, color: '#1D3FBB', coords: partyCoords(35, 30, 20, 15, 45, 50, 35, 35, 30, 30, 30, 40, 35) },
  { name: 'Socialist Revolutionary Party', group: 'past', where: 'Russia', doc: 'Programme of the Socialist Revolutionary Party', year: 1906, color: '#8E1A12', coords: partyCoords(65, 75, 35, 15, 25, 35, 30, 30, 50, 50, 25, 35, 45) },
  { name: 'Progressive Party', group: 'past', where: 'United States', doc: 'A Contract with the People', year: 1912, color: '#0B6C75', coords: partyCoords(50, 35, 40, 12, 60, 60, 55, 40, 25, 60, 40, 60, 70) },
  { name: 'Socialist Party of America', group: 'past', where: 'United States', doc: 'Socialist Party Platform', year: 1912, color: '#C42318', coords: partyCoords(75, 75, 30, 10, 50, 20, 35, 30, 30, 30, 20, 15, 35) },
  { name: 'Sinn Féin of 1918', group: 'past', where: 'Ireland', doc: 'Sinn Féin Manifesto', year: 1918, color: '#10743F', coords: partyCoords(50, 40, 40, 20, 50, 90, 60, 60, 45, 40, 60, 60, 65) },
  { name: 'Indian National Congress', group: 'past', where: 'India', doc: 'The Karachi Resolution', year: 1931, color: '#C2570B', coords: partyCoords(60, 50, 30, 15, 55, 65, 20, 40, 35, 35, 20, 15, 70) },
  { name: 'National Fascist Party', group: 'past', where: 'Italy', doc: 'The Doctrine of Fascism', year: 1932, color: '#111111', coords: partyCoords(65, 35, 95, 95, 95, 95, 90, 75, 30, 20, 55, 100, 85) },
  { name: 'Labour Party of 1945', group: 'past', where: 'United Kingdom', doc: 'Let Us Face the Future', year: 1945, color: '#C42318', coords: partyCoords(75, 65, 45, 15, 70, 50, 45, 45, 25, 25, 35, 50, 60) },
  { name: 'Communist Party of the Soviet Union', group: 'past', where: 'Soviet Union', doc: 'Programme of the Communist Party of the Soviet Union', year: 1961, color: '#8E1A12', coords: partyCoords(95, 95, 80, 88, 95, 45, 60, 45, 5, 8, 3, 75, 85) },

  { name: 'Mexican Liberal Party', group: 'past', where: 'Mexico', doc: 'Programme of the Mexican Liberal Party', year: 1906, color: '#C42318', coords: partyCoords(55, 45, 30, 12, 45, 60, 65, 25, 35, 30, 10, 45, 55) },
  { name: "Republican People's Party of 1931", group: 'past', where: 'Turkey', doc: "Programme of the Republican People's Party", year: 1931, color: '#C42318', coords: partyCoords(65, 45, 65, 70, 90, 90, 90, 20, 20, 20, 5, 70, 75) },
  { name: 'American Popular Revolutionary Alliance', group: 'past', where: 'Peru', doc: 'El antiimperialismo y el APRA', year: 1936, color: '#C42318', coords: partyCoords(60, 50, 45, 25, 60, 70, 35, 40, 30, 30, 30, 50, 75) },
  { name: 'All India Muslim League', group: 'past', where: 'British India', doc: 'The Lahore Resolution', year: 1940, color: '#10743F', coords: partyCoords(45, 35, 45, 30, 35, 85, 50, 65, 45, 40, 80, 50, 55) },
  { name: 'Communist Party of China of 1940', group: 'past', where: 'China', doc: 'On New Democracy', year: 1940, color: '#8E1A12', coords: partyCoords(70, 65, 65, 65, 75, 75, 45, 25, 25, 25, 5, 85, 65) },
  { name: 'Viet Minh', group: 'past', where: 'Vietnam', doc: 'Declaration of Independence of the Democratic Republic of Vietnam', year: 1945, color: '#C42318', coords: partyCoords(60, 55, 30, 40, 60, 90, 45, 35, 35, 30, 15, 80, 60) },
  { name: 'Indonesian Independence Movement', group: 'past', where: 'Indonesia', doc: "Sukarno's speech The Birth of Pancasila", year: 1945, color: '#C42318', coords: partyCoords(60, 50, 50, 45, 65, 70, 35, 50, 35, 30, 60, 55, 65) },
  { name: "Arab Ba'ath Party", group: 'past', where: 'Syria', doc: "Constitution of the Arab Ba'ath Party", year: 1947, color: '#111111', coords: partyCoords(70, 60, 50, 40, 60, 90, 75, 50, 30, 25, 30, 75, 75) },
  { name: 'Justicialist Party', group: 'past', where: 'Argentina', doc: 'The Twenty Truths of Peronism', year: 1950, color: '#6FB7E8', ink: '#111111', coords: partyCoords(65, 45, 65, 60, 75, 85, 60, 60, 30, 25, 55, 60, 85) },
  { name: '26th of July Movement', group: 'past', where: 'Cuba', doc: 'History Will Absolve Me', year: 1953, color: '#C42318', coords: partyCoords(65, 55, 40, 25, 60, 75, 35, 35, 30, 30, 20, 70, 65) },
  { name: 'National Liberation Front', group: 'past', where: 'Algeria', doc: 'Proclamation of 1 November 1954', year: 1954, color: '#10743F', coords: partyCoords(60, 50, 50, 45, 65, 90, 60, 60, 40, 35, 60, 85, 65) },
  { name: "People's Action Party of 1959", group: 'past', where: 'Singapore', doc: 'The Tasks Ahead', year: 1959, color: '#16264D', coords: partyCoords(50, 35, 65, 45, 80, 55, 35, 50, 15, 15, 20, 50, 20) },
  { name: "Convention People's Party", group: 'past', where: 'Ghana', doc: 'Programme for Work and Happiness', year: 1962, color: '#C42318', coords: partyCoords(75, 65, 60, 65, 80, 75, 35, 40, 20, 20, 30, 50, 75) },
  { name: 'Tanganyika African National Union', group: 'past', where: 'Tanzania', doc: 'The Arusha Declaration', year: 1967, color: '#10743F', coords: partyCoords(80, 80, 40, 45, 65, 65, 40, 50, 60, 45, 30, 35, 85) },
  { name: 'Popular Unity', group: 'past', where: 'Chile', doc: 'Programa básico de gobierno de la Unidad Popular', year: 1969, color: '#C42318', coords: partyCoords(80, 75, 35, 15, 65, 60, 30, 30, 30, 25, 20, 30, 70) },
  { name: 'Sandinista National Liberation Front', group: 'past', where: 'Nicaragua', doc: 'The Historic Program of the FSLN', year: 1969, color: '#111111', coords: partyCoords(75, 65, 50, 40, 65, 70, 30, 30, 30, 30, 30, 75, 70) },
  { name: 'Democratic Party of 1840', group: 'past', where: 'United States', doc: 'Democratic Party Platform', year: 1840, color: '#7A6000', coords: partyCoords(12, 12, 30, 30, 10, 50, 25, 60, 55, 45, 45, 40, 20) },
  { name: 'American Party', group: 'past', where: 'United States', doc: 'American Party Platform', year: 1856, color: '#16264D', coords: partyCoords(35, 20, 55, 35, 35, 85, 92, 70, 50, 40, 50, 50, 55) },
  { name: 'Centre Party', group: 'past', where: 'Germany', doc: 'The Soest Programme', year: 1870, color: '#6F45D0', coords: partyCoords(45, 25, 40, 35, 15, 45, 50, 85, 55, 45, 90, 40, 50) },
  { name: 'Cuban Revolutionary Party', group: 'past', where: 'Cuba', doc: 'Manifesto of Montecristi', year: 1895, color: '#B0307A', coords: partyCoords(40, 35, 25, 20, 50, 70, 25, 35, 35, 40, 35, 70, 40) },
  { name: 'Russian Social Democratic Labour Party of 1903', group: 'past', where: 'Russia', doc: 'Programme of the Russian Social Democratic Labour Party', year: 1903, color: '#8E1A12', coords: partyCoords(80, 85, 35, 20, 40, 15, 20, 25, 25, 30, 8, 35, 35) },
  { name: 'Liberation Army of the South', group: 'past', where: 'Mexico', doc: 'Plan of Ayala', year: 1911, color: '#0B6C75', coords: partyCoords(50, 60, 40, 30, 35, 60, 50, 55, 55, 50, 50, 75, 50) },
  { name: "Italian People's Party", group: 'past', where: 'Italy', doc: 'Appeal to the Free and Strong', year: 1919, color: '#6F45D0', coords: partyCoords(45, 30, 30, 15, 20, 40, 50, 80, 50, 45, 80, 20, 45) },
  { name: 'March First Movement', group: 'past', where: 'Korea', doc: 'Korean Declaration of Independence', year: 1919, color: '#0B6C75', coords: partyCoords(50, 50, 25, 30, 50, 75, 50, 45, 45, 50, 50, 10, 50) },
  { name: 'Cooperative Commonwealth Federation', group: 'past', where: 'Canada', doc: 'The Regina Manifesto', year: 1933, color: '#8E1A12', coords: partyCoords(88, 78, 25, 10, 70, 30, 40, 35, 30, 35, 35, 15, 65) },
  { name: 'African National Congress of 1955', group: 'past', where: 'South Africa', doc: 'The Freedom Charter', year: 1955, color: '#C42318', coords: partyCoords(65, 65, 25, 10, 50, 40, 15, 35, 40, 35, 35, 20, 55) },
  { name: 'Swatantra Party', group: 'past', where: 'India', doc: 'Statement of Principles of the Swatantra Party', year: 1959, color: '#7A6000', coords: partyCoords(15, 15, 20, 15, 35, 50, 40, 60, 45, 45, 50, 50, 25) },
  { name: 'Arab Socialist Union', group: 'past', where: 'Egypt', doc: 'The National Charter', year: 1962, color: '#8E1A12', coords: partyCoords(80, 70, 60, 65, 80, 85, 65, 45, 20, 25, 45, 65, 75) },
  { name: 'Awami League of 1966', group: 'past', where: 'Bangladesh', doc: 'The Six Point Programme', year: 1966, color: '#0B6C75', coords: partyCoords(50, 50, 35, 15, 5, 60, 40, 50, 50, 50, 40, 50, 45) },
  { name: "Uganda People's Congress of 1969", group: 'past', where: 'Uganda', doc: "The Common Man's Charter", year: 1969, color: '#8E1A12', coords: partyCoords(70, 65, 55, 55, 80, 65, 60, 35, 35, 30, 35, 45, 65) },
  { name: 'Solidarity', group: 'past', where: 'Poland', doc: 'The Self Governing Republic', year: 1981, color: '#1D3FBB', coords: partyCoords(50, 60, 20, 12, 20, 60, 50, 60, 50, 60, 60, 25, 45) },

  // Major parties worldwide
  { name: 'Christian Democratic Union', group: 'world', where: 'Germany', doc: 'In Freiheit leben', year: 2024, color: '#111111', coords: partyCoords(35, 25, 52, 22, 40, 48, 60, 60, 38, 45, 55, 60, 25) },
  { name: 'Social Democratic Party of Germany', group: 'world', where: 'Germany', doc: 'Hamburg Programme', year: 2007, color: '#C42318', coords: partyCoords(55, 42, 40, 15, 45, 28, 30, 28, 42, 62, 22, 38, 30) },
  { name: 'La France Insoumise', group: 'world', where: 'France', doc: "L'Avenir en commun", year: 2022, color: '#B0307A', coords: partyCoords(72, 60, 38, 15, 55, 45, 30, 22, 55, 78, 8, 35, 75) },
  { name: 'National Rally', group: 'world', where: 'France', doc: '22 mesures pour 2022', year: 2022, color: '#16264D', coords: partyCoords(48, 32, 72, 35, 70, 90, 88, 68, 40, 30, 25, 68, 75) },
  { name: 'Bharatiya Janata Party', group: 'world', where: 'India', doc: 'Modi Ki Guarantee', year: 2024, color: '#C2570B', coords: partyCoords(42, 30, 65, 40, 70, 88, 75, 75, 25, 30, 80, 72, 60) },
  { name: "Workers' Party", group: 'world', where: 'Brazil', doc: 'Diretrizes para o Programa de Reconstrução e Transformação do Brasil', year: 2022, color: '#C42318', coords: partyCoords(65, 52, 42, 22, 55, 50, 25, 30, 42, 60, 35, 35, 55) },
  { name: 'Liberal Democratic Party', group: 'world', where: 'Japan', doc: 'Party Platform', year: 2010, color: '#10743F', coords: partyCoords(38, 25, 58, 30, 62, 72, 72, 68, 30, 32, 45, 62, 35) },
  { name: 'African National Congress', group: 'world', where: 'South Africa', doc: "Let's Do More, Together", year: 2024, color: '#10743F', coords: partyCoords(65, 58, 40, 18, 55, 50, 15, 35, 35, 35, 35, 40, 60) },
  { name: 'Justice and Development Party', group: 'world', where: 'Turkey', doc: 'Development and Democratization Programme', year: 2001, color: '#C2570B', coords: partyCoords(35, 25, 35, 22, 35, 55, 55, 75, 35, 25, 50, 60, 40) },
  { name: 'Economic Freedom Fighters', group: 'world', where: 'South Africa', doc: 'Founding Manifesto', year: 2013, color: '#C42318', coords: partyCoords(85, 85, 55, 45, 70, 65, 35, 35, 35, 30, 25, 55, 80) },
  { name: 'Morena', group: 'world', where: 'Mexico', doc: 'Proyecto de Nación 2018 to 2024', year: 2017, color: '#8E1A12', coords: partyCoords(60, 45, 45, 25, 65, 65, 35, 45, 40, 40, 35, 40, 60) },
  { name: 'Law and Justice', group: 'world', where: 'Poland', doc: 'Polski model państwa dobrobytu', year: 2019, color: '#16264D', coords: partyCoords(55, 35, 65, 40, 70, 85, 85, 85, 45, 30, 85, 65, 55) },
  { name: 'Communist Party of China', group: 'world', where: 'China', doc: 'Constitution of the Communist Party of China', year: 2022, color: '#8E1A12', coords: partyCoords(62, 60, 90, 92, 95, 82, 78, 62, 10, 50, 5, 78, 45) },
  { name: 'Liberal Party of Canada', group: 'world', where: 'Canada', doc: 'Canada Strong', year: 2025, color: '#B0307A', coords: partyCoords(45, 35, 48, 20, 50, 55, 35, 28, 25, 50, 25, 62, 45) },
  { name: 'Conservative Party of Canada', group: 'world', where: 'Canada', doc: 'Canada First: For a Change', year: 2025, color: '#0B6C75', coords: partyCoords(28, 22, 65, 25, 40, 68, 60, 58, 35, 18, 40, 68, 45) },
  { name: 'New Democratic Party', group: 'world', where: 'Canada', doc: 'Made for People. Built for Canada.', year: 2025, color: '#C42318', coords: partyCoords(62, 50, 35, 15, 48, 50, 22, 20, 50, 68, 22, 40, 58) },
  { name: 'Australian Labor Party', group: 'world', where: 'Australia', doc: 'ALP National Platform', year: 2023, color: '#B0307A', coords: partyCoords(50, 40, 45, 18, 55, 45, 30, 28, 40, 60, 28, 58, 35) },
  { name: 'New Zealand Labour Party', group: 'world', where: 'New Zealand', doc: 'What Better Means for New Zealand', year: 2026, color: '#B0307A', coords: partyCoords(52, 42, 48, 18, 50, 42, 35, 30, 45, 62, 25, 40, 35) },
  { name: "Spanish Socialist Workers' Party", group: 'world', where: 'Spain', doc: 'Adelante', year: 2023, color: '#10743F', coords: partyCoords(52, 38, 35, 12, 35, 20, 25, 15, 35, 70, 15, 45, 30) },
  { name: 'Brothers of Italy', group: 'world', where: 'Italy', doc: "Pronti a risollevare l'Italia", year: 2022, color: '#16264D', coords: partyCoords(40, 28, 70, 35, 60, 78, 80, 78, 40, 35, 60, 68, 60) },
  { name: 'Party for Freedom', group: 'world', where: 'Netherlands', doc: 'Dit is uw land!', year: 2025, color: '#16264D', coords: partyCoords(50, 35, 75, 35, 65, 88, 95, 60, 45, 12, 30, 60, 60) },
  { name: 'La Libertad Avanza', group: 'world', where: 'Argentina', doc: 'Plataforma Electoral Nacional', year: 2023, color: '#7A6000', coords: partyCoords(3, 3, 45, 30, 35, 55, 50, 65, 20, 10, 45, 60, 5) },
  { name: 'All Progressives Congress', group: 'world', where: 'Nigeria', doc: 'Renewed Hope 2023', year: 2022, color: '#1D3FBB', coords: partyCoords(45, 35, 62, 30, 45, 60, 45, 60, 25, 30, 50, 68, 60) },
  { name: 'United Russia', group: 'world', where: 'Russia', doc: "People's Programme", year: 2021, color: '#C42318', coords: partyCoords(55, 45, 70, 60, 78, 85, 65, 78, 25, 40, 55, 78, 60) },
  { name: 'Gerindra', group: 'world', where: 'Indonesia', doc: 'Asta Cita', year: 2023, color: '#C42318', coords: partyCoords(60, 50, 55, 35, 60, 78, 55, 65, 25, 30, 60, 72, 70) },
  { name: 'Swedish Social Democratic Party', group: 'world', where: 'Sweden', doc: 'Party Programme', year: 2025, color: '#C42318', coords: partyCoords(55, 45, 50, 10, 50, 40, 58, 20, 35, 62, 10, 60, 22) },
  { name: 'Sinn Féin', group: 'world', where: 'Ireland', doc: 'The Choice for Change', year: 2024, color: '#C42318', coords: partyCoords(62, 58, 42, 20, 50, 62, 45, 30, 50, 60, 25, 22, 45) },
  { name: 'Fianna Fáil', group: 'world', where: 'Ireland', doc: 'Moving Forward. Together.', year: 2024, color: '#0B6C75', coords: partyCoords(42, 35, 55, 18, 55, 40, 45, 45, 40, 58, 40, 38, 20) },
  { name: 'Chega', group: 'world', where: 'Portugal', doc: 'Salvar Portugal', year: 2025, color: '#16264D', coords: partyCoords(35, 25, 82, 40, 55, 78, 88, 80, 50, 35, 62, 65, 50) },
  { name: 'New Democracy', group: 'world', where: 'Greece', doc: 'Programme 2023 to 2027', year: 2023, color: '#0B6C75', coords: partyCoords(30, 22, 65, 22, 55, 55, 65, 58, 25, 50, 55, 68, 22) },
  { name: 'Tisza Party', group: 'world', where: 'Hungary', doc: 'A működő és emberséges Magyarország alapjai', year: 2026, color: '#0B6C75', coords: partyCoords(38, 35, 50, 12, 30, 50, 72, 55, 40, 58, 50, 52, 35) },
  { name: 'Freedom Party of Austria', group: 'world', where: 'Austria', doc: 'Festung Österreich, Festung der Freiheit', year: 2024, color: '#16264D', coords: partyCoords(35, 25, 70, 35, 45, 85, 92, 80, 60, 30, 55, 40, 60) },
  { name: "Swiss People's Party", group: 'world', where: 'Switzerland', doc: 'Für eine sichere Zukunft in Freiheit', year: 2023, color: '#16264D', coords: partyCoords(20, 15, 55, 10, 12, 88, 88, 78, 45, 28, 55, 62, 45) },
  { name: 'Norwegian Labour Party', group: 'world', where: 'Norway', doc: 'Trygghet for morgendagen, tro på framtida', year: 2025, color: '#C42318', coords: partyCoords(58, 52, 52, 12, 50, 30, 50, 28, 35, 55, 25, 62, 25) },
  { name: 'Progress Party of Norway', group: 'world', where: 'Norway', doc: 'Mer frihet', year: 2025, color: '#7A6000', coords: partyCoords(15, 12, 62, 15, 35, 62, 82, 55, 30, 15, 45, 70, 20) },
  { name: 'Social Democrats of Denmark', group: 'world', where: 'Denmark', doc: 'Fælles om Danmark', year: 2017, color: '#C42318', coords: partyCoords(58, 50, 55, 12, 50, 45, 68, 32, 40, 65, 30, 50, 30) },
  { name: 'Finns Party', group: 'world', where: 'Finland', doc: 'Periaateohjelma', year: 2018, color: '#16264D', coords: partyCoords(48, 38, 65, 22, 40, 85, 88, 75, 50, 35, 58, 65, 55) },
  { name: 'Servant of the People', group: 'world', where: 'Ukraine', doc: 'Election programme', year: 2019, color: '#7A6000', coords: partyCoords(25, 25, 40, 15, 30, 55, 50, 45, 12, 50, 40, 60, 25) },
  { name: 'Pakistan Tehreek e Insaf', group: 'world', where: 'Pakistan', doc: 'Shandaar Pakistan, Shandaar Mustaqbil', year: 2024, color: '#6F45D0', coords: partyCoords(45, 35, 45, 35, 40, 68, 60, 72, 40, 55, 78, 55, 45) },
  { name: 'Bangladesh Nationalist Party', group: 'world', where: 'Bangladesh', doc: 'Election Manifesto 2026', year: 2026, color: '#1D3FBB', coords: partyCoords(42, 35, 45, 25, 40, 72, 58, 65, 35, 55, 62, 55, 45) },
  { name: 'Pakatan Harapan', group: 'world', where: 'Malaysia', doc: 'Kita Boleh!', year: 2022, color: '#0B6C75', coords: partyCoords(50, 48, 35, 18, 35, 45, 30, 50, 35, 60, 45, 40, 40) },
  { name: "People's Party of Thailand", group: 'world', where: 'Thailand', doc: 'Blueprint to Transform Thailand', year: 2026, color: '#B0307A', coords: partyCoords(50, 42, 22, 10, 15, 35, 35, 20, 22, 58, 25, 22, 35) },
  { name: 'United Democratic Alliance', group: 'world', where: 'Kenya', doc: 'The Plan', year: 2022, color: '#C42318', coords: partyCoords(55, 40, 45, 25, 35, 50, 50, 65, 25, 50, 62, 50, 55) },
  { name: 'Historic Pact', group: 'world', where: 'Colombia', doc: 'Tres revoluciones', year: 2026, color: '#10743F', coords: partyCoords(70, 62, 30, 25, 35, 45, 25, 22, 55, 80, 25, 18, 65) },
  { name: 'Republican Party of Chile', group: 'world', where: 'Chile', doc: 'La fuerza del cambio', year: 2025, color: '#7A6000', coords: partyCoords(15, 12, 88, 35, 60, 65, 80, 70, 35, 20, 60, 72, 20) },
  { name: 'Alliance 90/The Greens', group: 'world', where: 'Germany', doc: 'Zusammen wachsen', year: 2025, color: '#10743F', coords: partyCoords(50, 40, 30, 10, 40, 12, 20, 15, 50, 85, 25, 50, 40) },
  { name: 'Alternative for Germany', group: 'world', where: 'Germany', doc: 'Zeit für Deutschland', year: 2025, color: '#16264D', coords: partyCoords(25, 20, 70, 30, 45, 90, 92, 85, 30, 10, 55, 65, 55) },
  { name: 'Free Democratic Party', group: 'world', where: 'Germany', doc: 'Alles lässt sich ändern', year: 2025, color: '#7A6000', coords: partyCoords(12, 12, 20, 10, 40, 25, 45, 25, 12, 40, 25, 60, 10) },
  { name: 'Die Linke', group: 'world', where: 'Germany', doc: 'Alle wollen regieren. Wir wollen verändern.', year: 2025, color: '#10743F', coords: partyCoords(75, 70, 20, 10, 45, 10, 10, 12, 55, 75, 25, 10, 60) },
  { name: 'Renaissance', group: 'world', where: 'France', doc: 'Ensemble pour la République', year: 2024, color: '#B0307A', coords: partyCoords(30, 25, 55, 20, 55, 25, 50, 30, 20, 55, 15, 65, 35) },
  { name: 'Constitutional Democratic Party of Japan', group: 'world', where: 'Japan', doc: 'Party Platform', year: 2020, color: '#10743F', coords: partyCoords(55, 40, 25, 10, 25, 30, 25, 25, 55, 75, 30, 30, 40) },
  { name: 'Japanese Communist Party', group: 'world', where: 'Japan', doc: 'Programme of the Japanese Communist Party', year: 2020, color: '#10743F', coords: partyCoords(75, 75, 20, 15, 40, 45, 30, 20, 55, 75, 20, 5, 65) },
  { name: 'Liberal Party of Brazil', group: 'world', where: 'Brazil', doc: 'Para o Brasil Vencer o Atraso', year: 2026, color: '#6F45D0', coords: partyCoords(20, 20, 85, 40, 45, 70, 60, 85, 30, 25, 70, 65, 35) },
  { name: 'Democratic Alliance', group: 'world', where: 'South Africa', doc: "The DA's Rescue Plan for South Africa", year: 2024, color: '#7A6000', coords: partyCoords(18, 15, 60, 10, 20, 30, 45, 30, 30, 45, 30, 45, 20) },
  { name: 'National Action Party', group: 'world', where: 'Mexico', doc: 'Plataforma Electoral 2024', year: 2024, color: '#7A6000', coords: partyCoords(25, 20, 55, 15, 25, 40, 40, 70, 35, 55, 60, 45, 20) },
  { name: 'Civic Coalition', group: 'world', where: 'Poland', doc: '100 konkretów na 100 dni', year: 2023, color: '#B0307A', coords: partyCoords(35, 30, 25, 10, 30, 25, 50, 25, 40, 60, 20, 60, 35) }
];

const PARTY_GROUPS = [
  { id: 'all', label: 'All' },
  { id: 'uk', label: 'UK' },
  { id: 'us', label: 'US' },
  { id: 'past', label: 'Historical' },
  { id: 'world', label: 'World' }
];
