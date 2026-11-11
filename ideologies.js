/* ==========================================================================
   ETHOSSCALES
   ideologies.js : the 12 axes and the ideology matrix
   --------------------------------------------------------------------------
   Every axis runs from 0 to 100.
     0   = the "low" pole  (drawn in the axis color)
     100 = the "high" pole (drawn in black)
   Each axis also has a poster color, a text color that reads on it,
   and a geometric shape used on its questions.

   Every ideology is defined from a founding text, named in `source`.
   Descriptions paraphrase that text. They are not quotations.
   ========================================================================== */

const AXES = [
  { key: 'econ', param: 'e', name: 'Economy', color: '#D42A1C', ink: '#EEE6D3', shape: 'circle',
    low: { label: 'Market', short: 'Market' }, high: { label: 'Planned', short: 'Planned' },
    about: 'Who decides what gets made and at what price: buyers and sellers, or a plan.' },
  { key: 'own', param: 'o', name: 'Ownership', color: '#B0307A', ink: '#EEE6D3', shape: 'hexagon',
    low: { label: 'Private', short: 'Private' }, high: { label: 'Collective', short: 'Collective' },
    about: 'Who owns land, factories and firms: individuals, or the people who work and live there.' },
  { key: 'rights', param: 'r', name: 'Rights', color: '#1D3FBB', ink: '#EEE6D3', shape: 'chevron',
    low: { label: 'Liberty', short: 'Liberty' }, high: { label: 'Security', short: 'Security' },
    about: 'What wins when they clash: individual freedom, or public order and safety.' },
  { key: 'rule', param: 'd', name: 'Rule', color: '#7B52D9', ink: '#EEE6D3', shape: 'triangle',
    low: { label: 'Democracy', short: 'Democracy' }, high: { label: 'Autocracy', short: 'Autocracy' },
    about: 'Who holds power: everyone through votes and assemblies, or one leader or small group.' },
  { key: 'struct', param: 's', name: 'Structure', color: '#EE6C1B', ink: '#111111', shape: 'steps',
    low: { label: 'Decentralised', short: 'Decentralised' }, high: { label: 'Centralised', short: 'Centralised' },
    about: 'Where decisions are made: in towns, regions and networks, or in one capital.' },
  { key: 'nation', param: 'n', name: 'Nation', color: '#0E7C86', ink: '#EEE6D3', shape: 'shield',
    low: { label: 'Internationalist', short: 'Internationalist' }, high: { label: 'Nationalist', short: 'Nationalist' },
    about: 'Where loyalty lies: with humanity as a whole, or with your own nation first.' },
  { key: 'ident', param: 'i', name: 'Identity', color: '#E5457D', ink: '#111111', shape: 'arch',
    low: { label: 'Multiculturalism', short: 'Multicultural' }, high: { label: 'Assimilation', short: 'Assimilation' },
    about: 'How cultures share a country: many side by side, or one common culture for all.' },
  { key: 'cult', param: 'c', name: 'Culture', color: '#C2A46B', ink: '#111111', shape: 'diamond',
    low: { label: 'Progressive', short: 'Progressive' }, high: { label: 'Traditional', short: 'Traditional' },
    about: 'How to treat inherited customs and morals: reform them, or conserve them.' },
  { key: 'tech', param: 't', name: 'Technology', color: '#F5B700', ink: '#111111', shape: 'cross',
    low: { label: 'Accelerationist', short: 'Accelerate' }, high: { label: 'Precautionary', short: 'Precaution' },
    about: 'How fast to push new technology: as fast as possible, or only once proven safe.' },
  { key: 'eco', param: 'ec', name: 'Ecology', color: '#14854F', ink: '#EEE6D3', shape: 'leaf',
    low: { label: 'Industrial', short: 'Industrial' }, high: { label: 'Deep Ecology', short: 'Deep Ecology' },
    about: 'What nature is for: a resource for human use, or something with worth of its own.' },
  { key: 'relig', param: 'rl', name: 'Religion', color: '#6FB7E8', ink: '#111111', shape: 'star',
    low: { label: 'Secular', short: 'Secular' }, high: { label: 'Religious', short: 'Religious' },
    about: 'The place of faith in public life: kept private, or the foundation of law and morals.' },
  { key: 'force', param: 'f', name: 'Force', color: '#9A9A8E', ink: '#111111', shape: 'square',
    low: { label: 'Pacifist', short: 'Pacifist' }, high: { label: 'Militarist', short: 'Militarist' },
    about: 'The role of armed force: a last resort to be minimised, or a source of strength.' }
];

