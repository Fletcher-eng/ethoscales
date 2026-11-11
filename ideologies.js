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
  { key: 'econ', param: 'e', name: 'Economy', color: '#C42318', ink: '#EEE6D3', shape: 'circle',
    low: { label: 'Market', short: 'Market' }, high: { label: 'Planned', short: 'Planned' },
    about: 'Who decides what gets made and at what price: buyers and sellers, or a plan.' },
  { key: 'own', param: 'o', name: 'Ownership', color: '#B0307A', ink: '#EEE6D3', shape: 'hexagon',
    low: { label: 'Private', short: 'Private' }, high: { label: 'Collective', short: 'Collective' },
    about: 'Who owns land, factories and firms: individuals, or the people who work and live there.' },
  { key: 'rights', param: 'r', name: 'Rights', color: '#1D3FBB', ink: '#EEE6D3', shape: 'chevron',
    low: { label: 'Liberty', short: 'Liberty' }, high: { label: 'Security', short: 'Security' },
    about: 'What wins when they clash: individual freedom, or public order and safety.' },
  { key: 'rule', param: 'd', name: 'Rule', color: '#6F45D0', ink: '#EEE6D3', shape: 'triangle',
    low: { label: 'Democracy', short: 'Democracy' }, high: { label: 'Autocracy', short: 'Autocracy' },
    about: 'Who holds power: everyone through votes and assemblies, or one leader or small group.' },
  { key: 'struct', param: 's', name: 'Structure', color: '#EE6C1B', ink: '#111111', shape: 'steps',
    low: { label: 'Decentralised', short: 'Decentralised' }, high: { label: 'Centralised', short: 'Centralised' },
    about: 'Where decisions are made: in towns, regions and networks, or in one capital.' },
  { key: 'nation', param: 'n', name: 'Nation', color: '#0B6C75', ink: '#EEE6D3', shape: 'shield',
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
  { key: 'eco', param: 'ec', name: 'Ecology', color: '#10743F', ink: '#EEE6D3', shape: 'leaf',
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
    id: 'technocracy', name: 'Technocracy', family: 'Technological',
    coords: coords(100, 85, 60, 85, 100, 50, 60, 40, 5, 35, 5, 40),
    figure: { name: 'Howard Scott', years: '1890 to 1970' },
    source: { author: 'Howard Scott and Technocracy Inc.', work: 'Technocracy Study Course', year: 1934 },
    tagline: 'Government by engineers, accounting in energy.',
    desc: 'Argued that politics and the price system could not manage an economy of abundance. Scott proposed replacing both with a continental Technate run by engineers and scientists chosen for competence. Money would be replaced by energy certificates, and production planned as an engineering problem.'
  },

  /* ------------------------- MORE THIRD POSITION ------------------------- */
  {
    id: 'national-socialism', name: 'National Socialism', family: 'Third Position',
    coords: coords(70, 40, 100, 100, 100, 100, 100, 80, 30, 45, 35, 100),
    figure: { name: 'Adolf Hitler', years: '1889 to 1945' },
    source: { author: 'NSDAP and Adolf Hitler', work: 'The Twenty Five Point Programme (1920) and Mein Kampf', year: 1925 },
    tagline: 'Race above state, class and individual.',
    desc: 'Differs from Italian Fascism by putting race, not the state, at the centre: the state exists only to preserve and expand a racially defined people. Its core doctrines are antisemitism, the leader principle of total obedience upward, and the conquest of living space in the east. In power it destroyed every rival institution and carried out the Holocaust and a war of extermination.'
  },
  {
    id: 'national-syndicalism', name: 'National Syndicalism', family: 'Third Position',
    coords: coords(80, 65, 90, 90, 90, 95, 90, 60, 35, 30, 35, 95),
    figure: { name: 'Ramiro Ledesma Ramos', years: '1905 to 1936' },
    source: { author: 'Ramiro Ledesma Ramos', work: 'La Conquista del Estado manifesto', year: 1931 },
    tagline: 'The syndicates of the left, the nation of the right.',
    desc: 'Ledesma fused the revolutionary unions of syndicalism with radical nationalism, before Falangism absorbed his movement. The whole economy is to be organised into compulsory state syndicates, with big wealth subordinated to national ends. It is more secular, more worker focused and more openly revolutionary than the Catholic Falangism it merged into.'
  },
  {
    id: 'brazilian-integralism', name: 'Brazilian Integralism', family: 'Third Position',
    coords: coords(65, 40, 85, 90, 85, 90, 70, 90, 50, 35, 95, 70),
    figure: { name: 'Plínio Salgado', years: '1895 to 1975' },
    source: { author: 'Plínio Salgado', work: 'The October Manifesto', year: 1932 },
    tagline: 'God, fatherland, family.',
    desc: 'Calls for an integral state that unites every class and region of Brazil under a spiritual conception of life. It is corporatist and anti liberal like European fascism, but it rejects racial doctrine and presents the nation as a fusion of all its peoples. Christian faith is treated as the foundation of the whole political order.'
  },
  {
    id: 'austrofascism', name: 'Austrofascism', family: 'Third Position',
    coords: coords(60, 30, 85, 90, 60, 70, 80, 95, 60, 40, 100, 60),
    figure: { name: 'Engelbert Dollfuss', years: '1892 to 1934' },
    source: { author: 'Engelbert Dollfuss', work: 'The Trabrennplatz Address', year: 1933 },
    tagline: 'A Christian state of estates, on an authoritarian basis.',
    desc: 'Dollfuss announced the end of parliament and parties and their replacement by a state organised into occupational estates, following the papal encyclical Quadragesimo Anno. It is Catholic and corporatist, and it defined itself against both Marxism and German National Socialism. Authority flows from above, with the Church as the moral centre.'
  },
  {
    id: 'third-international-theory', name: 'Third International Theory', family: 'Third Position',
    coords: coords(75, 85, 70, 25, 35, 85, 80, 85, 50, 40, 80, 65),
    figure: { name: 'Muammar Gaddafi', years: '1942 to 2011' },
    source: { author: 'Muammar Gaddafi', work: 'The Green Book', year: 1975 },
    tagline: 'Neither capitalism nor communism, but the state of the masses.',
    desc: 'The Green Book rejects parliaments and parties as a fraud on the people and proposes direct rule through popular congresses and committees. In economics it says workers should be partners, not wage earners, and that a house belongs to whoever lives in it. Nation, religion and custom are named as the natural basis of society. This describes the text, not how Libya was actually governed.'
  },
  {
    id: 'nasserism', name: 'Nasserism', family: 'Third Position',
    coords: coords(75, 65, 80, 85, 90, 95, 85, 50, 25, 15, 40, 80),
    figure: { name: 'Gamal Abdel Nasser', years: '1918 to 1970' },
    source: { author: 'Gamal Abdel Nasser', work: 'The Philosophy of the Revolution', year: 1954 },
    tagline: 'Arab unity, socialism, and no alignment with either bloc.',
    desc: 'Nasser placed Egypt at the centre of three circles: Arab, African and Islamic. The army is the vanguard that frees the nation from foreign control and feudal landowners. The state then drives development through nationalisation and land reform, while staying outside both the American and Soviet camps.'
  },
  {
    id: 'futurism', name: 'Futurism', family: 'Third Position',
    coords: coords(55, 40, 70, 75, 75, 95, 80, 0, 0, 0, 0, 100),
    figure: { name: 'Filippo Tommaso Marinetti', years: '1876 to 1944' },
    source: { author: 'F. T. Marinetti', work: 'The Founding and Manifesto of Futurism', year: 1909 },
    tagline: 'A racing car is more beautiful than the Victory of Samothrace.',
    desc: 'Marinetti demanded the destruction of museums, libraries and every inherited piety, and the worship of speed, machines, youth and danger. The manifesto glorifies war as the world\'s only hygiene. Its politics were fiercely nationalist and anti clerical, and many Futurists fed into early Fascism while despising its later compromise with tradition.'
  },
  {
    id: 'radical-traditionalism', name: 'Radical Traditionalism', family: 'Third Position',
    coords: coords(45, 30, 90, 100, 70, 45, 80, 100, 95, 50, 90, 90),
    figure: { name: 'Julius Evola', years: '1898 to 1974' },
    source: { author: 'Julius Evola', work: 'Revolt Against the Modern World', year: 1934 },
    tagline: 'Against the modern world, for hierarchy and the sacred.',
    desc: 'Evola held that history is a long decline from a primordial order ruled by a sacred kingship and a warrior caste. Democracy, equality, materialism and mass nationalism are all symptoms of that fall. He wanted an aristocratic, imperial order founded on spiritual authority, and criticised Fascism for being too modern and too plebeian.'
  },
  {
    id: 'archeofuturism', name: 'Archeofuturism', family: 'Third Position',
    coords: coords(45, 30, 85, 90, 65, 80, 95, 85, 5, 45, 35, 85),
    figure: { name: 'Guillaume Faye', years: '1949 to 2019' },
    source: { author: 'Guillaume Faye', work: 'Archeofuturism', year: 1998 },
    tagline: 'Archaic values, futuristic technology.',
    desc: 'Faye predicted that modern egalitarian civilisation would collapse under converging crises. What follows should combine pre modern values, such as hierarchy, rootedness and a warrior ethic, with the most advanced science and technology. He imagined a federated European empire with a high tech elite and a neo traditional majority.'
  },

  /* --------------------------- MORE COMMUNIST --------------------------- */
  {
    id: 'trotskyism', name: 'Trotskyism', family: 'Communist',
    coords: coords(95, 100, 70, 60, 80, 0, 30, 20, 15, 15, 0, 80),
    figure: { name: 'Leon Trotsky', years: '1879 to 1940' },
    source: { author: 'Leon Trotsky', work: 'The Permanent Revolution', year: 1930 },
    tagline: 'The revolution cannot stop at one country.',
    desc: 'Argues that in backward countries the working class must lead the revolution straight through to socialism, and that it can only survive by spreading internationally. Socialism in a single country is impossible. Trotsky also condemned the Soviet bureaucracy as a caste that had usurped the workers\' state.'
  },
  {
    id: 'stalinism', name: 'Stalinism', family: 'Communist',
    coords: coords(100, 100, 100, 100, 100, 65, 65, 55, 10, 5, 0, 90),
    figure: { name: 'Joseph Stalin', years: '1878 to 1953' },
    source: { author: 'J. V. Stalin', work: 'The Foundations of Leninism', year: 1924 },
    tagline: 'Socialism in one country.',
    desc: 'Stalin held that socialism could be completed inside the Soviet Union alone, through forced collectivisation of farming and rapid heavy industrialisation under five year plans. He added that class struggle sharpens as socialism advances, which justified an ever stronger security state. Party, state and leader become a single command.'
  },
  {
    id: 'luxemburgism', name: 'Luxemburgism', family: 'Communist',
    coords: coords(85, 100, 35, 15, 45, 0, 25, 20, 25, 25, 0, 50),
    figure: { name: 'Rosa Luxemburg', years: '1871 to 1919' },
    source: { author: 'Rosa Luxemburg', work: 'The Russian Revolution', year: 1918 },
    tagline: 'Freedom is always the freedom of the one who thinks differently.',
    desc: 'A revolutionary Marxism that insists socialism must be made by the masses themselves through spontaneous action such as the mass strike. Luxemburg supported the Bolshevik revolution but attacked its suppression of elections, press and assembly. Without open democracy, she warned, the party dictatorship would harden into rule by a clique.'
  },
  {
    id: 'titoism', name: 'Titoism (Self Management)', family: 'Communist',
    coords: coords(60, 90, 65, 70, 35, 45, 25, 30, 30, 25, 5, 55),
    figure: { name: 'Edvard Kardelj', years: '1910 to 1979' },
    source: { author: 'Edvard Kardelj', work: 'Directions of the Development of the Political System of Socialist Self Management', year: 1977 },
    tagline: 'Factories to the workers, and no orders from Moscow.',
    desc: 'The Yugoslav break with Stalin. Enterprises are socially owned but run by councils of their own workers, competing in a regulated market instead of following a central plan. The state is a federation of republics with real powers, and in foreign policy it refuses to join either Cold War bloc.'
  },
  {
    id: 'dengism', name: 'Dengism', family: 'Communist',
    coords: coords(45, 60, 85, 90, 85, 70, 60, 45, 10, 10, 0, 60),
    figure: { name: 'Deng Xiaoping', years: '1904 to 1997' },
    source: { author: 'Deng Xiaoping', work: 'Emancipate the Mind, Seek Truth from Facts and Unite as One in Looking to the Future', year: 1978 },
    tagline: 'It does not matter if the cat is black or white.',
    desc: 'Deng argued that poverty is not socialism and that the task of a socialist state is to develop the productive forces. Markets, private firms and foreign capital are tools to that end, to be judged by results. The Communist Party keeps an absolute monopoly on political power throughout.'
  },
  {
    id: 'guevarism', name: 'Guevarism', family: 'Communist',
    coords: coords(100, 100, 80, 80, 85, 25, 35, 25, 30, 20, 0, 95),
    figure: { name: 'Che Guevara', years: '1928 to 1967' },
    source: { author: 'Ernesto Che Guevara', work: 'Socialism and Man in Cuba', year: 1965 },
    tagline: 'Create two, three, many Vietnams.',
    desc: 'Holds that a small band of guerrillas in the countryside can create the conditions for revolution without waiting for them to ripen. After victory, socialism must build a new human being who works from moral conviction and not for material reward. The struggle is continental and anti imperialist.'
  },

  /* --------------------------- MORE SOCIALIST --------------------------- */
  {
    id: 'utopian-socialism', name: 'Utopian Socialism', family: 'Socialist',
    coords: coords(60, 85, 20, 25, 10, 10, 25, 20, 35, 50, 20, 5),
    figure: { name: 'Robert Owen', years: '1771 to 1858' },
    source: { author: 'Robert Owen', work: 'A New View of Society', year: 1813 },
    tagline: 'Change the surroundings and you change the person.',
    desc: 'Owen argued that character is formed by environment, so poverty and vice can be removed by reorganising how people live and work. He proposed small cooperative villages with shared property, education for all and humane conditions. Change comes through example and persuasion, not class conflict.'
  },
  {
    id: 'revolutionary-syndicalism', name: 'Revolutionary Syndicalism', family: 'Socialist',
    coords: coords(60, 90, 25, 15, 15, 20, 35, 45, 40, 30, 10, 85),
    figure: { name: 'Georges Sorel', years: '1847 to 1922' },
    source: { author: 'Georges Sorel', work: 'Reflections on Violence', year: 1908 },
    tagline: 'The myth of the general strike.',
    desc: 'Sorel rejected parliamentary socialism as a betrayal that tames the workers. What moves people to heroic action is a myth, and for the working class that myth is the general strike. Proletarian violence, he argued, restores moral energy to a decadent society. Both anarcho syndicalists and early fascists drew on him.'
  },
  {
    id: 'ujamaa', name: 'Ujamaa (African Socialism)', family: 'Socialist',
    coords: coords(80, 90, 65, 75, 60, 65, 50, 60, 60, 55, 35, 35),
    figure: { name: 'Julius Nyerere', years: '1922 to 1999' },
    source: { author: 'Julius Nyerere', work: 'Ujamaa: The Basis of African Socialism', year: 1962 },
    tagline: 'Socialism as the extended family.',
    desc: 'Nyerere argued that socialism is an attitude of mind already present in traditional African society, where nobody starved while others hoarded. The nation should be rebuilt as a family of self reliant village communities that farm together. It rejects both capitalism and the doctrine of class war.'
  },
  {
    id: 'eco-socialism', name: 'Eco Socialism', family: 'Green',
    coords: coords(80, 85, 30, 10, 45, 5, 20, 15, 65, 90, 5, 25),
    figure: { name: 'Michael Löwy', years: 'born 1938' },
    source: { author: 'Joel Kovel and Michael Löwy', work: 'An Ecosocialist Manifesto', year: 2001 },
    tagline: 'Capitalism cannot be made green.',
    desc: 'Argues that the ecological crisis and social breakdown share one cause: an economy that must expand without limit. Neither green capitalism nor the productivist socialism of the Soviet type can solve it. The answer is democratic planning of production around real needs within ecological limits.'
  },

  /* --------------------------- MORE ANARCHIST --------------------------- */
  {
    id: 'democratic-confederalism', name: 'Democratic Confederalism', family: 'Anarchist',
    coords: coords(60, 85, 10, 0, 0, 5, 5, 10, 45, 85, 10, 45),
    figure: { name: 'Abdullah Öcalan', years: 'born 1949' },
    source: { author: 'Abdullah Öcalan', work: 'Democratic Confederalism', year: 2011 },
    tagline: 'Democracy without the state.',
    desc: 'Öcalan abandoned the goal of a Kurdish nation state and proposed self government through networks of local councils instead. It rests on three pillars: grassroots democracy, ecology and the liberation of women. Different ethnic and religious groups govern themselves side by side, with armed self defence but no state above them.'
  },
  {
    id: 'zapatismo', name: 'Zapatismo', family: 'Anarchist',
    coords: coords(60, 85, 10, 0, 5, 25, 5, 35, 60, 75, 25, 45),
    figure: { name: 'Subcomandante Marcos', years: 'born 1957' },
    source: { author: 'Zapatista Army of National Liberation', work: 'Sixth Declaration of the Lacandon Jungle', year: 2005 },
    tagline: 'To lead by obeying.',
    desc: 'An indigenous movement from Chiapas that does not seek state power. Communities govern themselves through rotating councils whose delegates must obey those who chose them. It defends communal land and indigenous customs against neoliberal globalisation, and aims at a world in which many worlds fit.'
  },

  /* ---------------------------- MORE LIBERAL ---------------------------- */
  {
    id: 'keynesian-liberalism', name: 'Keynesian Liberalism', family: 'Liberal',
    coords: coords(50, 30, 25, 10, 60, 35, 30, 25, 30, 35, 15, 35),
    figure: { name: 'John Maynard Keynes', years: '1883 to 1946' },
    source: { author: 'John Maynard Keynes', work: 'The General Theory of Employment, Interest and Money', year: 1936 },
    tagline: 'Markets can get stuck, and the state can unstick them.',
    desc: 'Keynes showed that a market economy can settle at high unemployment for long periods, because total demand may fall short. Government should manage demand through spending, taxation and interest rates. The aim is to save capitalism and individual liberty by correcting their worst failure, not to replace them.'
  },
  {
    id: 'neoliberalism', name: 'Neoliberalism', family: 'Liberal',
    coords: coords(10, 5, 30, 25, 45, 15, 35, 40, 20, 15, 20, 40),
    figure: { name: 'Milton Friedman', years: '1912 to 2006' },
    source: { author: 'Milton Friedman', work: 'Capitalism and Freedom', year: 1962 },
    tagline: 'Economic freedom is a condition of political freedom.',
    desc: 'Friedman argued that competitive markets both produce prosperity and disperse power, which protects liberty. Government should be limited to rules, stable money, enforcing contracts and a minimal safety net such as a negative income tax. The label is mostly used by critics. Friedman called himself a liberal in the classical sense.'
  },
  {
    id: 'third-way', name: 'Third Way', family: 'Liberal',
    coords: coords(35, 25, 40, 10, 50, 25, 25, 25, 25, 40, 15, 45),
    figure: { name: 'Anthony Giddens', years: 'born 1938' },
    source: { author: 'Anthony Giddens', work: 'The Third Way: The Renewal of Social Democracy', year: 1998 },
    tagline: 'No rights without responsibilities.',
    desc: 'An attempt to renew social democracy after the Cold War by accepting markets and globalisation. The state should invest in people through education and training instead of simply redistributing income. Not to be confused with Third Position: this third way runs between old social democracy and free market liberalism.'
  },
  {
    id: 'objectivism', name: 'Objectivism', family: 'Liberal',
    coords: coords(0, 0, 5, 25, 30, 25, 45, 25, 5, 0, 0, 40),
    figure: { name: 'Ayn Rand', years: '1905 to 1982' },
    source: { author: 'Ayn Rand', work: 'The Virtue of Selfishness', year: 1964 },
    tagline: 'Rational self interest is the moral ideal.',
    desc: 'Rand held that reason is the only means of knowledge and that each person\'s own life is their highest moral purpose. Altruism, the duty to live for others, is rejected as destructive. The only system consistent with this is laissez faire capitalism under a government limited to police, courts and defence.'
  },
  {
    id: 'hoppeanism', name: 'Hoppean Libertarianism', family: 'Liberal',
    coords: coords(0, 0, 20, 70, 0, 35, 80, 90, 35, 15, 45, 25),
    figure: { name: 'Hans Hermann Hoppe', years: 'born 1949' },
    source: { author: 'Hans Hermann Hoppe', work: 'Democracy: The God That Failed', year: 2001 },
    tagline: 'A private law society of covenant communities.',
    desc: 'Hoppe argues that democracy is worse than monarchy because elected rulers are temporary caretakers who plunder for the short term. His ideal is no state at all, with all land privately owned. Owners would form covenant communities free to set their own rules and to exclude those who reject them, which gives the theory a strongly conservative social character.'
  },

  /* ---------------------------- TECHNOLOGICAL ---------------------------- */
  {
    id: 'effective-accelerationism', name: 'Effective Accelerationism', family: 'Technological',
    coords: coords(5, 5, 15, 35, 15, 10, 40, 30, 0, 0, 10, 30),
    figure: { name: 'Guillaume Verdon', years: 'writing as Beff Jezos' },
    source: { author: 'Beff Jezos and bayeslord', work: 'Notes on e/acc Principles and Tenets', year: 2022 },
    tagline: 'Accelerate, and climb the Kardashev scale.',
    desc: 'Treats the growth of intelligence and energy use as a law of the universe that should be embraced. Technology and markets are to be pushed forward as fast as possible, especially artificial intelligence. It opposes regulation and safety pauses, and wants development spread widely so that no single authority controls it.'
  },
  {
    id: 'bioconservatism', name: 'Bioconservatism', family: 'Technological',
    coords: coords(40, 30, 50, 20, 50, 40, 45, 75, 95, 60, 55, 35),
    figure: { name: 'Leon Kass', years: 'born 1939' },
    source: { author: 'Leon R. Kass', work: 'Life, Liberty and the Defense of Dignity', year: 2002 },
    tagline: 'Human nature is not ours to redesign.',
    desc: 'Kass argues that cloning, genetic enhancement and the pursuit of ageless bodies threaten the things that give human life its meaning. Our sense of revulsion at such projects holds a wisdom that argument cannot fully state. Biotechnology should therefore be restrained by law in defence of human dignity.'
  },

  /* ---------------------------- CONSERVATIVE ---------------------------- */
  {
    id: 'neoconservatism', name: 'Neoconservatism', family: 'Conservative',
    coords: coords(25, 15, 60, 25, 60, 60, 60, 65, 30, 15, 55, 95),
    figure: { name: 'Irving Kristol', years: '1920 to 2009' },
    source: { author: 'Irving Kristol', work: 'Neoconservatism: The Autobiography of an Idea', year: 1995 },
    tagline: 'A liberal who has been mugged by reality.',
    desc: 'Begun by former liberals who turned against the unintended effects of social programmes and the counterculture. It accepts a limited welfare state and capitalism while stressing religion and bourgeois virtue as their moral support. Abroad it holds that a great democracy should use its power, including military power, to defend and spread its values.'
  },
  {
    id: 'paleoconservatism', name: 'Paleoconservatism', family: 'Conservative',
    coords: coords(35, 15, 50, 35, 25, 95, 95, 95, 65, 40, 80, 25),
    figure: { name: 'Pat Buchanan', years: 'born 1938' },
    source: { author: 'Patrick J. Buchanan', work: 'A Republic, Not an Empire', year: 1999 },
    tagline: 'A republic, not an empire.',
    desc: 'The old right that rejects neoconservative foreign policy. A nation should avoid wars and alliances that do not serve its own vital interests, protect its industries with tariffs, and sharply limit immigration to preserve its inherited culture. Power belongs close to home, in states, towns and families.'
  },
  {
    id: 'communitarianism', name: 'Communitarianism', family: 'Conservative',
    coords: coords(45, 35, 50, 15, 30, 45, 50, 65, 50, 50, 45, 35),
    figure: { name: 'Amitai Etzioni', years: '1929 to 2023' },
    source: { author: 'Amitai Etzioni', work: 'The Spirit of Community', year: 1993 },
    tagline: 'Strong rights presume strong responsibilities.',
    desc: 'Argues that liberal societies have overemphasised individual rights and neglected the communities that make free people possible. Families, schools and neighbourhoods carry moral values and need active support. It seeks a balance between personal liberty and the common good, enforced mostly by social pressure and not by the state.'
  },

  /* ----------------------------- NATIONALIST ----------------------------- */
  {
    id: 'kemalism', name: 'Kemalism', family: 'Nationalist',
    coords: coords(65, 45, 75, 75, 95, 95, 100, 20, 15, 15, 5, 75),
    figure: { name: 'Mustafa Kemal Atatürk', years: '1881 to 1938' },
    source: { author: 'Mustafa Kemal Atatürk', work: 'Nutuk (The Speech) and the Six Arrows', year: 1927 },
    tagline: 'Republicanism, nationalism, populism, statism, secularism, reformism.',
    desc: 'The founding programme of the Turkish Republic, summed up in six arrows. Religion is removed from the state, law and schooling. A single Turkish national identity replaces the many communities of the empire. The state leads industrialisation, and society is modernised from above along Western lines.'
  },
  {
    id: 'bonapartism', name: 'Bonapartism', family: 'Nationalist',
    coords: coords(50, 25, 80, 90, 100, 85, 80, 55, 30, 20, 40, 95),
    figure: { name: 'Louis Napoléon Bonaparte', years: '1808 to 1873' },
    source: { author: 'Louis Napoléon Bonaparte', work: 'Napoleonic Ideas', year: 1839 },
    tagline: 'Authority from above, confidence from below.',
    desc: 'Presents the Napoleonic system as the true heir of the Revolution: a strong hereditary executive who draws his legitimacy directly from the people by plebiscite, over the heads of parliament and parties. It promises order, national glory, a centralised efficient administration and material progress for all classes.'
  },
  {
    id: 'zionism', name: 'Political Zionism', family: 'Nationalist',
    coords: coords(45, 40, 45, 20, 60, 95, 75, 50, 25, 30, 45, 70),
    figure: { name: 'Theodor Herzl', years: '1860 to 1904' },
    source: { author: 'Theodor Herzl', work: 'The Jewish State', year: 1896 },
    tagline: 'We are a people, one people.',
    desc: 'Herzl argued that antisemitism could not be ended by assimilation, because Jews are a nation and not only a religious group. The solution is political: an internationally recognised Jewish state. He imagined it as a modern, tolerant society built by organised migration and investment.'
  },
  {
    id: 'hindutva', name: 'Hindutva', family: 'Nationalist',
    coords: coords(45, 25, 70, 45, 75, 100, 95, 85, 40, 30, 80, 80),
    figure: { name: 'Vinayak Damodar Savarkar', years: '1883 to 1966' },
    source: { author: 'V. D. Savarkar', work: 'Essentials of Hindutva', year: 1923 },
    tagline: 'A common nation, a common race, a common civilisation.',
    desc: 'Savarkar defined a Hindu as someone for whom India is both fatherland and holy land. Hindutva is therefore a national and cultural identity, wider than Hinduism as a faith. It calls for a strong, unified and militarily capable Hindu nation, and regards communities whose holy lands lie elsewhere as not fully belonging.'
  },

  /* ------------------------------ RELIGIOUS ------------------------------ */
  {
    id: 'islamism', name: 'Islamism (Qutbism)', family: 'Religious',
    coords: coords(55, 40, 90, 85, 80, 20, 90, 95, 60, 35, 100, 90),
    figure: { name: 'Sayyid Qutb', years: '1906 to 1966' },
    source: { author: 'Sayyid Qutb', work: 'Milestones', year: 1964 },
    tagline: 'Sovereignty belongs to God alone.',
    desc: 'Qutb held that any society ruled by man made law, including nominally Muslim ones, lives in a state of ignorance. Only God may legislate, so nationalism, democracy and socialism are all forms of servitude to men. A committed vanguard must separate itself and struggle to establish an order under divine law across the whole community of believers.'
  },
  {
    id: 'khomeinism', name: 'Khomeinism', family: 'Religious',
    coords: coords(60, 45, 90, 90, 90, 55, 85, 95, 50, 30, 100, 80),
    figure: { name: 'Ruhollah Khomeini', years: '1902 to 1989' },
    source: { author: 'Ruhollah Khomeini', work: 'Islamic Government: Governance of the Jurist', year: 1970 },
    tagline: 'Guardianship of the jurist.',
    desc: 'Khomeini argued that in the absence of the hidden Imam, the right to govern passes to the most qualified Islamic jurist. Monarchy is illegitimate. Government exists to enforce divine law, and the jurist holds final authority over every other institution, including elected ones. It also frames politics as the oppressed against the arrogant powers.'
  },
  {
    id: 'gandhism', name: 'Gandhism', family: 'Religious',
    coords: coords(35, 60, 5, 10, 0, 55, 10, 75, 95, 85, 90, 0),
    figure: { name: 'Mohandas Gandhi', years: '1869 to 1948' },
    source: { author: 'M. K. Gandhi', work: 'Hind Swaraj', year: 1909 },
    tagline: 'Self rule through truth and non violence.',
    desc: 'Hind Swaraj argues that real self rule is mastery of oneself, not just removing foreign rulers. Gandhi condemned modern industrial civilisation, with its railways, machinery, lawyers and doctors, as a disease. He wanted a federation of self sufficient villages, hand production, and resistance only through non violent refusal to cooperate.'
  },

  /* ------------------------------ CLASSICAL ------------------------------ */
  {
    id: 'platonism', name: 'Platonic Guardianship', family: 'Classical',
    coords: coords(80, 75, 90, 95, 90, 60, 85, 80, 75, 45, 60, 70),
    figure: { name: 'Plato', years: 'c. 428 to 348 BC' },
    source: { author: 'Plato', work: 'The Republic', year: 'c. 375 BC' },
    tagline: 'Until philosophers are kings, cities will have no rest from evils.',
    desc: 'Plato held that justice means each class doing the work it is fit for: producers, soldiers and rulers. The rulers must be philosophers trained for decades to know the good. To keep them from corruption, the guardian class owns no private property and raises its children in common, and poetry and music are censored.'
  },
  {
    id: 'confucianism', name: 'Confucianism', family: 'Classical',
    coords: coords(50, 35, 65, 80, 70, 50, 75, 95, 60, 50, 45, 30),
    figure: { name: 'Confucius', years: '551 to 479 BC' },
    source: { author: 'Confucius', work: 'The Analects', year: 'compiled after 479 BC' },
    tagline: 'Govern by virtue, and the people will have a sense of shame.',
    desc: 'Teaches that good order comes from moral example and ritual, not from punishment. Society is a web of unequal but reciprocal relationships, beginning with the duty of children to parents. Rulers hold authority only as long as they are virtuous and care for the people, and office should go to the learned and upright.'
  },

  /* -------------------------------- MEME -------------------------------- */
  /* Joke ideologies from political compass meme culture. The first two have
     no founding text at all, so they carry a note instead of a source. */
  {
    id: 'neo-libertarian-falangism', name: 'Neo Libertarian Falangism', family: 'Meme',
    coords: coords(10, 10, 60, 75, 70, 95, 90, 90, 45, 30, 90, 80),
    figure: { name: 'Internet Meme', years: 'no founder' },
    source: { note: 'No founding text. This is an internet joke ideology, built by bolting free market libertarianism onto Falangism.' },
    tagline: 'Deregulate everything, for the unity of destiny.',
    desc: 'A deliberate contradiction. Real Falangism wants a national syndicalist economy with nationalised banking, and real libertarianism rejects the authoritarian nation state. This mash up keeps the Falangist nation, church and strongman while swapping the syndicates for free markets and low taxes. If you land here, you scored strongly nationalist, religious and pro market all at once.'
  },
  {
    id: 'monarcho-brezhnevism', name: 'Monarcho Brezhnevism', family: 'Meme',
    coords: coords(95, 95, 85, 100, 100, 55, 60, 70, 60, 20, 30, 80),
    figure: { name: 'Internet Meme', years: 'no founder' },
    source: { note: 'No founding text. This is an internet joke ideology that crowns the Soviet General Secretary.' },
    tagline: 'A hereditary throne atop a five year plan.',
    desc: 'Takes the late Soviet system of the Brezhnev years, with its planned economy, ageing leadership and preference for stability over reform, and makes the top job hereditary. The joke is that the two are closer than they look. If you land here, you scored for full state planning under a ruler nobody elects, with little appetite for change.'
  },
  {
    id: 'anarcho-monarchism', name: 'Anarcho Monarchism', family: 'Meme',
    coords: coords(30, 30, 5, 60, 5, 45, 55, 95, 95, 85, 90, 20),
    figure: { name: 'J. R. R. Tolkien', years: '1892 to 1973' },
    source: { author: 'J. R. R. Tolkien', work: 'Letter to Christopher Tolkien, 29 November', year: 1943 },
    tagline: 'A king who leaves everyone alone.',
    desc: 'Usually treated as a joke, but it has a real source. Tolkien wrote that his politics leaned toward anarchy, meaning the abolition of control, or else toward unconstitutional monarchy. The idea is a crown that exists as a symbol and a last resort while daily life is left ungoverned, rural and traditional, with deep suspicion of machines and planners.'
  },
  {
    id: 'posadism', name: 'Posadism', family: 'Meme',
    coords: coords(100, 100, 85, 80, 90, 0, 20, 15, 0, 10, 0, 100),
    figure: { name: 'J. Posadas', years: '1912 to 1981' },
    source: { author: 'J. Posadas', work: 'Flying Saucers, the Process of Matter and Energy, Science, the Revolutionary and Working Class Struggle and the Socialist Future of Mankind', year: 1968 },
    tagline: 'Nuclear war, then socialism, then the aliens.',
    desc: 'A real Trotskyist current that the internet adopted as a meme. Posadas argued that nuclear war was inevitable and that the workers\' states should not fear it, since socialism would be built on the ruins. He also reasoned that any civilisation able to cross space must already be socialist, so visiting aliens would be allies.'
  },
  {
    id: 'luxury-space-communism', name: 'Fully Automated Luxury Communism', family: 'Meme',
    coords: coords(90, 100, 10, 10, 50, 0, 5, 0, 0, 35, 0, 15),
    figure: { name: 'Aaron Bastani', years: 'born 1984' },
    source: { author: 'Aaron Bastani', work: 'Fully Automated Luxury Communism', year: 2019 },
    tagline: 'Robots do the work. Everyone gets the good life.',
    desc: 'Began as a slogan and a meme, often with the words gay and space added, before Bastani wrote it up as a manifesto. It claims that automation, cheap solar energy, asteroid mining and synthetic food can end scarcity. If the machines are owned in common, the result is abundance and leisure for all instead of mass unemployment.'
  }
];