/* Coordinates are listed in axis order:
   econ, own, rights, rule, struct, nation, ident, cult, tech, eco, relig, force */
function coords(...v) {
  const out = {};
  AXES.forEach((a, i) => { out[a.key] = v[i]; });
  return out;
}

/* family groups related ideologies, for example the Third Position movements. */
const IDEOLOGIES = [
  /* ---------------------- THIRD POSITION MOVEMENTS ---------------------- */
  {
    id: 'italian-fascism', name: 'Italian Fascism', family: 'Third Position',
    coords: coords(65, 35, 95, 95, 95, 95, 90, 75, 30, 20, 55, 100),
    figure: { name: 'Giovanni Gentile', years: '1875 to 1944' },
    source: { author: 'Giovanni Gentile and Benito Mussolini', work: 'The Doctrine of Fascism', year: 1932 },
    tagline: 'Everything within the state, nothing outside the state.',
    desc: 'Holds that the individual has meaning only through the nation, and the nation only through the state, which is an ethical and spiritual whole and not a referee between interests. Property stays private but must serve national ends, with employers and workers bound together in state corporations. It rejects liberal individualism, Marxist class struggle and pacifism alike, and treats struggle and war as what brings a people to its full strength.'
  },
  {
    id: 'falangism', name: 'Falangism', family: 'Third Position',
    coords: coords(70, 50, 90, 90, 90, 95, 90, 90, 50, 35, 90, 85),
    figure: { name: 'José Antonio Primo de Rivera', years: '1903 to 1936' },
    source: { author: 'José Antonio Primo de Rivera, Falange Española de las JONS', work: 'The Twenty Seven Points', year: 1934 },
    tagline: 'National syndicalism on a Catholic foundation.',
    desc: 'Defines Spain as a unity of destiny that stands above every region, class and party, and rejects separatism outright. The economy is to be organised as one giant syndicate of producers, with banking nationalised and land reformed, so that neither capitalism nor Marxism divides the nation. Unlike Italian Fascism, it places the Catholic sense of life at the centre of national reconstruction.'
  },
  {
    id: 'peronism', name: 'Peronism (Justicialism)', family: 'Third Position',
    coords: coords(65, 45, 65, 60, 75, 85, 65, 65, 40, 30, 65, 55),
    figure: { name: 'Juan Perón', years: '1895 to 1974' },
    source: { author: 'Juan Domingo Perón', work: 'The Organised Community and the Twenty Truths', year: 1950 },
    tagline: 'Social justice, economic independence, political sovereignty.',
    desc: 'The origin of the phrase Third Position: a path between capitalist individualism and communist collectivism, declared by Perón in the 1940s. It aims at an organised community in which the state balances capital and labour, unions are a pillar of the nation, and capital serves the economy and the economy serves social wellbeing. It is national and popular in character, and it seeks its mandate through mass elections.'
  },
  {
    id: 'strasserism', name: 'Strasserism', family: 'Third Position',
    coords: coords(80, 70, 85, 85, 45, 95, 95, 75, 55, 45, 50, 75),
    figure: { name: 'Otto Strasser', years: '1897 to 1974' },
    source: { author: 'Otto Strasser', work: 'Germany Tomorrow', year: 1940 },
    tagline: 'A national socialism turned against big capital.',
    desc: 'The anti capitalist wing that broke with Hitler in 1930. Strasser wanted large industry and estates broken up, with ownership shared between the state, the workers and managers through a system of entailed tenure. He proposed a federal Germany of self governing regions and professional estates, and a return of much of the population to the land, while remaining intensely nationalist.'
  },
  {
    id: 'national-bolshevism', name: 'National Bolshevism', family: 'Third Position',
    coords: coords(95, 90, 95, 95, 95, 90, 85, 65, 30, 20, 15, 95),
    figure: { name: 'Ernst Niekisch', years: '1889 to 1967' },
    source: { author: 'Ernst Niekisch', work: 'Widerstand essays and Hitler: A German Fate', year: 1932 },
    tagline: 'Soviet style planning in the service of the nation.',
    desc: 'Niekisch argued that Germany could only escape the liberal West by adopting a fully planned, state owned economy and aligning with Soviet Russia. The nation, not the international working class, is the subject of the revolution. It is militarised, anti liberal and anti bourgeois, and unlike Falangism it has no religious foundation.'
  },
  {
    id: 'eurasianism', name: 'Eurasianism (Fourth Political Theory)', family: 'Third Position',
    coords: coords(65, 50, 85, 90, 65, 80, 40, 95, 80, 55, 90, 90),
    figure: { name: 'Aleksandr Dugin', years: 'born 1962' },
    source: { author: 'Aleksandr Dugin', work: 'The Fourth Political Theory', year: 2009 },
    tagline: 'Against liberalism, communism and fascism alike.',
    desc: 'Claims that liberalism, communism and fascism are all exhausted products of Western modernity, and proposes a fourth theory built on tradition and on distinct civilisations. It wants a multipolar world of large land based blocs in place of one global order. Inside such a bloc, each people is meant to keep its own faith and customs under a strong sacral authority.'
  },
  {
    id: 'baathism', name: 'Ba\'athism', family: 'Third Position',
    coords: coords(75, 65, 85, 85, 90, 95, 85, 50, 35, 20, 35, 80),
    figure: { name: 'Michel Aflaq', years: '1910 to 1989' },
    source: { author: 'Michel Aflaq', work: 'On the Way of Resurrection (collected essays)', year: 1959 },
    tagline: 'Unity, freedom, socialism.',
    desc: 'Calls for the rebirth of a single Arab nation, divided by colonial borders, into one state. Its socialism means state direction of the economy for national development, not class war. It is secular in government while treating Islam as part of Arab cultural heritage, and it organises through a vanguard party.'
  },

  /* ----------------------------- COMMUNIST ------------------------------ */
  {
    id: 'marxism-leninism', name: 'Marxism Leninism', family: 'Communist',
    coords: coords(100, 100, 90, 85, 95, 30, 45, 30, 15, 15, 0, 75),
    figure: { name: 'Vladimir Lenin', years: '1870 to 1924' },
    source: { author: 'V. I. Lenin', work: 'The State and Revolution', year: 1917 },
    tagline: 'A vanguard party leads the workers to state power.',
    desc: 'Holds that the working class must seize the state through a disciplined vanguard party and use it to abolish private ownership of the means of production. The economy is then centrally planned. The state is expected to wither away only after class divisions have disappeared.'
  },
  {
    id: 'maoism', name: 'Maoism', family: 'Communist',
    coords: coords(95, 100, 95, 85, 75, 60, 60, 15, 45, 15, 0, 90),
    figure: { name: 'Mao Zedong', years: '1893 to 1976' },
    source: { author: 'Mao Zedong', work: 'On New Democracy', year: 1940 },
    tagline: 'Peasant revolution, the mass line, protracted people\'s war.',
    desc: 'Adapts Marxism Leninism to an agrarian country by making the peasantry the main revolutionary force. The party is meant to draw its line from the masses and return it to them, and to keep class struggle going even after taking power. It is openly hostile to inherited tradition and treats armed struggle as the road to power.'
  },
  {
    id: 'juche', name: 'Juche', family: 'Communist',
    coords: coords(100, 95, 100, 100, 100, 100, 100, 70, 35, 15, 10, 100),
    figure: { name: 'Kim Il Sung', years: '1912 to 1994' },
    source: { author: 'Kim Jong Il', work: 'On the Juche Idea', year: 1982 },
    tagline: 'Self reliance in ideology, politics, economy and defence.',
    desc: 'Teaches that the masses are masters of the revolution but can only act through a single supreme leader. The nation must depend on no outside power, which means a closed, planned economy and a military first posture. It combines total state ownership with an intense, ethnically defined nationalism.'
  },
  {
    id: 'council-communism', name: 'Council Communism', family: 'Communist',
    coords: coords(80, 100, 30, 5, 15, 5, 30, 20, 30, 35, 5, 40),
    figure: { name: 'Anton Pannekoek', years: '1873 to 1960' },
    source: { author: 'Anton Pannekoek', work: 'Workers\' Councils', year: 1946 },
    tagline: 'All power to the workers\' councils, none to the party.',
    desc: 'Rejects both parliament and the Leninist party as ways of ruling over workers. Power should rest in councils elected in each workplace, with delegates who can be recalled at any time. Production is collectively owned and coordinated from below.'
  },

  /* ----------------------------- ANARCHIST ------------------------------ */
  {
    id: 'anarcho-communism', name: 'Anarcho Communism', family: 'Anarchist',
    coords: coords(70, 100, 0, 0, 0, 0, 20, 15, 40, 60, 10, 30),
    figure: { name: 'Peter Kropotkin', years: '1842 to 1921' },
    source: { author: 'Peter Kropotkin', work: 'The Conquest of Bread', year: 1892 },
    tagline: 'From each according to ability, to each according to need, with no state.',
    desc: 'Argues that everything produced is the common inheritance of humanity, so both the state and private property should be abolished at once. Free communes would federate voluntarily and share goods according to need, without wages or money. Kropotkin grounded this in mutual aid as a factor of evolution.'
  },
  {
    id: 'anarcho-syndicalism', name: 'Anarcho Syndicalism', family: 'Anarchist',
    coords: coords(70, 95, 5, 0, 10, 0, 20, 20, 35, 45, 5, 35),
    figure: { name: 'Rudolf Rocker', years: '1873 to 1958' },
    source: { author: 'Rudolf Rocker', work: 'Anarcho Syndicalism: Theory and Practice', year: 1938 },
    tagline: 'The union is both the weapon and the future society.',
    desc: 'Sees revolutionary trade unions as the means of struggle today and the structure of the economy tomorrow. Workers take over production directly through the general strike and run it through federated unions. It refuses political parties and the conquest of state power.'
  },
  {
    id: 'mutualism', name: 'Mutualism', family: 'Anarchist',
    coords: coords(15, 65, 5, 5, 0, 15, 35, 45, 45, 50, 15, 25),
    figure: { name: 'Pierre Joseph Proudhon', years: '1809 to 1865' },
    source: { author: 'Pierre Joseph Proudhon', work: 'What Is Property?', year: 1840 },
    tagline: 'Markets without landlords, bosses or bankers.',
    desc: 'Distinguishes property used to extract rent and interest, which Proudhon called theft, from possession based on personal use, which he defended. Free producers and cooperatives would trade in a market, financed by mutual credit at cost. Society would be held together by contracts and federation instead of a state.'
  },
  {
    id: 'egoist-anarchism', name: 'Egoist Anarchism', family: 'Anarchist',
    coords: coords(30, 40, 0, 0, 0, 0, 30, 5, 50, 50, 0, 30),
    figure: { name: 'Max Stirner', years: '1806 to 1856' },
    source: { author: 'Max Stirner', work: 'The Ego and Its Own', year: 1844 },
    tagline: 'No god, no state, no cause above the individual.',
    desc: 'Treats the state, the nation, morality, religion and even humanity as fixed ideas that people serve against their own interest. The individual owes nothing to any of them. Stirner proposed a union of egoists: free association that lasts only as long as it serves each member. This is the root of later post left anarchism.'
  },
  {
    id: 'tolstoyanism', name: 'Tolstoyan Anarcho Pacifism', family: 'Anarchist',
    coords: coords(50, 80, 0, 0, 0, 0, 30, 70, 85, 80, 95, 0),
    figure: { name: 'Leo Tolstoy', years: '1828 to 1910' },
    source: { author: 'Leo Tolstoy', work: 'The Kingdom of God Is Within You', year: 1894 },
    tagline: 'Resist not evil by force.',
    desc: 'Takes the Sermon on the Mount literally and concludes that all violence is forbidden, which rules out armies, courts, police and therefore the state itself. Christians should refuse military service, oaths and taxes for war. Tolstoy paired this with simple rural living and shared land.'
  },
  {
    id: 'social-ecology', name: 'Social Ecology (Communalism)', family: 'Anarchist',
    coords: coords(60, 90, 5, 0, 0, 5, 20, 15, 35, 90, 5, 25),
    figure: { name: 'Murray Bookchin', years: '1921 to 2006' },
    source: { author: 'Murray Bookchin', work: 'The Ecology of Freedom', year: 1982 },
    tagline: 'The domination of nature begins with the domination of people.',
    desc: 'Argues that ecological destruction comes from social hierarchy, so it cannot be solved without ending hierarchy. Bookchin proposed libertarian municipalism: face to face citizens\' assemblies that own the local economy and confederate with each other. Technology is welcome when it is humanly scaled and liberates people from toil.'
  },
  {
    id: 'anarcho-primitivism', name: 'Anarcho Primitivism', family: 'Anarchist',
    coords: coords(50, 90, 0, 0, 0, 0, 30, 40, 100, 100, 20, 30),
    figure: { name: 'John Zerzan', years: 'born 1943' },
    source: { author: 'John Zerzan', work: 'Future Primitive', year: 1994 },
    tagline: 'Civilisation itself is the problem.',
    desc: 'Locates the origin of domination in agriculture, the division of labour and symbolic culture, not just in the state or capitalism. It holds that hunter gatherer life was freer, healthier and more equal. The goal is to undo industrial civilisation and return to small, wild, face to face bands.'
  },
  {
    id: 'agorism', name: 'Agorism', family: 'Anarchist',
    coords: coords(0, 5, 0, 10, 0, 0, 35, 30, 20, 25, 10, 10),
    figure: { name: 'Samuel Edward Konkin III', years: '1947 to 2004' },
    source: { author: 'Samuel Edward Konkin III', work: 'New Libertarian Manifesto', year: 1980 },
    tagline: 'Starve the state through the counter economy.',
    desc: 'Rejects voting and political parties as ways to reach a free society. The strategy is counter economics: peaceful trade in black and grey markets that the state cannot tax or regulate. As this parallel economy grows it is meant to supply protection and arbitration too, until the state has nothing left to do.'
  },
  {
    id: 'crypto-anarchism', name: 'Crypto Anarchism', family: 'Anarchist',
    coords: coords(0, 0, 0, 20, 0, 0, 40, 35, 0, 15, 5, 15),
    figure: { name: 'Timothy C. May', years: '1951 to 2018' },
    source: { author: 'Timothy C. May', work: 'The Crypto Anarchist Manifesto', year: 1988 },
    tagline: 'Strong cryptography makes the state unable to see or tax.',
    desc: 'Predicts that encryption, anonymous networks and digital cash will let people communicate and trade with total privacy. Once transactions cannot be traced, governments lose the ability to tax, regulate and control information. May saw this as a technical fact that would change society whether or not anyone approved.'
  },

  /* ---------------------- SOCIALIST AND SOCIAL DEMOCRATIC ---------------------- */
  {
    id: 'social-democracy', name: 'Social Democracy', family: 'Socialist',
    coords: coords(60, 55, 35, 10, 60, 35, 30, 30, 35, 50, 20, 30),
    figure: { name: 'Eduard Bernstein', years: '1850 to 1932' },
    source: { author: 'Eduard Bernstein', work: 'Evolutionary Socialism', year: 1899 },
    tagline: 'The movement is everything, the final goal is nothing.',
    desc: 'Bernstein argued that capitalism was not heading for collapse, so socialists should pursue steady reform through parliament, unions and cooperatives instead of revolution. Democracy is both the means and the end. Socialism becomes the gradual extension of rights and security to everyone.'
  },
  {
    id: 'market-socialism', name: 'Market Socialism', family: 'Socialist',
    coords: coords(55, 85, 35, 15, 60, 30, 35, 30, 30, 40, 15, 35),
    figure: { name: 'Oskar Lange', years: '1904 to 1965' },
    source: { author: 'Oskar Lange', work: 'On the Economic Theory of Socialism', year: 1936 },
    tagline: 'Public ownership, with prices doing the work.',
    desc: 'Lange\'s reply to Mises: an economy can own its industries in common and still calculate rationally. A planning board sets prices by trial and error, and managers of public firms respond to them as they would in a market. Consumers keep free choice of goods and jobs.'
  },
  {
    id: 'georgism', name: 'Georgism', family: 'Socialist',
    coords: coords(25, 35, 20, 15, 40, 30, 35, 40, 35, 55, 35, 30),
    figure: { name: 'Henry George', years: '1839 to 1897' },
    source: { author: 'Henry George', work: 'Progress and Poverty', year: 1879 },
    tagline: 'Tax land, not labour.',
    desc: 'Asks why poverty persists as wealth grows, and answers that landowners capture the gains as rent. Since nobody made the land, its value belongs to the community. George proposed a single tax on land value to replace taxes on work and trade, leaving everything people produce as their own.'
  },
  {
    id: 'left-accelerationism', name: 'Left Accelerationism', family: 'Socialist',
    coords: coords(85, 85, 35, 20, 55, 5, 20, 5, 0, 30, 0, 30),
    figure: { name: 'Nick Srnicek', years: 'born 1982' },
    source: { author: 'Alex Williams and Nick Srnicek', work: '#Accelerate: Manifesto for an Accelerationist Politics', year: 2013 },
    tagline: 'Demand full automation.',
    desc: 'Argues the left should stop defending local, small scale resistance and instead take over the technology that capitalism built. Automation, logistics and planning tools should be repurposed toward a world without work. Its demands include full automation, a universal basic income and a shorter working week.'
  },
  {
    id: 'democratic-transhumanism', name: 'Democratic Transhumanism', family: 'Socialist',
    coords: coords(55, 45, 15, 5, 55, 10, 15, 5, 0, 40, 5, 25),
    figure: { name: 'James Hughes', years: 'born 1961' },
    source: { author: 'James Hughes', work: 'Citizen Cyborg', year: 2004 },
    tagline: 'The right to enhance, with fair access for all.',
    desc: 'Holds that people should be free to use technology to extend their lives and abilities, and that democratic states must make sure these benefits are safe and shared. It opposes both bioconservatives who would ban enhancement and libertarians who would leave it to the market. Hughes treats control over one\'s own body and mind as a civil right.'
  },

  /* ------------------------------ LIBERAL ------------------------------- */
  {
    id: 'classical-liberalism', name: 'Classical Liberalism', family: 'Liberal',
    coords: coords(25, 25, 5, 20, 35, 30, 35, 30, 30, 35, 15, 35),
    figure: { name: 'John Stuart Mill', years: '1806 to 1873' },
    source: { author: 'John Stuart Mill', work: 'On Liberty', year: 1859 },
    tagline: 'Power may only be used over someone to prevent harm to others.',
    desc: 'Mill\'s harm principle: society may restrict a person only to stop them harming someone else, never for their own good. Freedom of thought, speech and ways of living must be protected even against the majority. Government should be representative and limited.'
  },
  {
    id: 'social-liberalism', name: 'Social Liberalism', family: 'Liberal',
    coords: coords(45, 35, 15, 5, 50, 25, 20, 20, 35, 50, 10, 30),
    figure: { name: 'John Rawls', years: '1921 to 2002' },
    source: { author: 'John Rawls', work: 'A Theory of Justice', year: 1971 },
    tagline: 'Justice as fairness.',
    desc: 'Asks what rules people would choose if they did not know their own place in society. Rawls answers: equal basic liberties for all first, then inequalities only where they benefit the least well off and positions are open to everyone. This supports markets alongside strong redistribution and public provision.'
  },
  {
    id: 'ordoliberalism', name: 'Ordoliberalism', family: 'Liberal',
    coords: coords(30, 15, 35, 20, 55, 40, 50, 55, 40, 35, 50, 40),
    figure: { name: 'Walter Eucken', years: '1891 to 1950' },
    source: { author: 'Walter Eucken', work: 'Principles of Economic Policy', year: 1952 },
    tagline: 'A strong state to keep markets competitive.',
    desc: 'Argues that free markets do not maintain themselves, because firms form cartels and monopolies. The state must set and enforce a firm framework of rules: stable money, open markets, liability and strict competition law. It should not steer the economy day to day. This is the basis of the German social market economy.'
  },
  {
    id: 'minarchism', name: 'Minarchist Libertarianism', family: 'Liberal',
    coords: coords(5, 0, 10, 25, 25, 20, 40, 40, 20, 15, 15, 30),
    figure: { name: 'Robert Nozick', years: '1938 to 2002' },
    source: { author: 'Robert Nozick', work: 'Anarchy, State, and Utopia', year: 1974 },
    tagline: 'The night watchman state, and nothing more.',
    desc: 'Starts from individual rights so strong that they limit what any state may do. Only a minimal state that protects against force, theft and fraud and enforces contracts can be justified. Anything more, including taxing some people to help others, violates rights.'
  },
  {
    id: 'anarcho-capitalism', name: 'Anarcho Capitalism', family: 'Liberal',
    coords: coords(0, 0, 0, 30, 0, 15, 45, 55, 20, 10, 25, 15),
    figure: { name: 'Murray Rothbard', years: '1926 to 1995' },
    source: { author: 'Murray Rothbard', work: 'For a New Liberty', year: 1973 },
    tagline: 'Even law and defence should be supplied by the market.',
    desc: 'Builds everything on self ownership and the non aggression principle. Because taxation is taken by force, the state is a criminal organisation by its nature. Courts, police and defence should be provided by competing private firms, and all property should be privately owned.'
  },

  /* ---------------------------- CONSERVATIVE ---------------------------- */
  {
    id: 'burkean-conservatism', name: 'Burkean Conservatism', family: 'Conservative',
    coords: coords(30, 15, 50, 50, 40, 65, 70, 95, 65, 50, 80, 55),
    figure: { name: 'Edmund Burke', years: '1729 to 1797' },
    source: { author: 'Edmund Burke', work: 'Reflections on the Revolution in France', year: 1790 },
    tagline: 'Society is a partnership of the dead, the living and the unborn.',
    desc: 'Distrusts schemes that rebuild society from abstract principles, because inherited institutions hold more accumulated wisdom than any one generation can see. Change should be gradual and should repair, not replace. Family, church and local attachments, the little platoons, are where loyalty to the wider nation begins.'
  },
  {
    id: 'reactionary-monarchism', name: 'Reactionary Monarchism', family: 'Conservative',
    coords: coords(45, 25, 90, 100, 85, 60, 85, 100, 80, 45, 100, 70),
    figure: { name: 'Joseph de Maistre', years: '1753 to 1821' },
    source: { author: 'Joseph de Maistre', work: 'Considerations on France', year: 1797 },
    tagline: 'Throne and altar.',
    desc: 'Reads the French Revolution as divine punishment for a society that put human reason above God. No constitution can be written by men; legitimate authority grows from history and providence. Order requires an absolute monarch, and above him the spiritual authority of the Pope.'
  },
  {
    id: 'christian-democracy', name: 'Christian Democracy', family: 'Conservative',
    coords: coords(45, 30, 40, 15, 35, 35, 45, 75, 55, 50, 85, 35),
    figure: { name: 'Jacques Maritain', years: '1882 to 1973' },
    source: { author: 'Jacques Maritain', work: 'Integral Humanism', year: 1936 },
    tagline: 'The dignity of the person, in a pluralist democracy.',
    desc: 'Grounds democracy and human rights in the Christian view of the person, against both individualism and collectivism. Decisions belong at the lowest level able to handle them, with family, church and associations standing between the individual and the state. It supports markets tempered by solidarity and a welfare safety net.'
  },
  {
    id: 'distributism', name: 'Distributism', family: 'Conservative',
    coords: coords(30, 30, 30, 25, 10, 55, 60, 90, 75, 65, 95, 35),
    figure: { name: 'G. K. Chesterton', years: '1874 to 1936' },
    source: { author: 'Hilaire Belloc and G. K. Chesterton', work: 'The Servile State (1912) and The Outline of Sanity', year: 1926 },
    tagline: 'Three acres and a cow.',
    desc: 'The problem with capitalism is too few capitalists. Belloc and Chesterton held that concentrated ownership, whether by big business or by the state, reduces most people to dependence. Productive property should be spread as widely as possible among families, small farms, workshops and guilds, in line with Catholic social teaching.'
  },
  {
    id: 'national-conservatism', name: 'National Conservatism', family: 'Conservative',
    coords: coords(40, 20, 60, 35, 60, 95, 85, 85, 55, 30, 80, 65),
    figure: { name: 'Yoram Hazony', years: 'born 1964' },
    source: { author: 'Yoram Hazony', work: 'The Virtue of Nationalism', year: 2018 },
    tagline: 'A world of independent nations, not a universal order.',
    desc: 'Argues that the best political order is one of free and independent national states, each ruling itself by its own traditions. It opposes both liberal internationalism and empire as attempts to impose one law on all peoples. A nation is held together by mutual loyalty, shared language, religion and history, not by abstract rights alone.'
  },

  /* --------------------------- NEOREACTIONARY --------------------------- */
  {
    id: 'neo-cameralism', name: 'Neo Cameralism', family: 'Neoreactionary',
    coords: coords(10, 0, 60, 100, 30, 30, 60, 75, 15, 15, 35, 50),
    figure: { name: 'Curtis Yarvin', years: 'born 1973' },
    source: { author: 'Curtis Yarvin, writing as Mencius Moldbug', work: 'Patchwork: A Political System for the 21st Century', year: 2008 },
    tagline: 'The state as a company, the ruler as its chief executive.',
    desc: 'Treats a state as a business that owns a country. It should be run for profit by a chief executive who answers to shareholders, with no elections. Yarvin imagines a patchwork of many small sovereign corporations competing for residents, whose main protection is the freedom to leave.'
  },
  {
    id: 'right-accelerationism', name: 'Right Accelerationism', family: 'Neoreactionary',
    coords: coords(0, 0, 40, 85, 15, 10, 55, 50, 0, 0, 10, 45),
    figure: { name: 'Nick Land', years: 'born 1962' },
    source: { author: 'Nick Land', work: 'The Dark Enlightenment', year: 2012 },
    tagline: 'Capital and technology are an intelligence to be unleashed.',
    desc: 'Sees capitalism and technology as one self reinforcing process that is outrunning human control, and holds that this should be sped up, not restrained. Democracy is treated as a brake that consumes the future for present comfort. Land favours exit into competing, non democratic jurisdictions over any attempt at reform.'
  },
  {
    id: 'network-state', name: 'Network State', family: 'Neoreactionary',
    coords: coords(10, 10, 20, 45, 5, 5, 45, 45, 0, 25, 25, 20),
    figure: { name: 'Balaji Srinivasan', years: 'born 1980' },
    source: { author: 'Balaji Srinivasan', work: 'The Network State', year: 2022 },
    tagline: 'Cloud first, land last.',
    desc: 'A network state begins as an online community with a shared moral purpose and a recognised founder. It organises collective action, crowdfunds territory around the world, and eventually seeks diplomatic recognition. Membership is opt in, recorded on a blockchain, and can be left at will.'
  },

  /* ------------------------ GREEN AND TECHNOCRATIC ----------------------- */
  {
    id: 'deep-ecology', name: 'Deep Ecology', family: 'Green',
    coords: coords(55, 60, 30, 15, 15, 15, 25, 40, 85, 100, 40, 5),
    figure: { name: 'Arne Næss', years: '1912 to 2009' },
    source: { author: 'Arne Næss', work: 'The Shallow and the Deep, Long Range Ecology Movement', year: 1973 },
    tagline: 'All life has value in itself.',
    desc: 'Næss separated shallow environmentalism, which protects nature for human benefit, from deep ecology, which holds that every living thing has worth of its own. Humans have no right to reduce the richness of life except to meet vital needs. This implies a smaller human population and a much lighter way of living.'
  },
  {
    id: 'eco-authoritarianism', name: 'Eco Authoritarianism', family: 'Green',
    coords: coords(85, 70, 100, 95, 90, 70, 75, 65, 95, 100, 20, 80),
    figure: { name: 'Pentti Linkola', years: '1932 to 2020' },
    source: { author: 'Pentti Linkola', work: 'Can Life Prevail?', year: 2004 },
    tagline: 'Only a firm hand can stop the ecological collapse.',
    desc: 'Linkola held that democracy and consumer freedom cannot stop ecological destruction, because people will not vote to give up comfort. He called for a strong central authority to end economic growth, dismantle most industry and sharply reduce both consumption and population. The survival of life as a whole ranks above individual human rights.'
  },
  {
    id: 'technocracy', name: 'Technocracy', family: 'Green',
    coords: coords(100, 85, 60, 85, 100, 50, 60, 40, 5, 35, 5, 40),
    figure: { name: 'Howard Scott', years: '1890 to 1970' },
    source: { author: 'Howard Scott and Technocracy Inc.', work: 'Technocracy Study Course', year: 1934 },
    tagline: 'Government by engineers, accounting in energy.',
    desc: 'Argued that politics and the price system could not manage an economy of abundance. Scott proposed replacing both with a continental Technate run by engineers and scientists chosen for competence. Money would be replaced by energy certificates, and production planned as an engineering problem.'
  }
];
