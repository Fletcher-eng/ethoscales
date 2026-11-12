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
  { key: 'rule', param: 'd', name: 'Government', color: '#6F45D0', ink: '#EEE6D3', shape: 'triangle',
    low: { label: 'Democracy', short: 'Democracy' }, high: { label: 'Autocracy', short: 'Autocracy' },
    about: 'Who holds power: everyone through votes and assemblies, or one leader or small group.' },
  { key: 'struct', param: 's', name: 'Structure', color: '#EE6C1B', ink: '#111111', shape: 'steps',
    low: { label: 'Decentralised', short: 'Decentralised' }, high: { label: 'Centralised', short: 'Centralised' },
    about: 'Where decisions are made: in towns, regions and networks, or in one capital.' },
  { key: 'nation', param: 'n', name: 'Nation', color: '#0B6C75', ink: '#EEE6D3', shape: 'shield',
    low: { label: 'Internationalist', short: 'Internationalist' }, high: { label: 'Nationalist', short: 'Nationalist' },
    about: 'Where loyalty lies: with humanity as a whole, or with your own nation first.' },
  { key: 'ident', param: 'i', name: 'Immigration', color: '#E5457D', ink: '#111111', shape: 'arch',
    low: { label: 'Multiculturalist', short: 'Multiculturalist' }, high: { label: 'Assimilationist', short: 'Assimilationist' },
    about: 'How newcomers and cultures share a country: many side by side, or everyone joins one common culture.' },
  { key: 'cult', param: 'c', name: 'Values', color: '#C2A46B', ink: '#111111', shape: 'diamond',
    low: { label: 'Progressive', short: 'Progressive' }, high: { label: 'Traditional', short: 'Traditional' },
    about: 'How to treat inherited customs and morals: reform them, or conserve them.' },
  { key: 'tech', param: 't', name: 'Technology', color: '#F5B700', ink: '#111111', shape: 'cross',
    low: { label: 'Accelerationist', short: 'Accelerationist' }, high: { label: 'Precautionary', short: 'Precautionary' },
    about: 'How fast to push new technology: as fast as possible, or only once proven safe.' },
  { key: 'eco', param: 'ec', name: 'Environment', color: '#10743F', ink: '#EEE6D3', shape: 'leaf',
    low: { label: 'Industrialist', short: 'Industrialist' }, high: { label: 'Environmentalist', short: 'Environmentalist' },
    about: 'What wins when they clash: industry, jobs and growth, or protecting nature even if it costs us.' },
  { key: 'relig', param: 'rl', name: 'Religion', color: '#6FB7E8', ink: '#111111', shape: 'star',
    low: { label: 'Secular', short: 'Secular' }, high: { label: 'Religious', short: 'Religious' },
    about: 'The place of faith in public life: kept private, or the foundation of law and morals.' },
  { key: 'force', param: 'f', name: 'Military', color: '#9A9A8E', ink: '#111111', shape: 'square',
    low: { label: 'Pacifist', short: 'Pacifist' }, high: { label: 'Militarist', short: 'Militarist' },
    about: 'The role of armed force: a last resort to be minimised, or a source of strength.' },
  { key: 'trade', param: 'tr', name: 'Trade', color: '#7A4A21', ink: '#EEE6D3', shape: 'arrow',
    low: { label: 'Free Trade', short: 'Free Trade' }, high: { label: 'Protectionist', short: 'Protectionist' },
    about: 'How goods cross borders: freely, with open markets, or behind tariffs that shield industry at home.' }
];

/* Coordinates are listed in axis order:
   econ, own, rights, rule, struct, nation, ident, cult, tech, eco, relig, force */
function coords(...v) {
  const out = {};
  AXES.forEach((a, i) => { out[a.key] = v[i]; });
  return out;
}

/* family is a broad grouping used for the catalogue and for chart colors. It follows how
   each ideology describes itself where it can. For example Juche is Radical Left by its
   socialist economy, not "Communist", a label it dropped. Entries below are not in family order. */
const IDEOLOGIES = [
  /* ---------------------- THIRD POSITION MOVEMENTS ---------------------- */
  {
    id: 'italian-fascism', name: 'Italian Fascism', family: 'Third Position',
    coords: coords(65, 35, 95, 95, 95, 95, 90, 75, 30, 20, 55, 100, 85),
    figure: { name: 'Giovanni Gentile', years: '1875 to 1944' },
    source: { author: 'Giovanni Gentile and Benito Mussolini', work: 'The Doctrine of Fascism', year: 1932 },
    tagline: 'Everything within the state, nothing outside the state, nothing against the state.',
    desc: 'Holds that the individual has meaning only through the nation, and the nation only through the state, which is an ethical and spiritual whole and not a referee between interests. Property stays private but must serve national ends, with employers and workers bound together in state corporations. It rejects liberal individualism, Marxist class struggle and pacifism alike, and treats struggle and war as what brings a people to its full strength.'
  },
  {
    id: 'falangism', name: 'Falangism', family: 'Third Position',
    coords: coords(70, 50, 90, 90, 90, 95, 90, 90, 50, 35, 90, 85, 85),
    figure: { name: 'José Antonio Primo de Rivera', years: '1903 to 1936' },
    source: { author: 'José Antonio Primo de Rivera, Falange Española de las JONS', work: 'The Twenty Seven Points', year: 1934 },
    tagline: 'National syndicalism on a Catholic foundation.',
    desc: 'Defines Spain as a unity of destiny that stands above every region, class and party, and rejects separatism outright. The economy is to be organised as one giant syndicate of producers, with banking nationalised and land reformed, so that neither capitalism nor Marxism divides the nation. Unlike Italian Fascism, it places the Catholic sense of life at the centre of national reconstruction.'
  },
  {
    id: 'peronism', name: 'Peronism (Justicialism)', family: 'Third Position',
    coords: coords(65, 45, 65, 60, 75, 85, 65, 65, 40, 30, 65, 55, 85),
    figure: { name: 'Juan Perón', years: '1895 to 1974' },
    source: { author: 'Juan Domingo Perón', work: 'The Organised Community and the Twenty Truths', year: '1949 and 1950' },
    tagline: 'Social justice, economic independence, political sovereignty.',
    desc: 'The origin of the phrase Third Position: a path between capitalist individualism and communist collectivism, declared by Perón in the 1940s. It aims at an organised community in which the state balances capital and labour, unions are a pillar of the nation, and capital serves the economy and the economy serves social wellbeing. It is national and popular in character, and it seeks its mandate through mass elections.'
  },
  {
    id: 'strasserism', name: 'Strasserism', family: 'Third Position',
    coords: coords(80, 70, 85, 85, 45, 95, 95, 75, 55, 45, 50, 75, 90),
    figure: { name: 'Otto Strasser', years: '1897 to 1974' },
    source: { author: 'Otto Strasser', work: 'Germany Tomorrow', year: 1940 },
    tagline: 'A national socialism turned against big capital.',
    desc: 'The anti capitalist wing that broke with Hitler in 1930. Strasser wanted large estates broken up and large industry held in shared tenure by the state, the workers and managers, through a system of entailed fiefs. He proposed a federal Germany of self governing regions and professional estates, and a return of much of the population to the land, while remaining intensely nationalist.'
  },
  {
    id: 'national-bolshevism', name: 'National Bolshevism', family: 'Third Position',
    coords: coords(95, 90, 95, 95, 95, 90, 85, 65, 30, 20, 15, 95, 90),
    figure: { name: 'Ernst Niekisch', years: '1889 to 1967' },
    source: { author: 'Ernst Niekisch', work: 'Widerstand essays and Hitler: A German Fate', year: 1932 },
    tagline: 'Soviet style planning in the service of the nation.',
    desc: 'Niekisch argued that Germany could only escape the liberal West by adopting a fully planned, state owned economy and aligning with Soviet Russia. The nation, not the international working class, is the subject of the revolution. It is militarised, anti liberal and anti bourgeois, and unlike Falangism it has no religious foundation.'
  },
  {
    id: 'eurasianism', name: 'Neo Eurasianism (Fourth Political Theory)', family: 'Third Position',
    coords: coords(65, 50, 85, 90, 65, 80, 40, 95, 80, 55, 90, 90, 85),
    figure: { name: 'Aleksandr Dugin', years: 'born 1962' },
    source: { author: 'Aleksandr Dugin', work: 'The Fourth Political Theory', year: 2009 },
    tagline: 'Against liberalism, communism and fascism alike.',
    desc: 'Claims that liberalism, communism and fascism are all exhausted products of Western modernity, and proposes a fourth theory built on tradition and on distinct civilisations. It wants a multipolar world of large land based blocs in place of one global order. Inside such a bloc, each people is meant to keep its own faith and customs under a strong sacral authority.'
  },
  {
    id: 'baathism', name: 'Ba\'athism', family: 'Nationalist',
    coords: coords(75, 65, 85, 85, 90, 95, 85, 50, 35, 20, 35, 80, 75),
    figure: { name: 'Michel Aflaq', years: '1910 to 1989' },
    source: { author: 'Michel Aflaq', work: 'On the Way of Resurrection (collected essays)', year: 1959 },
    tagline: 'Unity, freedom, socialism.',
    desc: 'Calls for the rebirth of a single Arab nation, divided by colonial borders, into one state. Its socialism means state direction of the economy for national development, not class war. It is secular in government while treating Islam as part of Arab cultural heritage, and it organises through a vanguard party.'
  },

  /* ----------------------------- COMMUNIST ------------------------------ */
  {
    id: 'marxism-leninism', name: 'Marxism Leninism', family: 'Radical Left',
    coords: coords(100, 100, 90, 85, 95, 30, 45, 30, 15, 15, 0, 75, 85),
    figure: { name: 'Vladimir Lenin', years: '1870 to 1924' },
    source: { author: 'V. I. Lenin', work: 'What Is to Be Done? (1902) and The State and Revolution', year: 1918 },
    tagline: 'A vanguard party leads the workers to state power.',
    desc: 'Holds that the working class must seize the state through a disciplined vanguard party and use it to abolish private ownership of the means of production. The economy is then centrally planned. The state is expected to wither away only after class divisions have disappeared.'
  },
  {
    id: 'maoism', name: 'Maoism', family: 'Radical Left',
    coords: coords(95, 100, 95, 85, 75, 60, 60, 15, 45, 15, 0, 90, 92),
    figure: { name: 'Mao Zedong', years: '1893 to 1976' },
    source: { author: 'Mao Zedong', work: 'On New Democracy', year: 1940 },
    tagline: 'Peasant revolution, the mass line, protracted people\'s war.',
    desc: 'Adapts Marxism Leninism to an agrarian country by making the peasantry the main revolutionary force. The party is meant to draw its line from the masses and return it to them, and to keep class struggle going even after taking power. It is openly hostile to inherited tradition and treats armed struggle as the road to power.'
  },
  {
    id: 'juche', name: 'Juche', family: 'Radical Left',
    coords: coords(100, 95, 100, 100, 100, 100, 100, 70, 35, 15, 10, 100, 100),
    figure: { name: 'Kim Il Sung', years: '1912 to 1994' },
    source: { author: 'Kim Jong Il', work: 'On the Juche Idea', year: 1982 },
    tagline: 'Self reliance in ideology, politics, economy and defence.',
    desc: 'North Korea\'s state doctrine. It grew out of Marxism Leninism but dropped that label in 1992 and now presents itself as an original idea of its own, so it is grouped here by its socialist economy and not called communist. It teaches that the masses are masters of the revolution but can only act through a single supreme leader. The nation must depend on no outside power, which means a self sufficient planned economy and self reliance in defence. It combines total state ownership with what it calls socialist patriotism.'
  },
  {
    id: 'council-communism', name: 'Council Communism', family: 'Radical Left',
    coords: coords(80, 100, 30, 5, 15, 5, 30, 20, 30, 35, 5, 40, 40),
    figure: { name: 'Anton Pannekoek', years: '1873 to 1960' },
    source: { author: 'Anton Pannekoek', work: 'Workers\' Councils', year: 1946 },
    tagline: 'All power to the workers\' councils, none to the party.',
    desc: 'Rejects both parliament and the Leninist party as ways of ruling over workers. Power should rest in councils elected in each workplace, with delegates who can be recalled at any time. Production is collectively owned and coordinated from below.'
  },

  /* ----------------------------- ANARCHIST ------------------------------ */
  {
    id: 'anarcho-communism', name: 'Anarcho Communism', family: 'Anarchist',
    coords: coords(70, 100, 0, 0, 0, 0, 20, 15, 40, 60, 10, 30, 40),
    figure: { name: 'Peter Kropotkin', years: '1842 to 1921' },
    source: { author: 'Peter Kropotkin', work: 'The Conquest of Bread', year: 1892 },
    tagline: 'All is for all.',
    desc: 'Argues that everything produced is the common inheritance of humanity, so both the state and private property should be abolished at once. Free communes would federate voluntarily and share goods according to need, without wages or money. Kropotkin grounded this in mutual aid as a factor of evolution.'
  },
  {
    id: 'anarcho-syndicalism', name: 'Anarcho Syndicalism', family: 'Anarchist',
    coords: coords(70, 95, 5, 0, 10, 0, 20, 20, 35, 45, 5, 35, 35),
    figure: { name: 'Rudolf Rocker', years: '1873 to 1958' },
    source: { author: 'Rudolf Rocker', work: 'Anarcho Syndicalism: Theory and Practice', year: 1938 },
    tagline: 'The union is both the weapon and the future society.',
    desc: 'Sees revolutionary trade unions as the means of struggle today and the structure of the economy tomorrow. Workers take over production directly through the general strike and run it through federated unions. It refuses political parties and the conquest of state power.'
  },
  {
    id: 'mutualism', name: 'Mutualism', family: 'Anarchist',
    coords: coords(15, 65, 5, 5, 0, 15, 35, 45, 45, 50, 15, 25, 30),
    figure: { name: 'Pierre-Joseph Proudhon', years: '1809 to 1865' },
    source: { author: 'Pierre-Joseph Proudhon', work: 'What Is Property? (1840) and The Principle of Federation', year: 1863 },
    tagline: 'Markets without landlords, bosses or bankers.',
    desc: 'Distinguishes property used to extract rent and interest, which Proudhon called theft, from possession based on personal use, which he defended. Free producers and cooperatives would trade in a market, financed by mutual credit at cost. Society would be held together by contracts and federation instead of a state.'
  },
  {
    id: 'egoist-anarchism', name: 'Egoist Anarchism', family: 'Anarchist',
    coords: coords(30, 40, 0, 0, 0, 0, 30, 5, 50, 50, 0, 30, 25),
    figure: { name: 'Max Stirner', years: '1806 to 1856' },
    source: { author: 'Max Stirner', work: 'The Ego and Its Own', year: 1844 },
    tagline: 'No god, no state, no cause above the individual.',
    desc: 'Treats the state, the nation, morality, religion and even humanity as fixed ideas that people serve against their own interest. The individual owes nothing to any of them. Stirner proposed a union of egoists: free association that lasts only as long as it serves each member. This is the root of later post left anarchism.'
  },
  {
    id: 'tolstoyanism', name: 'Tolstoyan Anarcho Pacifism', family: 'Anarchist',
    coords: coords(50, 80, 0, 0, 0, 0, 30, 70, 85, 80, 95, 0, 35),
    figure: { name: 'Leo Tolstoy', years: '1828 to 1910' },
    source: { author: 'Leo Tolstoy', work: 'The Kingdom of God Is Within You', year: 1894 },
    tagline: 'Resist not evil by force.',
    desc: 'Takes the Sermon on the Mount literally and concludes that all violence is forbidden, which rules out armies, courts, police and therefore the state itself. Christians should refuse military service, oaths and taxes for war. Tolstoy paired this with simple rural living and shared land.'
  },
  {
    id: 'social-ecology', name: 'Social Ecology (Communalism)', family: 'Anarchist',
    coords: coords(60, 90, 5, 0, 0, 5, 20, 15, 35, 90, 5, 25, 70),
    figure: { name: 'Murray Bookchin', years: '1921 to 2006' },
    source: { author: 'Murray Bookchin', work: 'The Ecology of Freedom', year: 1982 },
    tagline: 'The domination of nature begins with the domination of people.',
    desc: 'Argues that ecological destruction comes from social hierarchy, so it cannot be solved without ending hierarchy. Bookchin proposed libertarian municipalism: face to face citizens\' assemblies that own the local economy and confederate with each other. Technology is welcome when it is humanly scaled and liberates people from toil.'
  },
  {
    id: 'anarcho-primitivism', name: 'Anarcho Primitivism', family: 'Anarchist',
    coords: coords(50, 90, 0, 0, 0, 0, 30, 40, 100, 100, 20, 30, 95),
    figure: { name: 'John Zerzan', years: 'born 1943' },
    source: { author: 'John Zerzan', work: 'Future Primitive', year: 1994 },
    tagline: 'Civilisation itself is the problem.',
    desc: 'Locates the origin of domination in agriculture, the division of labour and symbolic culture, not just in the state or capitalism. It holds that hunter gatherer life was freer, healthier and more equal. The goal is to undo industrial civilisation and return to small, wild, face to face bands.'
  },
  {
    id: 'agorism', name: 'Agorism', family: 'Libertarian',
    coords: coords(0, 5, 0, 10, 0, 0, 35, 30, 20, 25, 10, 10, 0),
    figure: { name: 'Samuel Edward Konkin III', years: '1947 to 2004' },
    source: { author: 'Samuel Edward Konkin III', work: 'New Libertarian Manifesto', year: 1980 },
    tagline: 'Starve the state through the counter economy.',
    desc: 'Rejects voting and political parties as ways to reach a free society. The strategy is counter economics: peaceful trade in black and grey markets that the state cannot tax or regulate. As this parallel economy grows it is meant to supply protection and arbitration too, until the state has nothing left to do.'
  },
  {
    id: 'crypto-anarchism', name: 'Crypto Anarchism', family: 'Libertarian',
    coords: coords(0, 0, 0, 20, 0, 0, 40, 35, 0, 15, 5, 15, 0),
    figure: { name: 'Timothy C. May', years: '1951 to 2018' },
    source: { author: 'Timothy C. May', work: 'The Crypto Anarchist Manifesto', year: 1988 },
    tagline: 'Strong cryptography makes the state unable to see or tax.',
    desc: 'Predicts that encryption, anonymous networks and digital cash will let people communicate and trade with total privacy. Once transactions cannot be traced, governments lose the ability to tax, regulate and control information. May saw this as a technical fact that would change society whether or not anyone approved.'
  },

  /* ---------------------- SOCIALIST AND SOCIAL DEMOCRATIC ---------------------- */
  {
    id: 'social-democracy', name: 'Social Democracy', family: 'Left',
    coords: coords(60, 55, 35, 10, 60, 35, 30, 30, 35, 50, 20, 30, 40),
    figure: { name: 'Eduard Bernstein', years: '1850 to 1932' },
    source: { author: 'Eduard Bernstein', work: 'Evolutionary Socialism', year: 1899 },
    tagline: 'The movement is everything, the final goal is nothing.',
    desc: 'Bernstein argued that capitalism was not heading for collapse, so socialists should pursue steady reform through parliament, unions and cooperatives instead of revolution. Democracy is both the means and the end. Socialism becomes the gradual extension of rights and security to everyone.'
  },
  {
    id: 'market-socialism', name: 'Market Socialism', family: 'Left',
    coords: coords(55, 85, 35, 15, 60, 30, 35, 30, 30, 40, 15, 35, 45),
    figure: { name: 'Oskar Lange', years: '1904 to 1965' },
    source: { author: 'Oskar Lange', work: 'On the Economic Theory of Socialism', year: 1936 },
    tagline: 'Public ownership, with prices doing the work.',
    desc: 'Lange\'s reply to Mises: an economy can own its industries in common and still calculate rationally. A planning board sets the prices of capital goods by trial and error, and managers of public firms respond to them as they would in a market. Consumers keep free choice of goods and jobs.'
  },
  {
    id: 'georgism', name: 'Georgism', family: 'Liberal',
    coords: coords(25, 35, 20, 15, 40, 30, 35, 40, 35, 55, 35, 30, 5),
    figure: { name: 'Henry George', years: '1839 to 1897' },
    source: { author: 'Henry George', work: 'Progress and Poverty', year: 1879 },
    tagline: 'Tax land, not labour.',
    desc: 'Asks why poverty persists as wealth grows, and answers that landowners capture the gains as rent. Since nobody made the land, its value belongs to the community. George proposed a single tax on land value to replace taxes on work and trade, leaving everything people produce as their own.'
  },
  {
    id: 'left-accelerationism', name: 'Left Accelerationism', family: 'Left',
    coords: coords(85, 85, 35, 20, 55, 5, 20, 5, 0, 30, 0, 30, 40),
    figure: { name: 'Nick Srnicek', years: 'born 1982' },
    source: { author: 'Nick Srnicek and Alex Williams', work: '#Accelerate Manifesto (2013) and Inventing the Future', year: 2015 },
    tagline: 'Demand full automation.',
    desc: 'Argues the left should stop defending local, small scale resistance and instead take over the technology that capitalism built. Automation, logistics and planning tools should be repurposed toward a world without work. Its demands include full automation, a universal basic income and a shorter working week.'
  },
  {
    id: 'democratic-transhumanism', name: 'Democratic Transhumanism', family: 'Left',
    coords: coords(55, 45, 15, 5, 55, 10, 15, 5, 0, 40, 5, 25, 35),
    figure: { name: 'James Hughes', years: 'born 1961' },
    source: { author: 'James Hughes', work: 'Citizen Cyborg', year: 2004 },
    tagline: 'The right to enhance, with fair access for all.',
    desc: 'Holds that people should be free to use technology to extend their lives and abilities, and that democratic states must make sure these benefits are safe and shared. It opposes both bioconservatives who would ban enhancement and libertarians who would leave it to the market. Hughes treats control over one\'s own body and mind as a civil right.'
  },

  /* ------------------------------ LIBERAL ------------------------------- */
  {
    id: 'classical-liberalism', name: 'Classical Liberalism', family: 'Liberal',
    coords: coords(25, 25, 5, 20, 35, 30, 35, 30, 30, 35, 15, 35, 5),
    figure: { name: 'John Stuart Mill', years: '1806 to 1873' },
    source: { author: 'John Stuart Mill', work: 'On Liberty', year: 1859 },
    tagline: 'Power may only be used over someone to prevent harm to others.',
    desc: 'Mill\'s harm principle: society may restrict a person only to stop them harming someone else, never for their own good. Freedom of thought, speech and ways of living must be protected even against the majority. Government should be representative and limited.'
  },
  {
    id: 'social-liberalism', name: 'Social Liberalism', family: 'Liberal',
    coords: coords(45, 35, 15, 5, 50, 25, 20, 20, 35, 50, 10, 30, 20),
    figure: { name: 'John Rawls', years: '1921 to 2002' },
    source: { author: 'John Rawls', work: 'A Theory of Justice', year: 1971 },
    tagline: 'Justice as fairness.',
    desc: 'Asks what rules people would choose if they did not know their own place in society. Rawls answers: equal basic liberties for all first, then inequalities only where they benefit the least well off and positions are open to everyone. This supports markets alongside strong redistribution and public provision.'
  },
  {
    id: 'ordoliberalism', name: 'Ordoliberalism', family: 'Liberal',
    coords: coords(30, 15, 35, 20, 55, 40, 50, 55, 40, 35, 50, 40, 15),
    figure: { name: 'Walter Eucken', years: '1891 to 1950' },
    source: { author: 'Walter Eucken', work: 'Principles of Economic Policy', year: 1952 },
    tagline: 'A strong state to keep markets competitive.',
    desc: 'Argues that free markets do not maintain themselves, because firms form cartels and monopolies. The state must set and enforce a firm framework of rules: stable money, open markets, liability and strict competition law. It should not steer the economy day to day. This is the basis of the German social market economy.'
  },
  {
    id: 'minarchism', name: 'Minarchist Libertarianism', family: 'Libertarian',
    coords: coords(5, 0, 10, 25, 25, 20, 40, 40, 20, 15, 15, 30, 3),
    figure: { name: 'Robert Nozick', years: '1938 to 2002' },
    source: { author: 'Robert Nozick', work: 'Anarchy, State, and Utopia', year: 1974 },
    tagline: 'The night watchman state, and nothing more.',
    desc: 'Starts from individual rights so strong that they limit what any state may do. Only a minimal state that protects against force, theft and fraud and enforces contracts can be justified. Anything more, including taxing some people to help others, violates rights.'
  },
  {
    id: 'anarcho-capitalism', name: 'Anarcho Capitalism', family: 'Libertarian',
    coords: coords(0, 0, 0, 30, 0, 15, 45, 55, 20, 10, 25, 15, 0),
    figure: { name: 'Murray Rothbard', years: '1926 to 1995' },
    source: { author: 'Murray Rothbard', work: 'For a New Liberty', year: 1973 },
    tagline: 'Even law and defence should be supplied by the market.',
    desc: 'Builds everything on self ownership and the non aggression principle. Because taxation is taken by force, the state is a criminal organisation by its nature. Courts, police and defence should be provided by competing private firms, and all property should be privately owned.'
  },

  /* ---------------------------- CONSERVATIVE ---------------------------- */
  {
    id: 'burkean-conservatism', name: 'Burkean Conservatism', family: 'Conservative',
    coords: coords(30, 15, 50, 50, 40, 65, 70, 95, 65, 50, 80, 55, 30),
    figure: { name: 'Edmund Burke', years: '1729 to 1797' },
    source: { author: 'Edmund Burke', work: 'Reflections on the Revolution in France', year: 1790 },
    tagline: 'Society is a partnership of the dead, the living and the unborn.',
    desc: 'Distrusts schemes that rebuild society from abstract principles, because inherited institutions hold more accumulated wisdom than any one generation can see. Change should be gradual and should repair, not replace. Attachment to one\'s own small corner of society, which Burke called the little platoon, is where loyalty to the wider nation begins.'
  },
  {
    id: 'reactionary-monarchism', name: 'Reactionary Monarchism', family: 'Reactionary',
    coords: coords(45, 25, 90, 100, 85, 60, 85, 100, 80, 45, 100, 70, 50),
    figure: { name: 'Joseph de Maistre', years: '1753 to 1821' },
    source: { author: 'Joseph de Maistre', work: 'Considerations on France (1797) and The Pope', year: 1819 },
    tagline: 'Throne and altar.',
    desc: 'Reads the French Revolution as divine punishment for a society that put human reason above God. No constitution can be written by men; legitimate authority grows from history and providence. Order requires an absolute monarch, and above him the spiritual authority of the Pope.'
  },
  {
    id: 'christian-democracy', name: 'Christian Democracy', family: 'Conservative',
    coords: coords(45, 30, 40, 15, 35, 35, 45, 75, 55, 50, 85, 35, 35),
    figure: { name: 'Jacques Maritain', years: '1882 to 1973' },
    source: { author: 'Jacques Maritain', work: 'Integral Humanism (1936) and Christianity and Democracy', year: 1943 },
    tagline: 'The dignity of the person, in a pluralist democracy.',
    desc: 'Grounds democracy and human rights in the Christian view of the person, against both individualism and collectivism. Following Catholic social teaching, decisions belong at the lowest level able to handle them, with family, church and associations standing between the individual and the state. It supports markets tempered by solidarity and a welfare safety net.'
  },
  {
    id: 'distributism', name: 'Distributism', family: 'Conservative',
    coords: coords(30, 30, 30, 25, 10, 55, 60, 90, 75, 65, 95, 35, 70),
    figure: { name: 'G. K. Chesterton', years: '1874 to 1936' },
    source: { author: 'Hilaire Belloc and G. K. Chesterton', work: 'The Servile State (1912) and The Outline of Sanity', year: 1926 },
    tagline: 'Three acres and a cow.',
    desc: 'The problem with capitalism is too few capitalists. Belloc and Chesterton held that concentrated ownership, whether by big business or by the state, reduces most people to dependence. Productive property should be spread as widely as possible among families, small farms, workshops and guilds, in line with Catholic social teaching.'
  },
  {
    id: 'national-conservatism', name: 'National Conservatism', family: 'Conservative',
    coords: coords(40, 20, 60, 35, 60, 95, 85, 85, 55, 30, 80, 65, 75),
    figure: { name: 'Yoram Hazony', years: 'born 1964' },
    source: { author: 'Yoram Hazony', work: 'The Virtue of Nationalism', year: 2018 },
    tagline: 'A world of independent nations, not a universal order.',
    desc: 'Argues that the best political order is one of free and independent national states, each ruling itself by its own traditions. It opposes both liberal internationalism and empire as attempts to impose one law on all peoples. A nation is held together by mutual loyalty, shared language, religion and history, not by abstract rights alone.'
  },

  /* --------------------------- NEOREACTIONARY --------------------------- */
  {
    id: 'neo-cameralism', name: 'Neo Cameralism', family: 'Reactionary',
    coords: coords(10, 0, 60, 100, 30, 30, 60, 75, 15, 15, 35, 50, 15),
    figure: { name: 'Curtis Yarvin', years: 'born 1973' },
    source: { author: 'Curtis Yarvin, writing as Mencius Moldbug', work: 'Patchwork: A Political System for the 21st Century', year: 2008 },
    tagline: 'The state as a company, the ruler as its chief executive.',
    desc: 'Treats a state as a business that owns a country. It should be run for profit by a chief executive who answers to shareholders, with no elections. Yarvin imagines a patchwork of many small sovereign corporations competing for residents, whose main protection is the freedom to leave.'
  },
  {
    id: 'right-accelerationism', name: 'Right Accelerationism', family: 'Reactionary',
    coords: coords(0, 0, 40, 85, 15, 10, 55, 50, 0, 0, 10, 45, 5),
    figure: { name: 'Nick Land', years: 'born 1962' },
    source: { author: 'Nick Land', work: 'Fanged Noumena (2011) and The Dark Enlightenment', year: 2012 },
    tagline: 'Capital and technology are an intelligence to be unleashed.',
    desc: 'Sees capitalism and technology as one self reinforcing process that is outrunning human control, and holds that this should be sped up, not restrained. Democracy is treated as a brake that consumes the future for present comfort. Land favours exit into competing, non democratic jurisdictions over any attempt at reform.'
  },
  {
    id: 'network-state', name: 'Network State', family: 'Technological',
    coords: coords(10, 10, 20, 45, 5, 5, 45, 45, 0, 25, 25, 20, 3),
    figure: { name: 'Balaji Srinivasan', years: 'born 1980' },
    source: { author: 'Balaji Srinivasan', work: 'The Network State', year: 2022 },
    tagline: 'Cloud first, land last.',
    desc: 'A network state begins as an online community with a shared moral purpose and a recognised founder. It organises collective action, crowdfunds territory around the world, and eventually seeks diplomatic recognition. Membership is opt in, recorded on a blockchain, and can be left at will.'
  },

  /* ------------------------ GREEN AND TECHNOCRATIC ----------------------- */
  {
    id: 'deep-ecology', name: 'Deep Ecology', family: 'Green',
    coords: coords(55, 60, 30, 15, 15, 15, 25, 40, 85, 100, 40, 5, 80),
    figure: { name: 'Arne Næss', years: '1912 to 2009' },
    source: { author: 'Arne Næss, with George Sessions', work: 'The Shallow and the Deep (1973) and the Deep Ecology Platform', year: 1984 },
    tagline: 'All life has value in itself.',
    desc: 'Næss separated shallow environmentalism, which protects nature for human benefit, from deep ecology, which holds that every living thing has worth of its own. Humans have no right to reduce the richness of life except to meet vital needs. This implies a smaller human population and a much lighter way of living.'
  },
  {
    id: 'eco-authoritarianism', name: 'Eco Authoritarianism', family: 'Green',
    coords: coords(85, 70, 100, 95, 90, 70, 75, 65, 95, 100, 20, 80, 80),
    figure: { name: 'Pentti Linkola', years: '1932 to 2020' },
    source: { author: 'Pentti Linkola', work: 'Voisiko elämä voittaa (in English: Can Life Prevail?)', year: 2004 },
    tagline: 'Only a firm hand can stop the ecological collapse.',
    desc: 'Linkola held that democracy and consumer freedom cannot stop ecological destruction, because people will not vote to give up comfort. He called for a strong central authority to end economic growth, dismantle most industry and sharply reduce both consumption and population. The survival of life as a whole ranks above individual human rights.'
  },
  {
    id: 'technocracy', name: 'Technocracy', family: 'Technological',
    coords: coords(100, 85, 60, 85, 100, 50, 60, 40, 5, 35, 5, 40, 70),
    figure: { name: 'Howard Scott', years: '1890 to 1970' },
    source: { author: 'Technocracy Inc., written chiefly by M. King Hubbert', work: 'Technocracy Study Course', year: 1934 },
    tagline: 'Government by engineers, accounting in energy.',
    desc: 'Argued that politics and the price system could not manage an economy of abundance. Scott proposed replacing both with a continental Technate run by engineers and scientists chosen for competence. Money would be replaced by energy certificates, and production planned as an engineering problem.'
  },

  /* ------------------------- MORE THIRD POSITION ------------------------- */
  {
    id: 'national-socialism', name: 'National Socialism', family: 'Third Position',
    coords: coords(70, 40, 100, 100, 100, 100, 100, 80, 30, 45, 35, 100, 92),
    figure: { name: 'Adolf Hitler', years: '1889 to 1945' },
    source: { author: 'NSDAP and Adolf Hitler', work: 'The Twenty Five Point Programme (1920) and Mein Kampf', year: 1925 },
    tagline: 'Race above state, class and individual.',
    desc: 'Differs from Italian Fascism by putting race, not the state, at the centre: the state exists only to preserve and expand a racially defined people. Its core doctrines are antisemitism, the leader principle of total obedience upward, and the conquest of living space in the east. In power it destroyed every rival institution and carried out the Holocaust and a war of extermination.'
  },
  {
    id: 'national-syndicalism', name: 'National Syndicalism', family: 'Third Position',
    coords: coords(80, 65, 90, 90, 90, 95, 90, 60, 35, 30, 35, 95, 75),
    figure: { name: 'Ramiro Ledesma Ramos', years: '1905 to 1936' },
    source: { author: 'Ramiro Ledesma Ramos', work: 'La Conquista del Estado manifesto', year: 1931 },
    tagline: 'The syndicates of the left, the nation of the right.',
    desc: 'Ledesma fused the revolutionary unions of syndicalism with radical nationalism, before Falangism absorbed his movement. The whole economy is to be organised into compulsory state syndicates, with big wealth subordinated to national ends. It is more secular, more worker focused and more openly revolutionary than the Catholic Falangism it merged into.'
  },
  {
    id: 'brazilian-integralism', name: 'Brazilian Integralism', family: 'Third Position',
    coords: coords(65, 40, 85, 90, 85, 90, 70, 90, 50, 35, 95, 70, 70),
    figure: { name: 'Plínio Salgado', years: '1895 to 1975' },
    source: { author: 'Plínio Salgado', work: 'The October Manifesto', year: 1932 },
    tagline: 'God, fatherland, family.',
    desc: 'Calls for an integral state that unites every class and region of Brazil under a spiritual conception of life. It is corporatist and anti liberal like European fascism, but its official line rejects racial doctrine and presents the nation as a fusion of all its peoples, although the movement also had a strongly antisemitic wing. Christian faith is treated as the foundation of the whole political order.'
  },
  {
    id: 'austrofascism', name: 'Austrofascism', family: 'Third Position',
    coords: coords(60, 30, 85, 90, 60, 70, 80, 95, 60, 40, 100, 60, 75),
    figure: { name: 'Engelbert Dollfuss', years: '1892 to 1934' },
    source: { author: 'Engelbert Dollfuss', work: 'The Trabrennplatz Address', year: 1933 },
    tagline: 'A Christian, German state of estates under authoritarian leadership.',
    desc: 'Dollfuss announced the end of parliament and parties and their replacement by a state organised into occupational estates, following the papal encyclical Quadragesimo Anno. It is Catholic and corporatist, and it defined itself against both Marxism and German National Socialism. Authority flows from above, with the Church as the moral centre.'
  },
  {
    id: 'third-international-theory', name: 'Third International Theory', family: 'Third Position',
    coords: coords(75, 85, 70, 25, 35, 85, 80, 85, 50, 40, 80, 65, 70),
    figure: { name: 'Muammar Gaddafi', years: '1942 to 2011' },
    source: { author: 'Muammar Gaddafi', work: 'The Green Book', year: '1975 to 1979' },
    tagline: 'Neither capitalism nor communism, but the state of the masses.',
    desc: 'The Green Book rejects parliaments and parties as a fraud on the people and proposes direct rule through popular congresses and committees. In economics it says workers should be partners, not wage earners, and that a house belongs to whoever lives in it. Nation, religion and custom are named as the natural basis of society. This describes the text, not how Libya was actually governed.'
  },
  {
    id: 'nasserism', name: 'Nasserism', family: 'Nationalist',
    coords: coords(75, 65, 80, 85, 90, 95, 85, 50, 25, 15, 40, 80, 80),
    figure: { name: 'Gamal Abdel Nasser', years: '1918 to 1970' },
    source: { author: 'Gamal Abdel Nasser', work: 'The Philosophy of the Revolution (1954) and the National Charter', year: 1962 },
    tagline: 'Arab unity, socialism, and no alignment with either bloc.',
    desc: 'Nasser placed Egypt at the centre of three circles: Arab, African and Islamic. The army is the vanguard that frees the nation from foreign control and feudal landowners. The state then drives development through nationalisation and land reform, while staying outside both the American and Soviet camps.'
  },
  {
    id: 'futurism', name: 'Futurism', family: 'Third Position',
    coords: coords(55, 40, 70, 75, 75, 95, 80, 0, 0, 0, 0, 100, 60),
    figure: { name: 'Filippo Tommaso Marinetti', years: '1876 to 1944' },
    source: { author: 'F. T. Marinetti', work: 'The Founding and Manifesto of Futurism', year: 1909 },
    tagline: 'A racing car is more beautiful than the Victory of Samothrace.',
    desc: 'Marinetti demanded the destruction of museums, libraries and every inherited piety, and the worship of speed, machines, youth and danger. The manifesto glorifies war as the world\'s only hygiene. Its politics were fiercely nationalist and anti clerical, and many Futurists fed into early Fascism while despising its later compromise with tradition.'
  },
  {
    id: 'radical-traditionalism', name: 'Radical Traditionalism', family: 'Reactionary',
    coords: coords(45, 30, 90, 100, 70, 45, 80, 100, 95, 50, 90, 90, 45),
    figure: { name: 'Julius Evola', years: '1898 to 1974' },
    source: { author: 'Julius Evola', work: 'Revolt Against the Modern World', year: 1934 },
    tagline: 'Against the modern world, for hierarchy and the sacred.',
    desc: 'Evola held that history is a long decline from a primordial order ruled by a sacred kingship and a warrior caste. Democracy, equality, materialism and mass nationalism are all symptoms of that fall. He wanted an aristocratic, imperial order founded on spiritual authority, and criticised Fascism for being too modern and too plebeian.'
  },
  {
    id: 'archeofuturism', name: 'Archeofuturism', family: 'Reactionary',
    coords: coords(45, 30, 85, 90, 65, 80, 95, 85, 5, 45, 35, 85, 60),
    figure: { name: 'Guillaume Faye', years: '1949 to 2019' },
    source: { author: 'Guillaume Faye', work: 'Archeofuturism', year: 1998 },
    tagline: 'Archaic values, futuristic technology.',
    desc: 'Faye predicted that modern egalitarian civilisation would collapse under converging crises. What follows should combine pre modern values, such as hierarchy, rootedness and a warrior ethic, with the most advanced science and technology. He imagined a federated European empire with a high tech elite and a neo traditional majority.'
  },

  /* --------------------------- MORE COMMUNIST --------------------------- */
  {
    id: 'trotskyism', name: 'Trotskyism', family: 'Radical Left',
    coords: coords(95, 100, 70, 60, 80, 0, 30, 20, 15, 15, 0, 80, 70),
    figure: { name: 'Leon Trotsky', years: '1879 to 1940' },
    source: { author: 'Leon Trotsky', work: 'The Permanent Revolution', year: 1930 },
    tagline: 'The revolution cannot stop at one country.',
    desc: 'Argues that in backward countries the working class must lead the revolution straight through to socialism, and that it can only survive by spreading internationally. Socialism in a single country is impossible. Trotsky also condemned the Soviet bureaucracy as a caste that had usurped the workers\' state.'
  },
  {
    id: 'stalinism', name: 'Stalinism', family: 'Radical Left',
    coords: coords(100, 100, 100, 100, 100, 65, 65, 55, 10, 5, 0, 90, 92),
    figure: { name: 'Joseph Stalin', years: '1878 to 1953' },
    source: { author: 'J. V. Stalin', work: 'Concerning Questions of Leninism', year: 1926 },
    tagline: 'Socialism in one country.',
    desc: 'Against Trotsky, Stalin argued that a complete socialist society could be built inside the Soviet Union alone, without waiting for revolution abroad. In practice this became forced collectivisation of farming and rapid heavy industry under five year plans. He later added that class struggle sharpens as socialism advances, which justified an ever stronger security state.'
  },
  {
    id: 'luxemburgism', name: 'Luxemburgism', family: 'Radical Left',
    coords: coords(85, 100, 35, 15, 45, 0, 25, 20, 25, 25, 0, 50, 50),
    figure: { name: 'Rosa Luxemburg', years: '1871 to 1919' },
    source: { author: 'Rosa Luxemburg', work: 'The Russian Revolution', year: 'written 1918, published 1922' },
    tagline: 'Freedom is always the freedom of the one who thinks differently.',
    desc: 'A revolutionary Marxism that insists socialism must be made by the masses themselves through spontaneous action such as the mass strike. Luxemburg supported the Bolshevik revolution but attacked its suppression of elections, press and assembly. Without open democracy, she warned, the party dictatorship would harden into rule by a clique.'
  },
  {
    id: 'titoism', name: 'Titoism (Self Management)', family: 'Radical Left',
    coords: coords(60, 90, 65, 70, 35, 45, 25, 30, 30, 25, 5, 55, 60),
    figure: { name: 'Edvard Kardelj', years: '1910 to 1979' },
    source: { author: 'Edvard Kardelj', work: 'Directions of the Development of the Political System of Socialist Self Management', year: 1977 },
    tagline: 'Factories to the workers, and no orders from Moscow.',
    desc: 'The Yugoslav break with Stalin. Enterprises are socially owned but run by councils of their own workers, competing in a regulated market instead of following a central plan. The state is a federation of republics with real powers, and in foreign policy it refuses to join either Cold War bloc.'
  },
  {
    id: 'dengism', name: 'Dengism', family: 'Radical Left',
    coords: coords(45, 60, 85, 90, 85, 70, 60, 45, 10, 10, 0, 60, 40),
    figure: { name: 'Deng Xiaoping', years: '1904 to 1997' },
    source: { author: 'Deng Xiaoping', work: 'Emancipate the Mind, Seek Truth from Facts and Unite as One in Looking to the Future', year: 1978 },
    tagline: 'Yellow cat or black cat, the one that catches mice is a good cat.',
    desc: 'Deng argued that poverty is not socialism and that the task of a socialist state is to develop the productive forces. Markets, private firms and foreign capital are tools to that end, to be judged by results. The Communist Party keeps an absolute monopoly on political power throughout.'
  },
  {
    id: 'guevarism', name: 'Guevarism', family: 'Radical Left',
    coords: coords(100, 100, 80, 80, 85, 25, 35, 25, 30, 20, 0, 95, 55),
    figure: { name: 'Che Guevara', years: '1928 to 1967' },
    source: { author: 'Ernesto Che Guevara', work: 'Guerrilla Warfare (1960) and Socialism and Man in Cuba', year: 1965 },
    tagline: 'Create two, three, many Vietnams.',
    desc: 'Holds that a small band of guerrillas in the countryside can create the conditions for revolution without waiting for them to ripen. After victory, socialism must build a new human being who works from moral conviction and not for material reward. The struggle is continental and anti imperialist.'
  },

  /* --------------------------- MORE SOCIALIST --------------------------- */
  {
    id: 'utopian-socialism', name: 'Utopian Socialism', family: 'Left',
    coords: coords(60, 85, 20, 25, 10, 10, 25, 20, 35, 50, 20, 5, 40),
    figure: { name: 'Robert Owen', years: '1771 to 1858' },
    source: { author: 'Robert Owen', work: 'A New View of Society and the Report to the County of Lanark', year: '1813 to 1820' },
    tagline: 'Change the surroundings and you change the person.',
    desc: 'Owen argued that character is formed by environment, so poverty and vice can be removed by reorganising how people live and work. He proposed small cooperative villages with shared property, education for all and humane conditions. Change comes through example and persuasion, not class conflict.'
  },
  {
    id: 'revolutionary-syndicalism', name: 'Revolutionary Syndicalism', family: 'Left',
    coords: coords(60, 90, 25, 15, 15, 20, 35, 45, 40, 30, 10, 85, 40),
    figure: { name: 'Georges Sorel', years: '1847 to 1922' },
    source: { author: 'Georges Sorel', work: 'Reflections on Violence', year: 1908 },
    tagline: 'The myth of the general strike.',
    desc: 'Sorel rejected parliamentary socialism as a betrayal that tames the workers. What moves people to heroic action is a myth, and for the working class that myth is the general strike. Proletarian violence, he argued, restores moral energy to a decadent society. He was theorising the syndicalist unions of his own day, and early fascists later drew on him.'
  },
  {
    id: 'ujamaa', name: 'Ujamaa (African Socialism)', family: 'Left',
    coords: coords(80, 90, 65, 75, 60, 65, 50, 60, 60, 55, 35, 35, 85),
    figure: { name: 'Julius Nyerere', years: '1922 to 1999' },
    source: { author: 'Julius Nyerere', work: 'Ujamaa: The Basis of African Socialism (1962) and the Arusha Declaration', year: 1967 },
    tagline: 'Socialism as the extended family.',
    desc: 'Nyerere argued that socialism is an attitude of mind already present in traditional African society, where nobody starved while others hoarded. The nation should be rebuilt as a family of self reliant village communities that farm together. It rejects both capitalism and the doctrine of class war.'
  },
  {
    id: 'eco-socialism', name: 'Eco Socialism', family: 'Green',
    coords: coords(80, 85, 30, 10, 45, 5, 20, 15, 65, 90, 5, 25, 70),
    figure: { name: 'Michael Löwy', years: 'born 1938' },
    source: { author: 'Joel Kovel and Michael Löwy', work: 'An Ecosocialist Manifesto', year: 2001 },
    tagline: 'Capitalism cannot be made green.',
    desc: 'Argues that the ecological crisis and social breakdown share one cause: an economy that must expand without limit. Neither green capitalism nor the productivist socialism of the Soviet type can solve it. The answer is democratic planning of production around real needs within ecological limits.'
  },

  /* --------------------------- MORE ANARCHIST --------------------------- */
  {
    id: 'democratic-confederalism', name: 'Democratic Confederalism', family: 'Autonomist',
    coords: coords(60, 85, 10, 0, 0, 5, 5, 10, 45, 85, 10, 45, 40),
    figure: { name: 'Abdullah Öcalan', years: 'born 1949' },
    source: { author: 'Abdullah Öcalan', work: 'Democratic Confederalism', year: 2011 },
    tagline: 'Democracy without the state.',
    desc: 'Öcalan abandoned the goal of a Kurdish nation state and proposed self government through networks of local councils instead. It rests on three pillars: grassroots democracy, ecology and the liberation of women. Different ethnic and religious groups govern themselves side by side, with armed self defence but no state above them.'
  },
  {
    id: 'zapatismo', name: 'Zapatismo', family: 'Autonomist',
    coords: coords(60, 85, 10, 0, 5, 25, 5, 35, 60, 75, 25, 45, 85),
    figure: { name: 'Subcomandante Marcos', years: 'EZLN spokesman' },
    source: { author: 'Zapatista Army of National Liberation', work: 'Sixth Declaration of the Lacandon Jungle', year: 2005 },
    tagline: 'To lead by obeying.',
    desc: 'An indigenous movement from Chiapas that does not seek state power. Communities govern themselves through rotating councils whose delegates must obey those who chose them. It defends communal land and indigenous customs against neoliberal globalisation, and aims at a world in which many worlds fit.'
  },

  /* ---------------------------- MORE LIBERAL ---------------------------- */
  {
    id: 'keynesian-liberalism', name: 'Keynesian Liberalism', family: 'Liberal',
    coords: coords(50, 30, 25, 10, 60, 35, 30, 25, 30, 35, 15, 35, 35),
    figure: { name: 'John Maynard Keynes', years: '1883 to 1946' },
    source: { author: 'John Maynard Keynes', work: 'The General Theory of Employment, Interest and Money', year: 1936 },
    tagline: 'Markets can get stuck, and the state can unstick them.',
    desc: 'Keynes showed that a market economy can settle at high unemployment for long periods, because total demand may fall short. Government should manage demand through spending, taxation and interest rates. The aim is to save capitalism and individual liberty by correcting their worst failure, not to replace them.'
  },
  {
    id: 'neoliberalism', name: 'Neoliberalism', family: 'Liberal',
    coords: coords(10, 5, 30, 25, 45, 15, 35, 40, 20, 15, 20, 40, 3),
    figure: { name: 'Milton Friedman', years: '1912 to 2006' },
    source: { author: 'Milton Friedman', work: 'Capitalism and Freedom', year: 1962 },
    tagline: 'Economic freedom is a condition of political freedom.',
    desc: 'Friedman argued that competitive markets both produce prosperity and disperse power, which protects liberty. Government should be limited to rules, stable money, enforcing contracts and a minimal safety net such as a negative income tax. The label is mostly used by critics. Friedman called himself a liberal in the classical sense.'
  },
  {
    id: 'third-way', name: 'Third Way', family: 'Liberal',
    coords: coords(35, 25, 40, 10, 50, 25, 25, 25, 25, 40, 15, 45, 15),
    figure: { name: 'Anthony Giddens', years: 'born 1938' },
    source: { author: 'Anthony Giddens', work: 'The Third Way: The Renewal of Social Democracy', year: 1998 },
    tagline: 'No rights without responsibilities.',
    desc: 'An attempt to renew social democracy after the Cold War by accepting markets and globalisation. The state should invest in people through education and training instead of simply redistributing income. Not to be confused with Third Position: this third way runs between old social democracy and free market liberalism.'
  },
  {
    id: 'objectivism', name: 'Objectivism', family: 'Libertarian',
    coords: coords(0, 0, 5, 25, 30, 25, 45, 25, 5, 0, 0, 40, 0),
    figure: { name: 'Ayn Rand', years: '1905 to 1982' },
    source: { author: 'Ayn Rand, with essays by Nathaniel Branden', work: 'The Virtue of Selfishness', year: 1964 },
    tagline: 'Rational self interest is the moral ideal.',
    desc: 'Rand held that reason is the only means of knowledge and that achieving one\'s own happiness is each person\'s highest moral purpose. Altruism, the duty to live for others, is rejected as destructive. The only system consistent with this is laissez faire capitalism under a government limited to police, courts and defence.'
  },
  {
    id: 'hoppeanism', name: 'Hoppean Libertarianism', family: 'Libertarian',
    coords: coords(0, 0, 20, 70, 0, 35, 80, 90, 35, 15, 45, 25, 2),
    figure: { name: 'Hans-Hermann Hoppe', years: 'born 1949' },
    source: { author: 'Hans-Hermann Hoppe', work: 'Democracy: The God That Failed', year: 2001 },
    tagline: 'A private law society of covenant communities.',
    desc: 'Hoppe argues that democracy is worse than monarchy because elected rulers are temporary caretakers who plunder for the short term. His ideal is no state at all, with all land privately owned. Owners would form covenant communities free to set their own rules and to exclude those who reject them, which gives the theory a strongly conservative social character.'
  },

  /* ---------------------------- TECHNOLOGICAL ---------------------------- */
  {
    id: 'effective-accelerationism', name: 'Effective Accelerationism', family: 'Technological',
    coords: coords(5, 5, 15, 35, 15, 10, 40, 30, 0, 0, 10, 30, 5),
    figure: { name: 'Guillaume Verdon', years: 'writing as Beff Jezos' },
    source: { author: 'Beff Jezos and bayeslord', work: 'Notes on e/acc Principles and Tenets', year: 2022 },
    tagline: 'Accelerate, and climb the Kardashev scale.',
    desc: 'Treats the growth of intelligence and energy use as a law of the universe that should be embraced. Technology and markets are to be pushed forward as fast as possible, especially artificial intelligence. It opposes regulation and safety pauses, and wants development spread widely so that no single authority controls it.'
  },
  {
    id: 'bioconservatism', name: 'Bioconservatism', family: 'Technological',
    coords: coords(40, 30, 50, 20, 50, 40, 45, 75, 95, 60, 55, 35, 45),
    figure: { name: 'Leon Kass', years: 'born 1939' },
    source: { author: 'Leon R. Kass', work: 'Life, Liberty, and the Defense of Dignity', year: 2002 },
    tagline: 'Human nature is not ours to redesign.',
    desc: 'Kass argues that cloning, genetic enhancement and the pursuit of ageless bodies threaten the things that give human life its meaning. Our sense of revulsion at such projects holds a wisdom that argument cannot fully state. Biotechnology should therefore be restrained by law in defence of human dignity.'
  },

  /* ---------------------------- CONSERVATIVE ---------------------------- */
  {
    id: 'neoconservatism', name: 'Neoconservatism', family: 'Conservative',
    coords: coords(25, 15, 60, 25, 60, 60, 60, 65, 30, 15, 55, 95, 25),
    figure: { name: 'Irving Kristol', years: '1920 to 2009' },
    source: { author: 'Irving Kristol', work: 'Neoconservatism: The Autobiography of an Idea', year: 1995 },
    tagline: 'A liberal who has been mugged by reality.',
    desc: 'Begun by former liberals who turned against the unintended effects of social programmes and the counterculture. It accepts a limited welfare state and capitalism while stressing religion and bourgeois virtue as their moral support. Abroad it holds that a great democracy should use its power, including military power, to defend and spread its values.'
  },
  {
    id: 'paleoconservatism', name: 'Paleoconservatism', family: 'Conservative',
    coords: coords(35, 15, 50, 35, 25, 95, 95, 95, 65, 40, 80, 25, 85),
    figure: { name: 'Pat Buchanan', years: 'born 1938' },
    source: { author: 'Patrick J. Buchanan', work: 'A Republic, Not an Empire', year: 1999 },
    tagline: 'A republic, not an empire.',
    desc: 'The old right that rejects neoconservative foreign policy. A nation should avoid wars and alliances that do not serve its own vital interests, protect its industries with tariffs, and sharply limit immigration to preserve its inherited culture. Power belongs close to home, in states, towns and families.'
  },
  {
    id: 'communitarianism', name: 'Communitarianism', family: 'Conservative',
    coords: coords(45, 35, 50, 15, 30, 45, 50, 65, 50, 50, 45, 35, 45),
    figure: { name: 'Amitai Etzioni', years: '1929 to 2023' },
    source: { author: 'Amitai Etzioni', work: 'The Spirit of Community', year: 1993 },
    tagline: 'Strong rights presume strong responsibilities.',
    desc: 'Argues that liberal societies have overemphasised individual rights and neglected the communities that make free people possible. Families, schools and neighbourhoods carry moral values and need active support. It seeks a balance between personal liberty and the common good, enforced mostly by social pressure and not by the state.'
  },

  /* ----------------------------- NATIONALIST ----------------------------- */
  {
    id: 'kemalism', name: 'Kemalism', family: 'Nationalist',
    coords: coords(65, 45, 75, 75, 95, 95, 100, 20, 15, 15, 5, 75, 75),
    figure: { name: 'Mustafa Kemal Atatürk', years: '1881 to 1938' },
    source: { author: 'Mustafa Kemal Atatürk', work: 'Nutuk (The Speech, 1927) and the Six Arrows', year: 1931 },
    tagline: 'Republicanism, nationalism, populism, statism, secularism, reformism.',
    desc: 'The founding programme of the Turkish Republic, summed up in six arrows. Religion is removed from the state, law and schooling. A single Turkish national identity replaces the many communities of the empire. The state leads industrialisation, and society is modernised from above along Western lines.'
  },
  {
    id: 'bonapartism', name: 'Bonapartism', family: 'Nationalist',
    coords: coords(50, 25, 80, 90, 100, 85, 80, 55, 30, 20, 40, 95, 65),
    figure: { name: 'Louis-Napoléon Bonaparte', years: '1808 to 1873' },
    source: { author: 'Louis-Napoléon Bonaparte', work: 'Napoleonic Ideas', year: 1839 },
    tagline: 'One leader, chosen directly by the people.',
    desc: 'Presents the Napoleonic system as the true heir of the Revolution: a strong hereditary executive who draws his legitimacy directly from the people by plebiscite, over the heads of parliament and parties. It promises order, national glory, a centralised efficient administration and material progress for all classes.'
  },
  {
    id: 'zionism', name: 'Political Zionism', family: 'Nationalist',
    coords: coords(45, 40, 45, 20, 60, 95, 75, 50, 25, 30, 45, 70, 65),
    figure: { name: 'Theodor Herzl', years: '1860 to 1904' },
    source: { author: 'Theodor Herzl', work: 'The Jewish State', year: 1896 },
    tagline: 'We are a people, one people.',
    desc: 'Herzl argued that antisemitism could not be ended by assimilation, because Jews are a nation and not only a religious group. The solution is political: an internationally recognised Jewish state. He imagined it as a modern, tolerant society built by organised migration and investment.'
  },
  {
    id: 'hindutva', name: 'Hindutva', family: 'Nationalist',
    coords: coords(45, 25, 70, 45, 75, 100, 95, 85, 40, 30, 80, 80, 70),
    figure: { name: 'Vinayak Damodar Savarkar', years: '1883 to 1966' },
    source: { author: 'V. D. Savarkar', work: 'Essentials of Hindutva', year: 1923 },
    tagline: 'A common nation, a common race, a common civilisation.',
    desc: 'Savarkar defined a Hindu as someone for whom India is both fatherland and holy land. Hindutva is therefore a national and cultural identity, wider than Hinduism as a faith. It calls for a strong, unified and militarily capable Hindu nation, and regards communities whose holy lands lie elsewhere as not fully belonging.'
  },

  /* ------------------------------ RELIGIOUS ------------------------------ */
  {
    id: 'islamism', name: 'Islamism (Qutbism)', family: 'Religious',
    coords: coords(55, 40, 90, 85, 80, 20, 90, 95, 60, 35, 100, 90, 65),
    figure: { name: 'Sayyid Qutb', years: '1906 to 1966' },
    source: { author: 'Sayyid Qutb', work: 'Milestones', year: 1964 },
    tagline: 'Sovereignty belongs to God alone.',
    desc: 'Qutb held that any society ruled by man made law, including nominally Muslim ones, lives in a state of ignorance. Only God may legislate, so nationalism, democracy and socialism are all forms of servitude to men. A committed vanguard must separate itself and struggle to establish an order under divine law across the whole community of believers.'
  },
  {
    id: 'khomeinism', name: 'Khomeinism', family: 'Religious',
    coords: coords(60, 45, 90, 90, 90, 55, 85, 95, 50, 30, 100, 80, 80),
    figure: { name: 'Ruhollah Khomeini', years: '1900 or 1902 to 1989' },
    source: { author: 'Ruhollah Khomeini', work: 'Islamic Government: Governance of the Jurist', year: 1970 },
    tagline: 'Guardianship of the jurist.',
    desc: 'Khomeini argued that in the absence of the hidden Imam, the right to govern passes to just and learned Islamic jurists. Monarchy is illegitimate. Government exists to enforce divine law. In the Islamic Republic that followed, this became a Supreme Leader with final authority over every other institution, including elected ones. It also frames politics as the oppressed against the arrogant powers.'
  },
  {
    id: 'gandhism', name: 'Gandhism', family: 'Religious',
    coords: coords(35, 60, 5, 10, 0, 55, 10, 75, 95, 85, 90, 0, 90),
    figure: { name: 'Mohandas Gandhi', years: '1869 to 1948' },
    source: { author: 'M. K. Gandhi', work: 'Hind Swaraj', year: 1909 },
    tagline: 'Self rule through truth and non violence.',
    desc: 'Hind Swaraj argues that real self rule is mastery of oneself, not just removing foreign rulers. Gandhi condemned modern industrial civilisation, with its railways, machinery, lawyers and doctors, as a disease. He praised village life and hand production, and in later writing pictured India as a federation of self sufficient villages. Resistance must take the form of non violent refusal to cooperate.'
  },

  /* ------------------------------ CLASSICAL ------------------------------ */
  {
    id: 'platonism', name: 'Platonic Guardianship', family: 'Classical',
    coords: coords(80, 75, 90, 95, 90, 60, 85, 80, 75, 45, 60, 70, 85),
    figure: { name: 'Plato', years: 'c. 428 to 348 BC' },
    source: { author: 'Plato', work: 'The Republic', year: 'c. 375 BC' },
    tagline: 'Until philosophers are kings, cities will have no rest from evils.',
    desc: 'Plato held that justice means each class doing the work it is fit for: producers, soldiers and rulers. The rulers must be philosophers trained for decades to know the good. To keep them from corruption, the guardian class owns no private property and raises its children in common, and poetry and music are censored.'
  },
  {
    id: 'confucianism', name: 'Confucianism', family: 'Classical',
    coords: coords(50, 35, 65, 80, 70, 50, 75, 95, 60, 50, 45, 30, 70),
    figure: { name: 'Confucius', years: '551 to 479 BC' },
    source: { author: 'Confucius', work: 'The Analects', year: 'compiled after 479 BC' },
    tagline: 'Govern by virtue, and the people will have a sense of shame.',
    desc: 'Teaches that good order comes from moral example and ritual, not from punishment. Society is a web of unequal but reciprocal relationships, beginning with the duty of children to parents. Rulers should lead by virtue and care for the people, and office should go to the learned and upright. Later Confucians such as Mencius added that a ruler who fails in this loses the right to rule.'
  },

  /* ====================== ADDED IN THE 250 EXPANSION ======================
     Each entry was researched against its source text. symbol names its emblem,
     wiki is the article used to find a portrait, and restricted marks hateful or
     violent extremist ideologies, which get no emblem and no portrait. */
  {
    id: 'classical-marxism', name: 'Classical Marxism', family: 'Radical Left',
    coords: coords(90, 100, 50, 30, 80, 0, 30, 10, 10, 15, 0, 65, 40),
    figure: { name: 'Karl Marx', years: '1818 to 1883' },
    source: { author: 'Karl Marx and Friedrich Engels', work: 'Manifesto of the Communist Party', year: 1848 },
    tagline: 'Workers of all countries, unite!',
    desc: 'Reads all recorded history as the history of class struggles, and holds that capitalism, by concentrating industry and creating a propertyless working class, produces the force that will end it. The workers are to win political power, which the text calls winning the battle of democracy, and use it to bring credit, transport and production step by step into public hands. Class distinctions and the state as an instrument of class rule would then fade. It says the workers have no country and that its aims require the forcible overthrow of existing conditions.',
    symbol: 'star', wiki: 'Karl Marx'
  },
  {
    id: 'hoxhaism', name: 'Hoxhaism', family: 'Radical Left',
    coords: coords(100, 100, 100, 95, 100, 45, 55, 50, 25, 10, 0, 85, 100),
    figure: { name: 'Enver Hoxha', years: '1908 to 1985' },
    source: { author: 'Enver Hoxha', work: 'Imperialism and the Revolution', year: 1978 },
    tagline: 'Marxism Leninism defended against every revision, Soviet, Yugoslav and Chinese alike.',
    desc: 'Written as Albania broke with China, the book holds that the United States and the Soviet Union are both imperialist powers and that Maoism, Titoism, Khrushchev\'s course and Eurocommunism are all departures from Marxism Leninism. It defends the line of Lenin and Stalin as the only correct one, rejects the Chinese theory of three worlds, and insists that a socialist country must rely on its own forces and refuse dependence on any great power. Rule by a single vanguard party and a fully state owned, planned economy are treated as beyond question.',
    symbol: 'hammerSickle', wiki: 'Enver Hoxha'
  },
  {
    id: 'de-leonism', name: 'De Leonism', family: 'Radical Left',
    coords: coords(85, 100, 25, 10, 50, 5, 30, 25, 15, 20, 5, 20, 40),
    figure: { name: 'Daniel De Leon', years: '1852 to 1914' },
    source: { author: 'Daniel De Leon', work: 'Socialist Reconstruction of Society', year: 1905 },
    tagline: 'Socialist industrial unionism: the union as the government of the future.',
    desc: 'An address given in Minneapolis in 1905, first titled The Preamble of the IWW. De Leon argues that workers must organise by whole industry, not by craft, so that the unions can take over and run production. The ballot is valued as the peaceful, civilised way to press the demand, but it has force only if an industrial organisation stands behind it. Once the workers hold the industries, the political state built on territorial districts has no further task and gives way to an administration of delegates from the industries.',
    symbol: 'gear', wiki: 'Daniel De Leon'
  },
  {
    id: 'bordigism', name: 'Bordigism (Italian Left Communism)', family: 'Radical Left',
    coords: coords(100, 100, 75, 80, 95, 0, 35, 25, 20, 20, 0, 75, 45),
    figure: { name: 'Amadeo Bordiga', years: '1889 to 1970' },
    source: { author: 'Amadeo Bordiga', work: 'The Democratic Principle', year: 1922 },
    tagline: 'The programme decides, not the count of votes.',
    desc: 'Bordiga denies that majority voting has any value as a principle. In a class society, he argues, equal votes hide the rule of the owning class, and even inside workers\' organisations a vote is only a convenient mechanism, not a source of truth. What makes a communist party is its fixed programme and its discipline, so he proposes replacing democratic centralism with what he calls organic centralism. The current he led also refused to stand in parliamentary elections and rejected alliances with other parties.',
    symbol: 'hammerSickle', wiki: 'Amadeo Bordiga'
  },
  {
    id: 'operaismo', name: 'Operaismo (Autonomist Marxism)', family: 'Radical Left',
    coords: coords(75, 100, 25, 15, 25, 0, 25, 10, 20, 25, 0, 55, 35),
    figure: { name: 'Mario Tronti', years: '1931 to 2023' },
    source: { author: 'Mario Tronti', work: 'Workers and Capital', year: 1966 },
    tagline: 'Workers\' struggle comes first, and capital reorganises itself in response.',
    desc: 'Tronti turns the usual Marxist order around: it is the struggles of workers that drive capitalist development, forcing capital to reorganise, and not the other way round. Politics should therefore begin from the factory and from the workers\' own point of view, which is openly partial and hostile to the system. The decisive weapon is refusal, meaning the refusal of work and of collaboration in production. The book questions how far the established unions and parties still express that antagonism.',
    symbol: 'star', wiki: 'Mario Tronti'
  },
  {
    id: 'situationism', name: 'Situationism', family: 'Radical Left',
    coords: coords(70, 100, 5, 0, 10, 0, 20, 0, 30, 35, 0, 40, 35),
    figure: { name: 'Guy Debord', years: '1931 to 1994' },
    source: { author: 'Guy Debord', work: 'The Society of the Spectacle', year: 1967 },
    tagline: 'Life itself has been replaced by its image, and must be taken back.',
    desc: 'In 221 short theses Debord argues that modern capitalism has turned life into a spectacle: a social relation between people that is carried by images, in which the commodity has occupied the whole of daily experience. He applies this to Western consumer societies and to the bureaucratic states of the East alike, and to the parties and unions that claim to speak for workers. The way out is the direct rule of workers\' councils and the end of wage labour and the commodity, with existing images and language turned against their original use.',
    wiki: 'Guy Debord'
  },
  {
    id: 'blanquism', name: 'Blanquism', family: 'Radical Left',
    coords: coords(70, 90, 70, 80, 85, 40, 45, 20, 35, 30, 0, 90, 50),
    figure: { name: 'Louis Auguste Blanqui', years: '1805 to 1881' },
    source: { author: 'Louis Auguste Blanqui', work: 'Instructions for an Armed Uprising', year: 'written 1868' },
    tagline: 'Revolution as the work of a small, disciplined and prepared organisation.',
    desc: 'A manual left in manuscript. Blanqui argues that the Paris risings of 1830 and 1848 were lost because the insurgents had courage but no organisation: scattered barricades, no command, each district fighting alone. An uprising needs a body of fighters organised in advance, with officers, a single command and a plan to take the capital. The name Blanquism came to mean the wider view associated with him, that a tightly organised minority should seize power by a sudden stroke and hold it for the people, a label that Engels and later Marxists used as a criticism.',
    symbol: 'flag', wiki: 'Louis Auguste Blanqui'
  },
  {
    id: 'gonzalo-thought', name: 'Gonzalo Thought', family: 'Radical Left',
    coords: coords(100, 100, 100, 100, 100, 35, 65, 35, 45, 15, 0, 100, 55),
    figure: { name: 'Abimael Guzmán', years: '1934 to 2021' },
    source: { author: 'Abimael Guzmán (Chairman Gonzalo)', work: 'Interview with Chairman Gonzalo, published in El Diario', year: 1988 },
    tagline: 'Maoism declared a third and higher stage of Marxism, applied through total people\'s war.',
    desc: 'The doctrine of the Shining Path, the Communist Party of Peru led by Guzmán. It treats Maoism as a new stage of Marxism, holds that protracted people\'s war is valid in every country, makes revolutionary violence a universal law, and demands a militarised party united around one leader and his thought. It is a violent extremist ideology. The party\'s war from 1980 included massacres of villagers, assassinations and bombings, and Peru\'s Truth and Reconciliation Commission estimated nearly 70,000 deaths in the conflict, about half of them caused by the Shining Path.',
    restricted: true
  },
  {
    id: 'castroism', name: 'Castroism', family: 'Radical Left',
    coords: coords(90, 90, 75, 80, 85, 60, 40, 30, 30, 25, 5, 85, 65),
    figure: { name: 'Fidel Castro', years: '1926 to 2016' },
    source: { author: 'Fidel Castro', work: 'History Will Absolve Me (1953) and the Second Declaration of Havana', year: 1962 },
    tagline: 'National liberation that becomes socialist revolution.',
    desc: 'The 1953 courtroom speech names José Martí as the inspiration of the rising against Batista and sets out five laws: restore the 1940 constitution, give land to those who work it, give workers a share of company profits, give sugar growers a share of the crop\'s yield, and confiscate wealth gained by fraud. The 1962 declaration, issued after Cuba was excluded from the Organization of American States, calls the revolution socialist, blames the poverty of Latin America on imperialism, and says that making the revolution is a duty across the continent.',
    symbol: 'star', wiki: 'Fidel Castro'
  },
  {
    id: 'kautskyism', name: 'Orthodox Marxism (Kautskyism)', family: 'Radical Left',
    coords: coords(85, 95, 30, 10, 70, 10, 30, 25, 10, 20, 5, 30, 35),
    figure: { name: 'Karl Kautsky', years: '1854 to 1938' },
    source: { author: 'Karl Kautsky', work: 'The Class Struggle (1892) and The Road to Power', year: 1909 },
    tagline: 'A revolutionary party, but not a party that makes revolutions.',
    desc: 'The Class Struggle is Kautsky\'s commentary on the Erfurt Programme. It argues that capitalist development itself concentrates industry and enlarges the working class until social ownership of the means of production becomes necessary. The task of the party is to organise that class, win reforms and a majority through elections and parliament, and take political power when conditions are ripe. The Road to Power adds that the party must stay independent of bourgeois governments, and that a revolution cannot be produced at will or ahead of its time.',
    symbol: 'star', wiki: 'Karl Kautsky'
  },
  {
    id: 'austromarxism', name: 'Austromarxism', family: 'Radical Left',
    coords: coords(75, 85, 35, 10, 45, 40, 10, 30, 20, 25, 5, 35, 50),
    figure: { name: 'Otto Bauer', years: '1881 to 1938' },
    source: { author: 'Otto Bauer', work: 'The Question of Nationalities and Social Democracy', year: 1907 },
    tagline: 'Socialism joined to cultural autonomy for every nation.',
    desc: 'Bauer treats the nation as a real community of character formed by a shared history, not as an illusion that socialism will dissolve. Writing in the multinational Habsburg empire, he proposes that each nation govern its own schools and culture as an association of persons wherever they live, not as a territory, while sharing one state and one economy. Socialism, he argues, would open national culture to the whole people for the first time. The current he led sought a course between reformist social democracy and Bolshevism.',
    wiki: 'Otto Bauer'
  },
  {
    id: 'eurocommunism', name: 'Eurocommunism', family: 'Radical Left',
    coords: coords(65, 75, 30, 10, 55, 30, 25, 20, 25, 35, 5, 25, 45),
    figure: { name: 'Santiago Carrillo', years: '1915 to 2012' },
    source: { author: 'Santiago Carrillo', work: 'Eurocommunism and the State', year: 1977 },
    tagline: 'A democratic road to socialism, independent of Moscow.',
    desc: 'Carrillo, then leader of the Communist Party of Spain, argues that in developed Western countries socialism must be reached and kept through elections, several parties, civil liberties and the possibility of being voted out. The Soviet model is not to be copied and no foreign party may give orders. Instead of smashing the state, communists should win over its institutions and democratise them from within, in alliance with other social forces.',
    symbol: 'star', wiki: 'Santiago Carrillo'
  },
  {
    id: 'sankarism', name: 'Sankarism', family: 'Radical Left',
    coords: coords(85, 85, 70, 80, 70, 65, 45, 15, 35, 50, 5, 65, 90),
    figure: { name: 'Thomas Sankara', years: '1949 to 1987' },
    source: { author: 'Thomas Sankara, National Council of the Revolution', work: 'Political Orientation Speech', year: 1983 },
    tagline: 'Homeland or death, we shall overcome!',
    desc: 'The founding document of the 1983 revolution in Upper Volta, later Burkina Faso. It says independence changed only the form of foreign domination, and calls the revolution democratic and popular, directed against imperialism, the local bourgeoisie tied to it and the old chiefly order. Power is to be exercised through Committees for the Defence of the Revolution in every village and workplace, with an army that also takes part in production. It aims at an independent, self sufficient, planned economy, and holds that the revolution cannot succeed without the emancipation of women.',
    symbol: 'star', wiki: 'Thomas Sankara'
  },
  {
    id: 'bukharinism', name: 'Bukharinism (Right Opposition)', family: 'Radical Left',
    coords: coords(60, 75, 80, 85, 85, 50, 45, 35, 25, 20, 0, 55, 75),
    figure: { name: 'Nikolai Bukharin', years: '1888 to 1938' },
    source: { author: 'Nikolai Bukharin', work: 'Notes of an Economist', year: 1928 },
    tagline: 'Socialism built gradually, in alliance with the peasantry.',
    desc: 'Published in Pravda as Stalin turned towards forced industrialisation. Bukharin argues that industry and agriculture must grow in balance, that planning targets cannot exceed the materials actually available, and that squeezing the peasantry to pay for heavy industry would break the alliance of workers and peasants on which Soviet power rested. He defends the mixed economy of the New Economic Policy, with state industry trading with peasant farms through the market, while keeping the rule of the single party. The article was condemned as a right deviation.',
    symbol: 'hammerSickle', wiki: 'Nikolai Bukharin'
  },
  {
    id: 'collectivist-anarchism', name: 'Collectivist Anarchism', family: 'Anarchist',
    coords: coords(55, 95, 0, 0, 0, 10, 25, 15, 45, 45, 0, 55, 35),
    figure: { name: 'Mikhail Bakunin', years: '1814 to 1876' },
    source: { author: 'Mikhail Bakunin', work: 'Statism and Anarchy', year: 1873 },
    tagline: 'No state can free the people, not even a workers\' state.',
    desc: 'Bakunin\'s last major work argues that every state, whatever it calls itself, means the rule of a minority over the mass of the people. A government of workers\' representatives or of socialist experts, as he says the followers of Marx propose, would become a new privileged class. The alternative is a social revolution made by workers and peasants themselves, which destroys the state and builds society from below as a free federation of associations and communes holding land and tools in common.',
    symbol: 'circleA', wiki: 'Mikhail Bakunin'
  },
  {
    id: 'individualist-anarchism', name: 'Individualist Anarchism', family: 'Anarchist',
    coords: coords(0, 35, 0, 0, 0, 5, 30, 20, 40, 45, 5, 15, 15),
    figure: { name: 'Benjamin Tucker', years: '1854 to 1939' },
    source: { author: 'Benjamin R. Tucker', work: 'State Socialism and Anarchism: How Far They Agree, and Wherein They Differ', year: 1888 },
    tagline: 'Liberty and free competition as the cure for monopoly.',
    desc: 'Tucker agrees with the state socialists that labour should receive its full product, but rejects their remedy of authority. Following Josiah Warren and Proudhon, he argues that interest, rent and profit exist only because the state upholds four monopolies: money, land, tariffs and patents. Abolish these and open everything, including banking and defence, to free competition, and prices would fall to the cost of labour. Land titles would rest on personal occupancy and use, and every association would be voluntary.',
    symbol: 'circleA', wiki: 'Benjamin Tucker'
  },
  {
    id: 'insurrectionary-anarchism', name: 'Insurrectionary Anarchism', family: 'Anarchist',
    coords: coords(60, 95, 0, 0, 0, 0, 20, 5, 55, 50, 0, 75, 35),
    figure: { name: 'Alfredo M. Bonanno', years: '1937 to 2023' },
    source: { author: 'Alfredo M. Bonanno', work: 'Armed Joy', year: 1977 },
    tagline: 'Attack now, in small informal groups, without waiting for the right moment.',
    desc: 'Bonanno argues that revolutionaries have absorbed the values of the system they oppose: work, sacrifice, productivity and organisation as ends in themselves. He rejects waiting for conditions to ripen and rejects formal bodies, including unions, parties and armed vanguard groups, in favour of small groups based on affinity that act directly and at once. Revolt is to be an act of play and joy that destroys work and the commodity, not the self managed running of the same production. An Italian court sentenced him to prison for the book.',
    symbol: 'circleA', wiki: 'Alfredo M. Bonanno'
  },
  {
    id: 'platformism', name: 'Platformism', family: 'Anarchist',
    coords: coords(75, 100, 10, 5, 25, 0, 20, 15, 35, 45, 5, 55, 40),
    figure: { name: 'Nestor Makhno', years: '1888 to 1934' },
    source: { author: 'Dielo Truda group (Nestor Makhno, Peter Arshinov, Ida Mett and others)', work: 'Organisational Platform of the General Union of Anarchists (Draft)', year: 1926 },
    tagline: 'Anarchist communism with a disciplined organisation of its own.',
    desc: 'Written in Paris by exiles from the Russian and Ukrainian revolutions, who blamed the defeat of anarchism there on its lack of organisation. The Platform calls for a general union of anarchists built on theoretical unity, tactical unity, collective responsibility and federalism, with an executive committee to coordinate it. It keeps the anarchist communist goal, rejects any transitional state, and wants production run by workers\' and peasants\' own bodies, while accepting an armed force with a common command to defend the revolution.',
    symbol: 'circleA', wiki: 'Nestor Makhno'
  },
  {
    id: 'anarcha-feminism', name: 'Anarcha Feminism', family: 'Anarchist',
    coords: coords(65, 95, 0, 0, 0, 0, 10, 0, 40, 50, 0, 35, 35),
    figure: { name: 'Emma Goldman', years: '1869 to 1940' },
    source: { author: 'Emma Goldman', work: 'Anarchism and Other Essays', year: 1910 },
    tagline: 'No emancipation of women without the end of state, church and marriage as institutions.',
    desc: 'Goldman defines anarchism as freedom from the rule of property, government and religion alike, and applies it to the position of women. She argues that the vote and access to professions will not free women while they remain bound by the state, the church, conventional morality and economic dependence. Marriage is treated as an economic arrangement opposed to love, and prostitution as a product of the same system. Emancipation must begin with a woman\'s control over her own body and inner life. The essays also attack patriotism, prisons and puritanism.',
    symbol: 'circleA', wiki: 'Emma Goldman'
  },
  {
    id: 'philosophical-anarchism', name: 'Philosophical Anarchism', family: 'Anarchist',
    coords: coords(40, 65, 0, 5, 0, 0, 25, 10, 20, 45, 10, 5, 25),
    figure: { name: 'William Godwin', years: '1756 to 1836' },
    source: { author: 'William Godwin', work: 'An Enquiry Concerning Political Justice', year: 1793 },
    tagline: 'Government will wither as reason grows.',
    desc: 'Godwin holds that human beings can improve without limit through reason, and that each person must act on private judgment and not on command. Government, which arose from injustice, now keeps war, despotism and inequality in place and holds that progress back. He expects political institutions to dissolve gradually as opinion becomes more rational, leaving small communities that settle matters by discussion. Change is to come through enquiry and argument, and he rejects violent revolution.',
    symbol: 'circleA', wiki: 'William Godwin'
  },
  {
    id: 'post-left-anarchism', name: 'Post Left Anarchism', family: 'Anarchist',
    coords: coords(45, 70, 0, 5, 0, 0, 25, 5, 65, 65, 5, 30, 30),
    figure: { name: 'Bob Black', years: 'born 1951' },
    source: { author: 'Bob Black', work: 'The Abolition of Work (1985) and Anarchy after Leftism', year: 1997 },
    tagline: 'Anarchy without the Left, without ideology and without work.',
    desc: 'The earlier essay argues that work, defined as compulsory production, is the source of most misery and should be abolished in favour of free and playful activity. Anarchy after Leftism is a reply to Murray Bookchin, who had attacked what he called lifestyle anarchism. Black argues that Bookchin\'s programme of municipal assemblies and majority rule is a form of government, and that anarchism should cut its ties to the Left, with its organisations, its moralism and its respect for labour and industry, and begin from individual autonomy.',
    symbol: 'circleA', wiki: 'Bob Black (anarchist)'
  },
  {
    id: 'black-anarchism', name: 'Black Anarchism', family: 'Anarchist',
    coords: coords(65, 95, 5, 0, 5, 25, 5, 15, 40, 50, 10, 55, 45),
    figure: { name: 'Lorenzo Kom\'boa Ervin', years: 'born 1947' },
    source: { author: 'Lorenzo Kom\'boa Ervin', work: 'Anarchism and the Black Revolution', year: 1979 },
    tagline: 'Black self determination without a state or a vanguard party.',
    desc: 'Written in prison by a former Black Panther. Ervin argues that Black liberation in the United States cannot come through Black politicians or through a Leninist vanguard party, which he says ends in a new dictatorship. He proposes self governing Black communes with community control of housing, schools and policing, cooperatives and mutual aid programmes, rent and tax strikes, and armed self defence, all linked by federation with recallable delegates. He also criticises the anarchist movement as overwhelmingly white and slow to confront racism.',
    symbol: 'circleA', wiki: 'Lorenzo Kom\'boa Ervin'
  },
  {
    id: 'magonism', name: 'Magonism', family: 'Anarchist',
    coords: coords(65, 100, 0, 0, 5, 10, 25, 20, 45, 60, 0, 70, 40),
    figure: { name: 'Ricardo Flores Magón', years: '1874 to 1922' },
    source: { author: 'Ricardo Flores Magón and the Organising Junta of the Mexican Liberal Party', work: 'Manifesto of 23 September 1911', year: 1911 },
    tagline: 'Land and Liberty!',
    desc: 'Issued from exile in Los Angeles during the Mexican Revolution. The manifesto declares private property the root of the whole social order and calls on the people not to wait for any new government but to expropriate at once: land, houses, machinery and transport are to be taken and held for common use by those who work them. It names capital, authority and the church as the three enemies, and treats the armed rising then under way as the moment to act.',
    symbol: 'circleA', wiki: 'Ricardo Flores Magón'
  },
  {
    id: 'communization', name: 'Communization Theory', family: 'Autonomist',
    coords: coords(65, 100, 5, 15, 5, 0, 20, 10, 45, 45, 0, 55, 35),
    figure: { name: 'Gilles Dauvé', years: 'born 1947' },
    source: { author: 'Gilles Dauvé (as Jean Barrot) and François Martin', work: 'Eclipse and Re-emergence of the Communist Movement', year: 1974 },
    tagline: 'Communism as the immediate act of revolution, not a stage that follows it.',
    desc: 'Coming out of the French ultra left after May 1968, Dauvé argues that communism is not a programme to be applied after workers take power. A revolution is communist only if it begins at once to abolish wage labour, money, exchange and the state, and with them the working class as a class. On this view, workers managing their own factories would only be managing capital. He is therefore wary of parties, unions and councils alike when they are treated as forms that could guarantee the outcome.',
    wiki: 'Gilles Dauvé'
  },
  {
    id: 'indigenous-resurgence', name: 'Indigenous Resurgence', family: 'Autonomist',
    coords: coords(45, 75, 15, 10, 0, 60, 10, 75, 65, 85, 60, 25, 60),
    figure: { name: 'Taiaiake Alfred', years: 'born 1964' },
    source: { author: 'Taiaiake Alfred', work: 'Peace, Power, Righteousness: An Indigenous Manifesto', year: 1999 },
    tagline: 'Self government on indigenous terms, drawn from tradition and not from the state.',
    desc: 'Alfred, a Kanien\'kehá:ka (Mohawk) scholar, argues that Native communities in North America will not recover by winning a share of state power. Band councils and self government agreements, in his account, draw leaders into the colonial system, and even sovereignty is a European idea that does not fit indigenous political thought. He calls for a return to traditional values and teachings, leadership that is accountable and works by consensus, and a new generation committed to defending nationhood and the land.',
    symbol: 'tree', wiki: 'Taiaiake Alfred'
  },
  {
    id: 'inclusive-democracy', name: 'Inclusive Democracy', family: 'Autonomist',
    coords: coords(75, 95, 10, 0, 5, 5, 15, 15, 45, 75, 5, 20, 45),
    figure: { name: 'Takis Fotopoulos', years: 'born 1940' },
    source: { author: 'Takis Fotopoulos', work: 'Towards an Inclusive Democracy', year: 1997 },
    tagline: 'Direct democracy extended to politics, the economy, society and nature.',
    desc: 'Fotopoulos traces the present crisis to the concentration of power produced by the market economy and by representative government, and holds that neither social democracy nor state socialism can reverse it. He proposes direct democracy in four fields at once: political, economic, social and ecological. Citizens\' assemblies, joined in confederations, would own productive resources and decide how to allocate them, in an economy without a state, money or a market.',
    symbol: 'nodes', wiki: 'Takis Fotopoulos'
  },
  {
    id: 'democratic-socialism', name: 'Democratic Socialism', family: 'Left',
    coords: coords(70, 75, 30, 5, 65, 35, 30, 25, 30, 35, 15, 35, 50),
    figure: { name: 'Aneurin Bevan', years: '1897 to 1960' },
    source: { author: 'Aneurin Bevan', work: 'In Place of Fear', year: 1952 },
    tagline: 'Public ownership of the main levers of the economy, won and kept through parliament.',
    desc: 'Bevan saw modern politics as a contest between poverty, property and democracy, and held that an elected parliament is the tool by which the many can bring private economic power under public control. The dominant sectors of the economy should be publicly owned and planned, with a smaller private sector left around them. Services such as health care should be provided collectively and free at the point of need, as the National Health Service he founded was. He rejected both unregulated capitalism and one party communism.',
    symbol: 'torch', wiki: 'Aneurin Bevan'
  },
  {
    id: 'fabianism', name: 'Fabianism', family: 'Left',
    coords: coords(70, 70, 45, 20, 75, 45, 45, 35, 25, 35, 20, 40, 50),
    figure: { name: 'Sidney Webb', years: '1859 to 1947' },
    source: { author: 'George Bernard Shaw (editor), Sidney Webb and five other Fabian essayists', work: 'Fabian Essays in Socialism', year: 1889 },
    tagline: 'Socialism by gradual, constitutional steps, guided by research and administration.',
    desc: 'The seven essayists argued that socialism would not arrive through a sudden uprising but was already growing out of democracy, piece by piece, as councils and the state took over gas, water, transport and other services. The rent of land and the interest on capital should pass step by step to the community through taxation and municipal and national ownership. Change is to be won by permeating existing parties and institutions with well researched proposals, and carried out by trained public administrators.',
    wiki: 'Sidney Webb, 1st Baron Passfield'
  },
  {
    id: 'guild-socialism', name: 'Guild Socialism', family: 'Left',
    coords: coords(60, 90, 20, 5, 25, 30, 30, 30, 45, 40, 15, 25, 45),
    figure: { name: 'G. D. H. Cole', years: '1889 to 1959' },
    source: { author: 'G. D. H. Cole', work: 'Guild Socialism Restated', year: 1920 },
    tagline: 'Industry owned in common and run by self governing guilds of its workers.',
    desc: 'Cole held that a person cannot be represented in general, only for a particular purpose, so a single all purpose parliament cannot be truly democratic. Each industry should be owned by the community but run by a guild of everyone who works in it, with elected managers. Consumers are represented separately through cooperative and civic councils, and guilds and councils meet in communes at local, regional and national level. He opposed both private capitalism and state socialism run by officials.',
    symbol: 'gear', wiki: 'G. D. H. Cole'
  },
  {
    id: 'christian-socialism', name: 'Christian Socialism', family: 'Left',
    coords: coords(50, 65, 40, 35, 30, 40, 45, 65, 50, 50, 90, 15, 45),
    figure: { name: 'F. D. Maurice', years: '1805 to 1872' },
    source: { author: 'F. D. Maurice, with John Ludlow and Charles Kingsley', work: 'Tracts on Christian Socialism', year: 1850 },
    tagline: 'Cooperation, not competition, as the Christian law of social life.',
    desc: 'Founded in England after the failure of Chartism in 1848. Maurice argued that people are already members of one family under God, so competition is not a law of nature but a denial of the true order of society. The practical remedy was associations of working men who own their workshops and share the proceeds, together with education for workers. He wanted to make socialists Christian and Christians socialist, and he distrusted both political agitation and class conflict.',
    symbol: 'cross', wiki: 'F. D. Maurice'
  },
  {
    id: 'ethical-socialism', name: 'Ethical Socialism', family: 'Left',
    coords: coords(60, 60, 25, 5, 50, 30, 30, 40, 40, 45, 45, 25, 45),
    figure: { name: 'R. H. Tawney', years: '1880 to 1962' },
    source: { author: 'R. H. Tawney', work: 'The Acquisitive Society (1920) and Equality', year: 1931 },
    tagline: 'Socialism as a moral case for equality and fellowship.',
    desc: 'Tawney grounded socialism in morality instead of economic laws. A society organised around the right to acquire wealth without limit loses any common purpose, so property and industry should be judged by the function they serve for the community. Equality does not mean treating everyone identically but removing the class privileges that divide people, through shared provision of education and health, progressive taxation and a voice for workers in industry. His argument drew on his Christian belief in the equal worth of every person.',
    symbol: 'scales', wiki: 'R. H. Tawney'
  },
  {
    id: 'liberal-socialism', name: 'Liberal Socialism', family: 'Left',
    coords: coords(45, 50, 10, 5, 35, 25, 25, 20, 35, 45, 10, 40, 30),
    figure: { name: 'Carlo Rosselli', years: '1899 to 1937' },
    source: { author: 'Carlo Rosselli', work: 'Liberal Socialism (Socialismo liberale)', year: 1930 },
    tagline: 'Socialism as liberty carried through to the lives of the poor.',
    desc: 'Written while Rosselli was confined on the island of Lipari by the Fascist regime. He argued that socialism is the heir of liberalism, not its enemy: it aims to make freedom real for people who are too poor to use it. Socialists should drop the Marxist belief that history guarantees their victory and treat socialism as a moral choice. The liberal method of free debate, elections and respect for opponents is binding on them, and the economy should mix private, cooperative and public ownership.',
    symbol: 'torch', wiki: 'Carlo Rosselli'
  },
  {
    id: 'lassalleanism', name: 'Lassalleanism', family: 'Left',
    coords: coords(60, 80, 45, 25, 80, 65, 50, 40, 35, 30, 20, 40, 55),
    figure: { name: 'Ferdinand Lassalle', years: '1825 to 1864' },
    source: { author: 'Ferdinand Lassalle', work: 'Open Letter of Reply (Offenes Antwortschreiben)', year: 1863 },
    tagline: 'Universal suffrage and state aid for workers\' own cooperatives.',
    desc: 'The founding document of the first German workers\' party. Lassalle argued that an iron law holds wages at subsistence level, so self help, savings clubs and consumer societies cannot free the working class. Workers must become their own employers in producers\' cooperatives, and only the state has the credit to fund these. The first task is therefore an independent workers\' party that wins universal and equal suffrage. Unlike Marx, he treated the existing national state as an instrument to be won over and used.',
    symbol: 'flag', wiki: 'Ferdinand Lassalle'
  },
  {
    id: 'participatory-economics', name: 'Participatory Economics', family: 'Left',
    coords: coords(85, 100, 15, 0, 10, 10, 20, 15, 40, 55, 5, 20, 45),
    figure: { name: 'Michael Albert', years: 'born 1947' },
    source: { author: 'Michael Albert and Robin Hahnel', work: 'The Political Economy of Participatory Economics', year: 1991 },
    tagline: 'An economy planned from below by councils of workers and consumers.',
    desc: 'A model, often shortened to parecon, that rejects both markets and central planning. Workplaces and neighbourhoods are run by councils in which each person has a say in proportion to how much a decision affects them. Jobs are balanced so that everyone shares both empowering and tedious tasks, and people are paid for effort and sacrifice, not for property, power or output. Councils propose and revise what they will produce and consume over several rounds until the plans fit together.',
    symbol: 'nodes', wiki: 'Michael Albert'
  },
  {
    id: 'marxist-feminism', name: 'Marxist Feminism', family: 'Left',
    coords: coords(90, 100, 45, 35, 65, 0, 20, 0, 25, 25, 0, 50, 40),
    figure: { name: 'Alexandra Kollontai', years: '1872 to 1952' },
    source: { author: 'Alexandra Kollontai', work: 'The Social Basis of the Woman Question', year: 1909 },
    tagline: 'Women\'s liberation through the liberation of labour.',
    desc: 'Kollontai argued that there is no single woman question shared by all women, because women are divided by class as men are. Equal legal rights within capitalism would mainly benefit women of the propertied classes, so working women should organise with working men and not with liberal feminists. Real freedom requires economic independence and a society that takes over housework and the care of children as public tasks. Marriage would then rest on affection alone and not on property or dependence.',
    symbol: 'star', wiki: 'Alexandra Kollontai'
  },
  {
    id: 'black-feminism', name: 'Black Feminism', family: 'Left',
    coords: coords(70, 80, 15, 5, 15, 10, 0, 0, 45, 50, 10, 25, 40),
    figure: { name: 'Barbara Smith', years: 'born 1946' },
    source: { author: 'Combahee River Collective (Demita Frazier, Beverly Smith and Barbara Smith)', work: 'The Combahee River Collective Statement', year: 1977 },
    tagline: 'Race, sex, sexuality and class oppression interlock and must be fought together.',
    desc: 'Written by a collective of Black lesbian socialists in Boston. They held that racial, sexual, heterosexual and class oppression operate at the same time in Black women\'s lives and cannot be separated or ranked. The most radical politics therefore grows out of a group\'s own identity and experience, an approach the statement named identity politics. Because Black women sit at the bottom of several hierarchies, their freedom would require dismantling all of them. The authors called themselves socialists, rejected separatism, and committed to working without internal hierarchy.',
    wiki: 'Barbara Smith'
  },
  {
    id: 'nkrumaism', name: 'Nkrumaism', family: 'Left',
    coords: coords(85, 85, 70, 80, 90, 60, 50, 40, 20, 25, 20, 60, 80),
    figure: { name: 'Kwame Nkrumah', years: '1909 to 1972' },
    source: { author: 'Kwame Nkrumah', work: 'Africa Must Unite (1963) and Consciencism', year: 1964 },
    tagline: 'A united socialist Africa under one continental government.',
    desc: 'Nkrumah argued that the new African states were too small and too dependent to be truly free, and that political independence without economic control leaves a country open to foreign domination. He called for a single union government for the continent with common planning, currency and defence. Consciencism is his philosophy for this project: a materialist socialism meant to reconcile traditional African, Islamic and Euro Christian influences on the basis of the egalitarian values of traditional society. In Ghana it was applied through state led industrialisation and one party rule.',
    symbol: 'star', wiki: 'Kwame Nkrumah'
  },
  {
    id: 'labour-zionism', name: 'Labour Zionism', family: 'Left',
    coords: coords(75, 90, 40, 20, 50, 80, 60, 20, 30, 30, 5, 50, 70),
    figure: { name: 'Ber Borochov', years: '1881 to 1917' },
    source: { author: 'Ber Borochov', work: 'The National Question and the Class Struggle (1905) and Our Platform', year: 1906 },
    tagline: 'A Jewish homeland built by Jewish workers as the ground for socialism.',
    desc: 'Borochov set out to reconcile Marxism with Zionism. He argued that a nation without a territory of its own has an abnormal economy: Jews in the diaspora were shut out of farming and basic industry and crowded into marginal trades, so Jewish workers had no firm ground on which to wage a class struggle. Migration to Palestine would arise from economic pressure and would create a Jewish working class on its own land. That working class, not private investors or diplomats, would build the country and then carry it to socialism.',
    symbol: 'hexagram', wiki: 'Ber Borochov'
  },
  {
    id: 'cooperativism', name: 'Cooperativism', family: 'Left',
    coords: coords(25, 75, 20, 10, 15, 25, 35, 45, 45, 45, 50, 5, 30),
    figure: { name: 'William King', years: '1786 to 1865' },
    source: { author: 'William King', work: 'The Co-operator', year: '1828 to 1830' },
    tagline: 'Working people pooling small savings to become their own employers.',
    desc: 'In a monthly paper published in Brighton, King gave the early cooperative movement a practical method. Labour is the source of wealth, yet workers stay poor because they work for others who own the capital. If members pay a small weekly sum and buy their goods from a shop they own together, the profit builds a common capital, which can then employ members and in time buy land. King, a physician and committed Christian, asked for no help from the state and no confrontation with the rich. The method needs only knowledge, trust and voluntary union.',
    wiki: 'William King (physician)'
  },
  {
    id: 'fanonism', name: 'Fanonism', family: 'Left',
    coords: coords(75, 85, 40, 30, 30, 55, 30, 20, 35, 30, 5, 90, 60),
    figure: { name: 'Frantz Fanon', years: '1925 to 1961' },
    source: { author: 'Frantz Fanon', work: 'The Wretched of the Earth', year: 1961 },
    tagline: 'Decolonisation as the remaking of a people through their own struggle.',
    desc: 'Written during the Algerian war. Fanon argued that colonial rule is founded on violence and divides the world into two, so it can only be ended by the armed struggle of the colonised, which also frees them from the sense of inferiority that colonialism instils. He looked to the peasantry and the urban poor as the revolutionary force. He warned that after independence a national middle class would step into the settlers\' place unless national consciousness grew into social and political consciousness, with power spread out among the people.',
    wiki: 'Frantz Fanon'
  },
  {
    id: 'new-left', name: 'New Left', family: 'Left',
    coords: coords(65, 80, 5, 5, 25, 5, 15, 0, 60, 55, 0, 25, 40),
    figure: { name: 'Herbert Marcuse', years: '1898 to 1979' },
    source: { author: 'Herbert Marcuse', work: 'One-Dimensional Man', year: 1964 },
    tagline: 'A refusal of the comfortable unfreedom of affluent industrial society.',
    desc: 'Marcuse argued that advanced industrial society, capitalist and Soviet alike, controls people less by force than by satisfying needs that it has itself created. Consumer goods, mass media and technical rationality absorb opposition, so the organised working class no longer acts as a force for change and thought loses its critical dimension. Hope lies in a refusal of the whole system, which he expected to come from outsiders and the excluded. The book became a central text for the student movements of the 1960s.',
    wiki: 'Herbert Marcuse'
  },
  {
    id: 'radical-democracy', name: 'Radical Democracy', family: 'Left',
    coords: coords(55, 55, 10, 0, 35, 15, 5, 5, 40, 50, 5, 25, 40),
    figure: { name: 'Ernesto Laclau', years: '1935 to 2014' },
    source: { author: 'Ernesto Laclau and Chantal Mouffe', work: 'Hegemony and Socialist Strategy', year: 1985 },
    tagline: 'Deepen liberal democracy by linking many struggles for equality.',
    desc: 'A post Marxist argument that the working class has no built in role as the agent of history. Feminist, anti racist, ecological, peace and labour movements are each struggles in their own right, and none is merely an effect of the economy. The task of the left is to link them into a common front without dissolving their differences. The aim is not to overthrow liberal democracy but to extend its principles of liberty and equality into more areas of social life. Conflict is treated as a permanent feature of politics.',
    wiki: 'Ernesto Laclau'
  },
  {
    id: 'degrowth', name: 'Degrowth', family: 'Green',
    coords: coords(55, 55, 25, 10, 10, 20, 25, 40, 80, 85, 10, 10, 80),
    figure: { name: 'Serge Latouche', years: 'born 1940' },
    source: { author: 'Serge Latouche', work: 'Farewell to Growth (Petit traité de la décroissance sereine)', year: 2007 },
    tagline: 'Leave the growth society and live better with less.',
    desc: 'Latouche argued that endless economic growth is impossible on a finite planet and that sustainable development is a contradiction in terms. Rich societies should deliberately shrink production and consumption and free their imagination from the idea that more is always better. He set out a programme of eight linked changes: re-evaluate, reconceptualise, restructure, redistribute, relocalise, reduce, re-use and recycle. In practice this means local economies, shorter working hours and a smaller ecological footprint.',
    wiki: 'Serge Latouche'
  },
  {
    id: 'ecomodernism', name: 'Ecomodernism', family: 'Green',
    coords: coords(35, 30, 25, 15, 55, 20, 25, 20, 5, 45, 5, 30, 25),
    figure: { name: 'Ted Nordhaus', years: 'born 1965' },
    source: { author: 'Ted Nordhaus, Michael Shellenberger and sixteen co-authors', work: 'An Ecomodernist Manifesto', year: 2015 },
    tagline: 'Use technology to decouple human wellbeing from damage to nature.',
    desc: 'The manifesto argues that humanity should shrink its impact on the environment by intensifying its activity, not by trying to live in harmony with nature. Cities, intensive farming, desalination and dense energy sources such as nuclear power let people use less land and fewer resources, which leaves more room for wild nature. It rejects the view that growth must stop and holds that modernisation is what lifts people out of poverty. Public investment in clean energy technology is preferred to limits on consumption.',
    wiki: 'Ted Nordhaus'
  },
  {
    id: 'ecofeminism', name: 'Ecofeminism', family: 'Green',
    coords: coords(65, 80, 10, 0, 10, 0, 15, 0, 70, 85, 0, 15, 40),
    figure: { name: 'Françoise d\'Eaubonne', years: '1920 to 2005' },
    source: { author: 'Françoise d\'Eaubonne', work: 'Feminism or Death (Le Féminisme ou la mort)', year: 1974 },
    tagline: 'The domination of women and the destruction of nature share one root.',
    desc: 'The book that coined the word ecofeminism. D\'Eaubonne argued that male control over women\'s fertility and over the fertility of the soil stands behind both overpopulation and the exhaustion of resources, in capitalist and socialist countries alike. Women therefore have a direct interest in ending the drive for ever more production. She called for women to take control of their own bodies and for power to be dissolved, not handed from one sex to the other, in a society organised around the preservation of life.',
    wiki: 'Françoise d\'Eaubonne'
  },
  {
    id: 'bioregionalism', name: 'Bioregionalism', family: 'Green',
    coords: coords(45, 60, 25, 25, 0, 30, 40, 55, 85, 90, 35, 10, 90),
    figure: { name: 'Kirkpatrick Sale', years: 'born 1937' },
    source: { author: 'Kirkpatrick Sale', work: 'Dwellers in the Land: The Bioregional Vision', year: 1985 },
    tagline: 'Political and economic life rescaled to fit natural regions.',
    desc: 'Sale argued that the ecological crisis comes from living at too large a scale, cut off from the places that sustain us. People should come to know the land they inhabit and organise society around bioregions, areas defined by watersheds, soils and living communities and not by political borders. Each region should aim at self sufficiency, with a conserving economy and decisions made in small communities. He expected regions to differ in their political forms, since diversity among them is itself a natural principle.',
    symbol: 'tree', wiki: 'Kirkpatrick Sale'
  },
  {
    id: 'animal-liberation', name: 'Animal Liberation', family: 'Green',
    coords: coords(45, 40, 25, 10, 50, 5, 25, 5, 45, 70, 0, 5, 35),
    figure: { name: 'Peter Singer', years: 'born 1946' },
    source: { author: 'Peter Singer', work: 'Animal Liberation', year: 1975 },
    tagline: 'Equal consideration for the interests of every being that can suffer.',
    desc: 'Singer argued that the capacity to suffer, not membership of a species, is what entitles a being to moral consideration. Giving less weight to an animal\'s pain simply because it is not human is speciesism, a prejudice he compared to racism and sexism. On this basis he condemned factory farming and most experiments on animals, and urged readers to stop eating meat. His case rests on utilitarian reasoning about interests, not on a theory of rights, and it relies on persuasion and boycott.',
    wiki: 'Peter Singer'
  },
  {
    id: 'land-ethic-conservationism', name: 'Conservationism (Land Ethic)', family: 'Green',
    coords: coords(40, 35, 35, 20, 25, 40, 45, 60, 70, 90, 25, 20, 50),
    figure: { name: 'Aldo Leopold', years: '1887 to 1948' },
    source: { author: 'Aldo Leopold', work: 'A Sand County Almanac', year: 1949 },
    tagline: 'Humans as plain members of the land community, not its conquerors.',
    desc: 'Published a year after Leopold\'s death. Its closing essay proposes a land ethic that widens the boundary of the moral community to include soils, waters, plants and animals. An action is right when it tends to preserve the integrity, stability and beauty of that community, and wrong when it tends otherwise. Conservation based only on economic self interest fails, because most members of the land community have no market value. Leopold placed the main duty on private landowners and on an ecological conscience, not on government alone.',
    symbol: 'tree', wiki: 'Aldo Leopold'
  },
  {
    id: 'steady-state-economics', name: 'Steady State Economics', family: 'Green',
    coords: coords(50, 35, 50, 20, 65, 35, 40, 45, 75, 80, 30, 15, 70),
    figure: { name: 'Herman Daly', years: '1938 to 2022' },
    source: { author: 'Herman Daly', work: 'Steady-State Economics', year: 1977 },
    tagline: 'A constant population and stock of goods, kept within the limits of the biosphere.',
    desc: 'Daly treated the economy as a subsystem of a finite biosphere and argued that it cannot grow for ever. The goal should be a constant population and a constant stock of physical goods, maintained with the lowest possible flow of energy and materials. He proposed three institutions: government auctions of quotas that cap resource extraction, transferable licences that stabilise births, and minimum and maximum limits on income and wealth. Within those limits, markets and private property still allocate resources. Development then means better, not more.',
    symbol: 'scales', wiki: 'Herman Daly'
  },
  {
    id: 'green-conservatism', name: 'Green Conservatism', family: 'Green',
    coords: coords(25, 20, 35, 20, 15, 70, 60, 80, 55, 65, 45, 35, 50),
    figure: { name: 'Roger Scruton', years: '1944 to 2020' },
    source: { author: 'Roger Scruton', work: 'Green Philosophy: How to Think Seriously About the Planet', year: 2012 },
    tagline: 'Care for the environment grows from love of home.',
    desc: 'Scruton argued that environmental problems arise when people can pass the costs of their actions on to others and to future generations, and that conservatism, as the politics of stewardship and inheritance, is well placed to answer them. The motive that makes people accept sacrifices is love of home, an attachment to a place shared by the dead, the living and the unborn. He therefore favoured local associations, civic initiative, legal liability and the nation state over international treaties, large campaigning organisations and central regulation.',
    symbol: 'tree', wiki: 'Roger Scruton'
  },
  {
    id: 'lockean-liberalism', name: 'Lockean Liberalism', family: 'Liberal',
    coords: coords(20, 10, 15, 30, 35, 40, 50, 55, 40, 30, 60, 45, 20),
    figure: { name: 'John Locke', years: '1632 to 1704' },
    source: { author: 'John Locke', work: 'Two Treatises of Government', year: 1689 },
    tagline: 'Government rests on the consent of the governed and exists to protect life, liberty and property.',
    desc: 'Locke begins from a state of nature in which people are free and equal under a natural law given by God. A person comes to own what they mix their labour with. People agree to form a government only to protect their lives, liberties and estates better than they could alone, so its power is held in trust. A ruler who breaks that trust may rightfully be resisted and replaced by the people.',
    symbol: 'scales', wiki: 'John Locke'
  },
  {
    id: 'benthamite-utilitarianism', name: 'Benthamite Utilitarianism', family: 'Liberal',
    coords: coords(30, 25, 30, 30, 60, 25, 40, 10, 25, 45, 0, 30, 8),
    figure: { name: 'Jeremy Bentham', years: '1748 to 1832' },
    source: { author: 'Jeremy Bentham', work: 'An Introduction to the Principles of Morals and Legislation', year: 1789 },
    tagline: 'Laws are to be judged only by the happiness and suffering they produce.',
    desc: 'Bentham holds that pleasure and pain are the only real measures of right and wrong, and that a law is good to the extent that it adds to the total happiness of those it affects. Appeals to custom, natural law or moral sentiment are dismissed as disguised personal preference. Punishment is itself a harm, justified only where it prevents a greater one. In a well known note he adds that the capacity to suffer, not the capacity to reason, is what makes a creature matter.',
    symbol: 'scales', wiki: 'Jeremy Bentham'
  },
  {
    id: 'kantian-republicanism', name: 'Kantian Republicanism', family: 'Liberal',
    coords: coords(30, 25, 15, 30, 30, 10, 35, 40, 40, 40, 30, 5, 15),
    figure: { name: 'Immanuel Kant', years: '1724 to 1804' },
    source: { author: 'Immanuel Kant', work: 'Perpetual Peace: A Philosophical Sketch', year: 1795 },
    tagline: 'Republics joined in a federation of free states can end war.',
    desc: 'Kant sets out the articles of a lasting peace. Every state should have a republican constitution, meaning representative government under law with the executive separated from the legislature, which he distinguishes from direct democracy. States should join a federation of free states, not a single world state, and standing armies should in time be abolished. Every person has a cosmopolitan right to visit foreign lands without being treated as an enemy.',
    wiki: 'Immanuel Kant'
  },
  {
    id: 'civic-republicanism', name: 'Civic Republicanism', family: 'Liberal',
    coords: coords(45, 35, 30, 10, 30, 30, 15, 25, 40, 55, 10, 30, 40),
    figure: { name: 'Philip Pettit', years: 'born 1945' },
    source: { author: 'Philip Pettit', work: 'Republicanism: A Theory of Freedom and Government', year: 1997 },
    tagline: 'Freedom is not being left alone but having no master.',
    desc: 'Pettit revives the Roman and early modern republican idea that a person is free when nobody holds the power to interfere in their life at will. A kindly master still dominates, while a fair law that tracks the interests of those it binds does not. The state should therefore reduce private domination at work, at home and in the market, and must itself be checked by dispersed power and by citizens able to contest every decision.',
    symbol: 'column', wiki: 'Philip Pettit'
  },
  {
    id: 'painite-radicalism', name: 'Radicalism', family: 'Liberal',
    coords: coords(30, 25, 10, 0, 35, 25, 35, 5, 25, 30, 20, 35, 10),
    figure: { name: 'Thomas Paine', years: '1737 to 1809' },
    source: { author: 'Thomas Paine', work: 'Rights of Man (two parts, 1791 and 1792)', year: 1792 },
    tagline: 'Every generation has the right to govern itself.',
    desc: 'Written to answer Burke, the first part argues that rights belong to every person by nature and that no generation can bind those who come after it, so hereditary monarchy and aristocracy have no claim to rule. Government is legitimate only as a representative republic founded on a written constitution. The second part proposes cutting military and court spending and using a progressive tax on estates to fund poor relief, schooling for children and pensions for the old.',
    symbol: 'torch', wiki: 'Thomas Paine'
  },
  {
    id: 'new-liberalism', name: 'New Liberalism', family: 'Liberal',
    coords: coords(50, 40, 25, 10, 50, 25, 30, 25, 35, 40, 20, 20, 15),
    figure: { name: 'Leonard Hobhouse', years: '1864 to 1929' },
    source: { author: 'L. T. Hobhouse', work: 'Liberalism', year: 1911 },
    tagline: 'Liberty without equality is a name of noble sound and squalid result.',
    desc: 'Hobhouse argues that the old liberal fight against arbitrary power is incomplete, because a contract between unequal parties is not truly free. Real liberty needs the state to secure the conditions in which each person can develop: a living wage, education and insurance against sickness, unemployment and old age. Much wealth is created by society and not by its holder, so taxing inheritance and unearned gains is just. He presents this as a development of liberalism, distinct from state socialism.',
    wiki: 'Leonard Hobhouse'
  },
  {
    id: 'liberal-internationalism', name: 'Liberal Internationalism', family: 'Liberal',
    coords: coords(25, 25, 40, 20, 55, 20, 45, 50, 40, 40, 45, 40, 10),
    figure: { name: 'Woodrow Wilson', years: '1856 to 1924' },
    source: { author: 'Woodrow Wilson', work: 'Fourteen Points (address to the United States Congress)', year: 1918 },
    tagline: 'Peace through open diplomacy, free trade and a league of nations.',
    desc: 'Wilson\'s programme for ending the First World War set out the conditions of a lasting peace: agreements made in public with no secret treaties, freedom of the seas, the removal of trade barriers and the reduction of armaments. Borders in Europe were to be redrawn along lines of nationality and colonial claims settled with weight given to the peoples concerned. A general association of nations would guarantee the independence of great and small states alike.',
    wiki: 'Woodrow Wilson'
  },
  {
    id: 'capabilities-approach', name: 'Capabilities Approach', family: 'Liberal',
    coords: coords(40, 30, 15, 0, 45, 5, 10, 20, 35, 45, 10, 20, 30),
    figure: { name: 'Amartya Sen', years: 'born 1933' },
    source: { author: 'Amartya Sen', work: 'Development as Freedom', year: 1999 },
    tagline: 'A society succeeds by what its people are actually able to do and to be.',
    desc: 'Sen argues that development should be measured by the real freedoms people have to live lives they value, not by income or output alone. Poverty is a lack of basic capabilities such as health, literacy and a voice in public affairs. Markets matter as part of freedom, but so do public education, health care, a free press and democratic elections, and he observes that famines do not occur in working democracies. The agency of women is treated as central.',
    wiki: 'Amartya Sen'
  },
  {
    id: 'liberal-feminism', name: 'Liberal Feminism', family: 'Liberal',
    coords: coords(30, 25, 15, 10, 45, 35, 40, 15, 35, 35, 40, 25, 35),
    figure: { name: 'Mary Wollstonecraft', years: '1759 to 1797' },
    source: { author: 'Mary Wollstonecraft', work: 'A Vindication of the Rights of Woman', year: 1792 },
    tagline: 'Reason has no sex, so rights and education should have none either.',
    desc: 'Wollstonecraft argues that women appear weaker in mind only because they are denied education and trained to please. Since reason is given by God to both sexes alike, virtue must rest on the same principles for both. She calls for national day schools where girls and boys are taught together, for women to be able to earn their own living in trades and professions, and for them to have a civil existence and a share in government.',
    symbol: 'torch', wiki: 'Mary Wollstonecraft'
  },
  {
    id: 'open-society', name: 'Open Society Liberalism', family: 'Liberal',
    coords: coords(40, 30, 20, 5, 45, 10, 30, 10, 20, 30, 5, 40, 12),
    figure: { name: 'Karl Popper', years: '1902 to 1994' },
    source: { author: 'Karl Popper', work: 'The Open Society and Its Enemies', year: 1945 },
    tagline: 'Reform piece by piece, and keep the power to dismiss your rulers.',
    desc: 'Popper rejects the belief, which he traces through Plato, Hegel and Marx, that history follows laws that reveal a destined ideal society. Attempts to rebuild society whole according to such a blueprint lead to tyranny. An open society accepts that all knowledge is fallible, improves itself by small testable reforms aimed at reducing suffering, and judges democracy by whether rulers can be removed without bloodshed. The state should protect the economically weak, and need not tolerate those who would destroy tolerance by force.',
    wiki: 'Karl Popper'
  },
  {
    id: 'hayekian-liberalism', name: 'Hayekian Liberalism', family: 'Liberal',
    coords: coords(10, 5, 15, 35, 25, 25, 40, 55, 30, 20, 30, 35, 3),
    figure: { name: 'Friedrich Hayek', years: '1899 to 1992' },
    source: { author: 'F. A. Hayek', work: 'The Constitution of Liberty', year: 1960 },
    tagline: 'No mind can plan a society, so freedom under general rules must be left to do the work.',
    desc: 'Hayek defines liberty as the absence of coercion by the arbitrary will of another. Because knowledge is scattered among millions of people, the order of a free society grows from their separate actions and from rules and customs that evolved without design. Government must act only through general laws that apply equally to all, which rules out economic planning and progressive taxation but allows a basic safety net. Majority rule is a method, not a licence, and must itself be bound by law.',
    wiki: 'Friedrich Hayek'
  },
  {
    id: 'public-choice', name: 'Public Choice Constitutionalism', family: 'Liberal',
    coords: coords(15, 10, 20, 20, 15, 35, 45, 35, 40, 30, 10, 35, 8),
    figure: { name: 'James M. Buchanan', years: '1919 to 2013' },
    source: { author: 'James M. Buchanan and Gordon Tullock', work: 'The Calculus of Consent', year: 1962 },
    tagline: 'Voters and officials pursue their own interests, so the rules matter more than the rulers.',
    desc: 'Buchanan and Tullock analyse politics with the tools of economics, treating voters, legislators and officials as individuals who pursue their own ends as they do in markets. Simple majority rule has no special standing: it lets a majority pass costs on to a minority and invites vote trading. Only unanimous agreement fully protects everyone, so the constitution, the stage at which people choose rules without knowing how they will fare under them, should set how large a majority each kind of collective decision needs.',
    wiki: 'James M. Buchanan'
  },
  {
    id: 'european-federalism', name: 'European Federalism', family: 'Liberal',
    coords: coords(60, 55, 30, 30, 70, 0, 30, 15, 30, 35, 5, 45, 25),
    figure: { name: 'Altiero Spinelli', years: '1907 to 1986' },
    source: { author: 'Altiero Spinelli and Ernesto Rossi', work: 'For a Free and United Europe: A Draft Manifesto (the Ventotene Manifesto)', year: 1941 },
    tagline: 'End the sovereign nation state in Europe and build a federation in its place.',
    desc: 'Written by anti fascist prisoners on an Italian island, the manifesto blames the absolute sovereignty of nation states for war and totalitarianism. The real dividing line in politics now runs between those who would restore national states and those who would create a European federation with its own armed force in place of national armies. It couples this with social reform: monopolies and key industries taken into public hands, land and wealth spread more widely, and a secular state.',
    symbol: 'star', wiki: 'Altiero Spinelli'
  },
  {
    id: 'left-libertarianism', name: 'Left Libertarianism', family: 'Libertarian',
    coords: coords(10, 40, 5, 20, 20, 0, 30, 25, 25, 40, 5, 20, 10),
    figure: { name: 'Hillel Steiner', years: 'born 1942' },
    source: { author: 'Hillel Steiner', work: 'An Essay on Rights', year: 1994 },
    tagline: 'You own yourself, but the earth belongs equally to everyone.',
    desc: 'Steiner accepts the libertarian premise that each person fully owns their own body and labour, and that rights must fit together without conflict. Natural resources were made by nobody, however, so every person in the world is entitled to an equal share of their value. Those who hold more than their share owe the difference to a global fund paid out to all. Markets and voluntary exchange govern everything built on that equal starting point.',
    wiki: 'Hillel Steiner'
  },
  {
    id: 'paleolibertarianism', name: 'Paleolibertarianism', family: 'Libertarian',
    coords: coords(0, 0, 15, 30, 5, 40, 65, 85, 30, 15, 70, 15, 15),
    figure: { name: 'Lew Rockwell', years: 'born 1944' },
    source: { author: 'Llewellyn H. Rockwell Jr.', work: 'The Case for Paleo-Libertarianism', year: 1990 },
    tagline: 'Against the state, and for the family, the church and inherited culture.',
    desc: 'Rockwell argues that libertarianism had tied itself to a counterculture hostile to religion, family and bourgeois morals, and that this was both mistaken and off putting to ordinary people. He keeps the full free market and anti state programme but joins it to cultural conservatism. Social authority exercised by families, churches and communities is presented as a natural rival to state power, and Western civilisation and its Judaeo Christian tradition as the ground on which liberty grew.',
    wiki: 'Lew Rockwell'
  },
  {
    id: 'voluntaryism', name: 'Voluntaryism', family: 'Libertarian',
    coords: coords(0, 0, 0, 25, 10, 20, 40, 45, 30, 30, 30, 5, 0),
    figure: { name: 'Auberon Herbert', years: '1838 to 1906' },
    source: { author: 'Auberon Herbert', work: 'The Right and Wrong of Compulsion by the State', year: 1885 },
    tagline: 'A state may defend people against force, but must itself be paid for by choice.',
    desc: 'Herbert holds that each person owns their own mind and body, so nobody, and no majority, may rightfully use force on a person who has used none. The state is justified only in restraining force and fraud. Everything else, including education, poor relief and religion, must be left to free association, and even the state\'s own revenue should come from voluntary payments in place of compulsory taxes. He kept a limited state and did not call himself an anarchist.',
    wiki: 'Auberon Herbert'
  },
  {
    id: 'natural-law-anarchism', name: 'Natural Law Anarchism', family: 'Libertarian',
    coords: coords(5, 10, 0, 20, 0, 10, 30, 20, 35, 30, 25, 25, 15),
    figure: { name: 'Lysander Spooner', years: '1808 to 1887' },
    source: { author: 'Lysander Spooner', work: 'No Treason, No. VI: The Constitution of No Authority', year: 1870 },
    tagline: 'A constitution that nobody signed binds nobody.',
    desc: 'Spooner, a lawyer and abolitionist, applies the ordinary law of contract to the United States Constitution and finds that it fails. Nobody living signed it, and those who made it had no power to bind later generations. Voting and paying taxes do not show consent, because both are done under threat. A government that takes money without individual consent therefore differs from a highwayman only in claiming to act for its victim\'s good.',
    wiki: 'Lysander Spooner'
  },
  {
    id: 'panarchism', name: 'Panarchism', family: 'Libertarian',
    coords: coords(10, 20, 5, 50, 10, 5, 15, 50, 40, 40, 40, 10, 15),
    figure: { name: 'Paul Émile de Puydt', years: '1810 to 1891' },
    source: { author: 'Paul Émile de Puydt', work: 'Panarchy', year: 1860 },
    tagline: 'Choose your government as you choose your church, without moving house.',
    desc: 'De Puydt extends free competition from the economy to government itself. Each person would register with the government they prefer at a local office and could change it later, as they might change a subscription. Monarchies, republics and every other system would exist side by side on the same territory, each ruling only its own members, with disputes between them handled as they are between neighbouring states. Nobody would be forced to live under a system they had not chosen.',
    wiki: 'Paul Émile de Puydt'
  },
  {
    id: 'seasteading', name: 'Seasteading', family: 'Libertarian',
    coords: coords(5, 5, 5, 40, 0, 5, 35, 35, 5, 45, 10, 5, 0),
    figure: { name: 'Patri Friedman', years: 'born 1976' },
    source: { author: 'Joe Quirk with Patri Friedman', work: 'Seasteading: How Floating Nations Will Restore the Environment, Enrich the Poor, Cure the Sick, and Liberate Humanity from Politicians', year: 2017 },
    tagline: 'Build new societies on the ocean and let governments compete for citizens.',
    desc: 'Seasteaders argue that government improves slowly because it is costly to leave one country and impossible to start a new one on land that is already claimed. Floating cities in international waters would lower that barrier. If homes and businesses could detach and move to another platform, governments would have to compete for residents as firms compete for customers, and many small experiments in law could be tried at once. The book also presents ocean settlement as a source of food, clean energy and environmental repair.',
    wiki: 'Patri Friedman'
  },
  {
    id: 'extropianism', name: 'Extropianism', family: 'Technological',
    coords: coords(10, 10, 5, 25, 10, 5, 30, 5, 0, 15, 0, 15, 15),
    figure: { name: 'Max More', years: 'born 1964' },
    source: { author: 'Max More', work: 'The Extropian Principles (1990), revised as Principles of Extropy', year: 2003 },
    tagline: 'No limits on life, intelligence or self transformation.',
    desc: 'More\'s principles, first issued in 1990 and revised several times, set out an early and influential form of transhumanism. They call for perpetual progress, the removal of biological limits such as ageing and death, and the continual improvement of the self through science and technology. Reason is preferred to faith or dogma, and optimism about the future is treated as a practical duty. Politically the principles favour an open society, free exchange, individual self direction and decentralised power, and oppose authoritarian control.',
    symbol: 'hPlus', wiki: 'Max More'
  },
  {
    id: 'singularitarianism', name: 'Singularitarianism', family: 'Technological',
    coords: coords(20, 20, 30, 35, 40, 15, 40, 20, 5, 10, 25, 35, 20),
    figure: { name: 'Ray Kurzweil', years: 'born 1948' },
    source: { author: 'Ray Kurzweil', work: 'The Singularity Is Near', year: 2005 },
    tagline: 'Exponential technology will merge human and machine intelligence within decades.',
    desc: 'Kurzweil argues that information technology improves at an accelerating, exponential rate, and that this will carry genetics, nanotechnology and robotics to a point where machine intelligence exceeds and merges with our own, which he dates to about 2045. Ageing, disease and scarcity could then be overcome, and intelligence would spread outward into the universe. He treats attempts to halt these technologies as futile and harmful, and argues for managing their dangers through defensive technologies and targeted safeguards.',
    symbol: 'bolt', wiki: 'Ray Kurzweil'
  },
  {
    id: 'longtermism', name: 'Longtermism', family: 'Technological',
    coords: coords(40, 35, 40, 20, 55, 0, 25, 15, 65, 60, 10, 15, 30),
    figure: { name: 'William MacAskill', years: 'born 1987' },
    source: { author: 'William MacAskill', work: 'What We Owe the Future', year: 2022 },
    tagline: 'Future people count, and there could be a great many of them.',
    desc: 'MacAskill argues that people who will live in the future matter morally as much as people alive now, that they may vastly outnumber us, and that present choices can shape their lives. Improving the prospects of the long term future should therefore rank among the main moral tasks of the present. In practice this means reducing the risk of human extinction or civilisational collapse from engineered pandemics, misaligned artificial intelligence, great power war and climate change, and avoiding any premature and permanent lock in of a single set of values.',
    wiki: 'William MacAskill'
  },
  {
    id: 'neo-luddism', name: 'Neo Luddism', family: 'Technological',
    coords: coords(55, 60, 35, 15, 10, 25, 30, 55, 100, 85, 45, 5, 45),
    figure: { name: 'Chellis Glendinning', years: 'born 1947' },
    source: { author: 'Chellis Glendinning', work: 'Notes toward a Neo-Luddite Manifesto', year: 1990 },
    tagline: 'No technology is neutral, and some should be taken apart.',
    desc: 'Glendinning takes up the name of the English machine breakers to argue that technologies are not neutral tools: each carries the values and interests of the society that built it. She says neo Luddites are not against technology as such but against kinds that harm life and community. The manifesto calls for dismantling nuclear, chemical, genetic engineering, television, electromagnetic and computer technologies, and for creating tools on a community scale, such as local renewable energy, that those who use them can understand and control.',
    wiki: 'Chellis Glendinning'
  },
  {
    id: 'cybernetic-socialism', name: 'Cybernetic Socialism', family: 'Technological',
    coords: coords(80, 80, 35, 30, 50, 35, 40, 20, 10, 40, 10, 15, 55),
    figure: { name: 'Stafford Beer', years: '1926 to 2002' },
    source: { author: 'Stafford Beer', work: 'Designing Freedom', year: 1974 },
    tagline: 'Run the economy as a living nervous system, in real time.',
    desc: 'Beer, who designed the Cybersyn network for Salvador Allende\'s government in Chile, argues that inherited institutions fail because they cannot cope with the variety and speed of modern society. Using cybernetics, the science of control and communication, he proposes linking workplaces and government by real time information so that each unit manages itself and passes upward only what it cannot handle. Computers and telecommunications should be redesigned as tools of the people instead of instruments of bureaucracy or profit.',
    symbol: 'nodes', wiki: 'Stafford Beer'
  },
  {
    id: 'free-software-movement', name: 'Free Software Movement', family: 'Technological',
    coords: coords(35, 65, 5, 15, 10, 5, 30, 20, 15, 40, 5, 15, 20),
    figure: { name: 'Richard Stallman', years: 'born 1953' },
    source: { author: 'Richard Stallman', work: 'The GNU Manifesto', year: 1985 },
    tagline: 'Software should be free to use, study, share and change.',
    desc: 'Stallman announces a complete operating system that anyone may copy, modify and pass on, and asks programmers to help build it. He argues that sharing software is a basic act of friendship among programmers, and that owners who forbid copying and hide source code set users against one another and waste effort through duplication. Programmers can still earn a living through support, teaching and custom work. Copies may be changed and redistributed, but nobody may restrict their further redistribution.',
    wiki: 'Richard Stallman'
  },
  {
    id: 'pirate-politics', name: 'Pirate Politics', family: 'Technological',
    coords: coords(25, 45, 0, 5, 20, 10, 30, 15, 10, 40, 5, 20, 25),
    figure: { name: 'Rick Falkvinge', years: 'born 1972' },
    source: { author: 'Christian Engström and Rick Falkvinge', work: 'The Case for Copyright Reform', year: 2012 },
    tagline: 'Free the sharing of culture and protect private communication.',
    desc: 'Falkvinge founded the Swedish Pirate Party in 2006, and this book sets out its case. Copyright can no longer be enforced against file sharing without monitoring everyone\'s private communication, so the choice is between that monopoly and basic civil liberties. The authors propose making all non commercial copying and sharing legal, cutting the commercial term to twenty years from publication, requiring registration after five years, allowing remixes and banning digital locks on legal uses.',
    symbol: 'flag', wiki: 'Rick Falkvinge'
  },
  {
    id: 'futarchy', name: 'Futarchy', family: 'Technological',
    coords: coords(15, 15, 30, 25, 50, 40, 45, 40, 15, 25, 10, 35, 30),
    figure: { name: 'Robin Hanson', years: 'born 1959' },
    source: { author: 'Robin Hanson', work: 'Shall We Vote on Values, But Bet on Beliefs?', year: 2013 },
    tagline: 'Vote on values, but bet on beliefs.',
    desc: 'Hanson argues that democracies fail mainly because they are poor at gathering what is known about which policies work. Under futarchy, elected representatives would still define and measure national welfare, but would no longer choose policies. Speculative markets would estimate welfare with and without each proposed policy, and a proposal would become law when the markets clearly expect it to raise welfare. Those with better information profit by correcting prices, so the system rewards being right.',
    wiki: 'Robin Hanson'
  },
  {
    id: 'one-nation-conservatism', name: 'One Nation Conservatism', family: 'Conservative',
    coords: coords(45, 20, 50, 45, 55, 75, 65, 80, 45, 40, 65, 60, 55),
    figure: { name: 'Benjamin Disraeli', years: '1804 to 1881' },
    source: { author: 'Benjamin Disraeli', work: 'Sybil, or The Two Nations', year: 1845 },
    tagline: 'The rich and the poor must not become two nations.',
    desc: 'Disraeli\'s novel describes an England split into two nations, the rich and the poor, who know nothing of each other\'s lives. It blames a selfish oligarchy and the new factory system for abandoning the labouring people. The remedy is not levelling but duty: Crown, Church and a responsible aristocracy should renew their old bond with the people and improve their condition, so that inherited institutions and social reform support each other.',
    symbol: 'crown', wiki: 'Benjamin Disraeli'
  },
  {
    id: 'traditionalist-conservatism', name: 'Traditionalist Conservatism', family: 'Conservative',
    coords: coords(30, 10, 45, 45, 25, 55, 65, 95, 75, 55, 90, 40, 45),
    figure: { name: 'Russell Kirk', years: '1918 to 1994' },
    source: { author: 'Russell Kirk', work: 'The Conservative Mind', year: 1953 },
    tagline: 'A transcendent moral order, and the permanent things that rest on it.',
    desc: 'Kirk traced a line of thought from Burke onward and reduced it to a set of canons. Society rests on a transcendent moral order, so political problems are at root religious and moral ones. He defends the variety and mystery of inherited ways of life against uniformity, holds that civilisation needs orders and classes, ties freedom to private property, trusts custom and prescription over abstract design, and accepts change only when it is prudent.',
    symbol: 'tree', wiki: 'Russell Kirk'
  },
  {
    id: 'fusionism', name: 'Fusionism', family: 'Conservative',
    coords: coords(10, 5, 20, 30, 25, 60, 55, 80, 45, 30, 65, 75, 12),
    figure: { name: 'Frank Meyer', years: '1909 to 1972' },
    source: { author: 'Frank S. Meyer', work: 'In Defense of Freedom: A Conservative Credo', year: 1962 },
    tagline: 'Freedom is the end of politics, virtue the end of man.',
    desc: 'Meyer set out to join the libertarian and traditionalist wings of American conservatism. Virtue is the highest aim of a human life, but an act is only virtuous if it is freely chosen, so the state cannot make people good. Government should therefore be confined to defence, order and the administration of justice, leaving the economy to the free market and morals to persons, families and churches. He paired this with firm opposition to Communism.',
    symbol: 'torch', wiki: 'Frank Meyer (political philosopher)'
  },
  {
    id: 'conservative-liberalism', name: 'Conservative Liberalism', family: 'Conservative',
    coords: coords(25, 15, 20, 25, 10, 45, 50, 60, 50, 50, 60, 45, 15),
    figure: { name: 'Alexis de Tocqueville', years: '1805 to 1859' },
    source: { author: 'Alexis de Tocqueville', work: 'Democracy in America', year: '1835 and 1840' },
    tagline: 'Liberty in a democratic age depends on local self government, associations and mores.',
    desc: 'Tocqueville took the spread of equality to be irreversible and asked how liberty could survive it. He warned of the tyranny of the majority, of citizens withdrawing into private life, and of a mild, centralised state that keeps them in permanent tutelage. The safeguards he found in America were local self government, voluntary associations, a free press, independent courts and juries, and religion that stays out of government while shaping the habits of a free people.',
    symbol: 'scales', wiki: 'Alexis de Tocqueville'
  },
  {
    id: 'gaullism', name: 'Gaullism', family: 'Conservative',
    coords: coords(50, 35, 55, 45, 80, 85, 65, 60, 40, 35, 45, 65, 70),
    figure: { name: 'Charles de Gaulle', years: '1890 to 1970' },
    source: { author: 'Charles de Gaulle', work: 'The Bayeux Speech', year: 1946 },
    tagline: 'A strong head of state above the parties, and an independent France.',
    desc: 'At Bayeux de Gaulle argued that France\'s repeated collapses came from party rivalry and a weak executive. Executive power should not proceed from parliament but from a head of state who stands above the parties, is chosen by a body wider than parliament, appoints the government, and guarantees national independence and the continuity of the state. Parliament keeps two chambers and makes the law. These ideas shaped the constitution of 1958.',
    wiki: 'Charles de Gaulle'
  },
  {
    id: 'compassionate-conservatism', name: 'Compassionate Conservatism', family: 'Conservative',
    coords: coords(20, 10, 45, 25, 20, 50, 55, 80, 50, 40, 85, 40, 40),
    figure: { name: 'Marvin Olasky', years: 'born 1950' },
    source: { author: 'Marvin Olasky', work: 'The Tragedy of American Compassion', year: 1992 },
    tagline: 'Help for the poor should be personal, challenging and spiritual.',
    desc: 'Olasky\'s history of American poor relief argues that earlier charity worked because it was personal: givers knew the people they helped, expected effort in return and addressed spiritual as well as material need. He holds that government welfare programmes replaced this with impersonal entitlements and made poverty worse. Care for the poor is a duty, but it is best carried out by churches, voluntary groups and individuals, not by state bureaucracies.',
    wiki: 'Marvin Olasky'
  },
  {
    id: 'catholic-social-teaching', name: 'Catholic Social Teaching', family: 'Conservative',
    coords: coords(45, 20, 50, 50, 40, 35, 50, 90, 55, 50, 100, 35, 40),
    figure: { name: 'Pope Leo XIII', years: '1810 to 1903' },
    source: { author: 'Pope Leo XIII', work: 'Rerum Novarum', year: 1891 },
    tagline: 'Capital cannot do without labour, nor labour without capital.',
    desc: 'The encyclical answers the misery of industrial workers without accepting socialism. Private property is a natural right, and abolishing it would harm workers most. But employers owe a wage that can keep a thrifty worker and family, and the state must protect the poor, limit working hours and shield women and children. Workers may form their own associations. The classes are not natural enemies and are bound by mutual duties that the Church teaches.',
    symbol: 'cross', wiki: 'Pope Leo XIII'
  },
  {
    id: 'postliberalism', name: 'Postliberalism', family: 'Conservative',
    coords: coords(40, 25, 45, 25, 10, 55, 60, 85, 75, 65, 75, 30, 50),
    figure: { name: 'Patrick Deneen', years: 'born 1964' },
    source: { author: 'Patrick J. Deneen', work: 'Why Liberalism Failed', year: 2018 },
    tagline: 'Liberalism has failed because it has succeeded.',
    desc: 'Deneen argues that liberalism is failing by its own success. By defining freedom as release from custom, place and nature, it dissolves family, community and religion, and the isolated individual who remains depends on an ever larger state and market. Left and right liberalism are two wings of one project. He proposes no new ideology but the patient rebuilding of local communities, household economies and shared culture, from which a better theory may later grow.',
    wiki: 'Patrick Deneen'
  },
  {
    id: 'red-toryism', name: 'Red Toryism', family: 'Conservative',
    coords: coords(45, 45, 40, 20, 15, 50, 55, 70, 50, 50, 60, 35, 50),
    figure: { name: 'Phillip Blond', years: 'born 1966' },
    source: { author: 'Phillip Blond', work: 'Red Tory: How Left and Right Have Broken Britain and How We Can Fix It', year: 2010 },
    tagline: 'Against the monopoly of the state and the monopoly of the market.',
    desc: 'Blond argues that the social liberalism of the left and the economic liberalism of the right worked together to break up civil society, leaving isolated individuals facing a centralised state and monopolised markets. He calls for a moral market, a local economy and wide ownership of assets among the poor. Public services should pass to mutuals and associations run by their workers and users, and power should return to towns and neighbourhoods.',
    wiki: 'Phillip Blond'
  },
  {
    id: 'crunchy-conservatism', name: 'Crunchy Conservatism', family: 'Conservative',
    coords: coords(35, 15, 35, 30, 15, 50, 55, 90, 70, 85, 90, 30, 65),
    figure: { name: 'Rod Dreher', years: 'born 1967' },
    source: { author: 'Rod Dreher', work: 'Crunchy Cons', year: 2006 },
    tagline: 'Small, local, old and particular over big, global, new and abstract.',
    desc: 'Dreher describes conservatives who live in ways usually linked with the counterculture: organic food, home schooling, old houses, small farms. His manifesto holds that big business deserves as much suspicion as big government, that the care of nature is a conservative duty, and that beauty matters more than efficiency. Culture counts for more than politics or economics, and the family and traditional religious faith are the institutions most worth conserving.',
    symbol: 'tree', wiki: 'Rod Dreher'
  },
  {
    id: 'agrarianism', name: 'Agrarianism', family: 'Conservative',
    coords: coords(35, 25, 30, 20, 5, 35, 45, 80, 90, 90, 60, 30, 70),
    figure: { name: 'Wendell Berry', years: '1934 to 2026' },
    source: { author: 'Wendell Berry', work: 'The Unsettling of America: Culture and Agriculture', year: 1977 },
    tagline: 'Good farming, settled households and local economies are the basis of culture.',
    desc: 'Berry argues that industrial agriculture drove families off the land and treats soil as a mine to be exhausted, guided by an exploiter\'s mind that asks only how much can be taken. Against it he sets the nurturer, who asks what a place needs to stay healthy. The health of land, body, household and community cannot be separated. He calls for small, diverse family farms, local markets, tools on a human scale, and limits on the power of agribusiness and its experts.',
    symbol: 'tree', wiki: 'Wendell Berry'
  },
  {
    id: 'oakeshottian-conservatism', name: 'Oakeshottian Conservatism', family: 'Conservative',
    coords: coords(25, 15, 30, 35, 35, 50, 50, 75, 65, 50, 40, 35, 40),
    figure: { name: 'Michael Oakeshott', years: '1901 to 1990' },
    source: { author: 'Michael Oakeshott', work: 'Rationalism in Politics and Other Essays', year: 1962 },
    tagline: 'Conservatism as a disposition, not a doctrine.',
    desc: 'Oakeshott attacks rationalism, the belief that politics can be run from a blueprint or a technique learned from a book. Real political knowledge is practical and carried in a tradition of behaviour, and politics means attending to existing arrangements and following what they suggest. To be conservative is to prefer the familiar and tried to the unknown. Government should act as an umpire who keeps the rules, not impose a single purpose on its subjects, and this view needs no religious foundation.',
    wiki: 'Michael Oakeshott'
  },
  {
    id: 'hamiltonianism', name: 'Hamiltonianism', family: 'Conservative',
    coords: coords(45, 15, 55, 45, 85, 75, 60, 55, 20, 10, 45, 65, 90),
    figure: { name: 'Alexander Hamilton', years: '1755 or 1757 to 1804' },
    source: { author: 'Alexander Hamilton', work: 'Report on the Subject of Manufactures', year: 1791 },
    tagline: 'A strong national government that builds national industry.',
    desc: 'Hamilton argued to Congress that a nation of farmers alone would stay poor and dependent. Manufacturing extends the division of labour, brings machinery into use, attracts immigrants and gives farmers a home market. Because new industries cannot at first compete with established foreign ones, the federal government should foster them with protective duties, bounties and better roads and canals. Economic independence, above all in military supplies, is a condition of national security.',
    symbol: 'gear', wiki: 'Alexander Hamilton'
  },
  {
    id: 'straussianism', name: 'Straussianism', family: 'Conservative',
    coords: coords(35, 20, 50, 50, 50, 55, 60, 80, 60, 50, 55, 55, 45),
    figure: { name: 'Leo Strauss', years: '1899 to 1973' },
    source: { author: 'Leo Strauss', work: 'Natural Right and History', year: 1953 },
    tagline: 'A return to classical natural right against relativism.',
    desc: 'Strauss argues that modern thought, by reducing every standard to a product of its time and by separating facts from values, has lost the ability to call anything just or unjust and ends in nihilism. He returns to the classical philosophers, for whom there is a right by nature that reason can discover. On that view the best regime is the rule of the wise, which in practice means a mixed regime of educated citizens under law. Modern natural right, beginning with Hobbes and Locke, lowered the aims of politics.',
    symbol: 'column', wiki: 'Leo Strauss'
  },
  {
    id: 'hegelian-constitutional-monarchism', name: 'Hegelian Constitutional Monarchism', family: 'Conservative',
    coords: coords(40, 20, 60, 65, 75, 70, 65, 65, 45, 35, 50, 70, 50),
    figure: { name: 'Georg Wilhelm Friedrich Hegel', years: '1770 to 1831' },
    source: { author: 'G. W. F. Hegel', work: 'Elements of the Philosophy of Right', year: 1820 },
    tagline: 'Freedom made actual in the family, civil society and the state.',
    desc: 'Hegel holds that freedom is real only inside institutions. The family gives belonging, and civil society gives a market in which people pursue private ends, organised by trade corporations and corrected by public authority. Above both stands the state, the ethical whole in which citizens find their freedom. Its rational form is a constitutional monarchy with a hereditary monarch, a professional civil service and an assembly of estates. He rejects both pure popular sovereignty and a return to the feudal past.',
    wiki: 'Georg Wilhelm Friedrich Hegel'
  },
  {
    id: 'carlism', name: 'Carlism', family: 'Reactionary',
    coords: coords(50, 30, 70, 80, 20, 70, 45, 100, 75, 50, 100, 65, 60),
    figure: { name: 'Juan Vázquez de Mella', years: '1861 to 1928' },
    source: { author: 'Carlos VII and his counsellors, among them Juan Vázquez de Mella', work: 'The Loredan Act (Acta de Loredán)', year: 1897 },
    tagline: 'God, Fatherland, Fueros, King.',
    desc: 'The programme drawn up at the Carlist claimant\'s court in Venice makes Catholic unity the foundation of Spain and rejects liberal parliamentarism as foreign and corrupt. The king both reigns and governs, but within the law and beside a Cortes that represents estates and professions, not parties. The regions recover their historic charters, the fueros, with their own assemblies and laws. On labour it follows Leo XIII and calls for revived guilds.',
    symbol: 'crown', wiki: 'Juan Vázquez de Mella'
  },
  {
    id: 'integral-nationalism', name: 'Integral Nationalism', family: 'Reactionary',
    coords: coords(45, 25, 85, 95, 30, 100, 95, 95, 60, 40, 70, 75, 65),
    figure: { name: 'Charles Maurras', years: '1868 to 1952' },
    source: { author: 'Charles Maurras', work: 'Enquête sur la monarchie (Inquiry into the Monarchy)', year: 1900 },
    tagline: 'The nation above all, and monarchy as the only way to secure it.',
    desc: 'Maurras argued from national interest, not divine right: the republic and its parties divide and weaken France, so the nation needs a monarchy that is hereditary, traditional, anti parliamentary and decentralised. He valued the Catholic Church chiefly as a source of order. His movement, Action Française, made hostility to Jews, Protestants, Freemasons and foreigners part of its doctrine and called for laws against Jews. Maurras backed the Vichy regime and was sentenced to life imprisonment in 1945.',
    restricted: true
  },
  {
    id: 'prussian-socialism', name: 'Prussian Socialism', family: 'Reactionary',
    coords: coords(75, 45, 85, 85, 90, 90, 80, 75, 35, 20, 40, 90, 85),
    figure: { name: 'Oswald Spengler', years: '1880 to 1936' },
    source: { author: 'Oswald Spengler', work: 'Prussianism and Socialism', year: 1919 },
    tagline: 'Socialism as duty and service to the state, not as class struggle.',
    desc: 'Spengler claimed that true socialism is not Marx\'s doctrine but the old Prussian ethic of duty, discipline and service, in which every person, worker or owner, holds a rank as a servant of the whole. He set it against English liberalism, which he saw as the rule of private wealth through parliament and trade. Property remains, but as an office held on the state\'s behalf, within an economy directed from above. Germany should reject Marxism and parliamentary democracy alike.',
    wiki: 'Oswald Spengler'
  },
  {
    id: 'conservative-revolution', name: 'Conservative Revolution', family: 'Reactionary',
    coords: coords(60, 40, 85, 90, 70, 100, 90, 80, 50, 40, 50, 85, 70),
    figure: { name: 'Arthur Moeller van den Bruck', years: '1876 to 1925' },
    source: { author: 'Arthur Moeller van den Bruck', work: 'Das Dritte Reich (The Third Reich)', year: 1923 },
    tagline: 'Against liberalism and party rule, a new Reich above the parties.',
    desc: 'Moeller treated liberalism as the force that dissolves peoples and the party state of Weimar as its German form. He called for a new Reich that would end the division into parties and classes, joining a nationalism purged of the old monarchy with a German socialism purged of Marx. Conservatism for him meant creating things worth conserving, not restoring the past. He criticised Hitler and died in 1925, but the National Socialists took the title of his book as a slogan.',
    wiki: 'Arthur Moeller van den Bruck'
  },
  {
    id: 'nouvelle-droite', name: 'Nouvelle Droite (European New Right)', family: 'Reactionary',
    coords: coords(55, 45, 50, 35, 15, 55, 45, 75, 60, 75, 30, 50, 60),
    figure: { name: 'Alain de Benoist', years: 'born 1943' },
    source: { author: 'Alain de Benoist and Charles Champetier', work: 'Manifesto for a European Renaissance', year: 1999 },
    tagline: 'The right to difference, against a single world culture.',
    desc: 'The manifesto holds that liberal modernity, with its individualism, universalism and worship of the market, is flattening the world\'s peoples into one mass. It defends the right of every people and culture to remain distinct, opposes large scale immigration as an uprooting of everyone involved, and proposes a federal Europe of regions with local, participatory democracy and respect for ecological limits. Scholars generally class the movement as far right and many read its ethnopluralism as separation of peoples in cultural dress.',
    wiki: 'Alain de Benoist'
  },
  {
    id: 'perennialist-traditionalism', name: 'Perennialist Traditionalism', family: 'Reactionary',
    coords: coords(50, 40, 70, 90, 50, 20, 50, 100, 95, 55, 100, 25, 40),
    figure: { name: 'René Guénon', years: '1886 to 1951' },
    source: { author: 'René Guénon', work: 'The Crisis of the Modern World (1927) and Spiritual Authority and Temporal Power', year: 1929 },
    tagline: 'Spiritual authority above temporal power.',
    desc: 'Guénon held that the modern West is a deviation without precedent, a civilisation built on quantity, matter and the individual and cut off from the metaphysical principles kept by the great traditions. In a normal society spiritual authority, which belongs to those with sacred knowledge, stands above kings and warriors, and disorder begins when temporal power revolts against it. Unlike Evola, he gives primacy to contemplation over action and offers no political programme, only the hope of an intellectual elite that restores tradition.',
    symbol: 'wheel', wiki: 'René Guénon'
  },
  {
    id: 'divine-right-absolutism', name: 'Divine Right Absolutism', family: 'Reactionary',
    coords: coords(50, 30, 95, 100, 95, 50, 70, 95, 50, 50, 85, 50, 50),
    figure: { name: 'Robert Filmer', years: 'c. 1588 to 1653' },
    source: { author: 'Sir Robert Filmer', work: 'Patriarcha, or The Natural Power of Kings', year: 1680 },
    tagline: 'Kings rule as fathers, by the authority God gave Adam.',
    desc: 'Filmer denies that people are born free or that government rests on consent. God gave Adam authority over his family and descendants, and kings hold that same fatherly power by inheritance, so a subject can no more depose a king than a child can choose a father. The king is above the law, which is his own will, and parliaments sit by his grace. Written before the English Civil War and printed in 1680, it was the text Locke set out to refute.',
    symbol: 'crown', wiki: 'Robert Filmer'
  },
  {
    id: 'aristocratic-radicalism', name: 'Aristocratic Radicalism', family: 'Reactionary',
    coords: coords(45, 30, 45, 90, 50, 15, 50, 45, 45, 50, 5, 75, 35),
    figure: { name: 'Friedrich Nietzsche', years: '1844 to 1900' },
    source: { author: 'Friedrich Nietzsche', work: 'Beyond Good and Evil', year: 1886 },
    tagline: 'Rank and the higher human being, against the morality of the herd.',
    desc: 'Nietzsche argues that every advance of the human type has been the work of an aristocratic society that believes in an order of rank. He treats Christian morality, democracy and socialism as one levelling movement, a morality of the herd that breeds a smaller human being, and calls for new philosophers who create values. He also scorns nationalism and antisemitism and speaks as a good European. The label was coined by the critic Georg Brandes, and Nietzsche approved it.',
    wiki: 'Friedrich Nietzsche'
  },
  {
    id: 'carlylean-hero-worship', name: 'Carlylean Hero Worship', family: 'Reactionary',
    coords: coords(60, 30, 80, 95, 80, 60, 70, 75, 45, 40, 70, 75, 55),
    figure: { name: 'Thomas Carlyle', years: '1795 to 1881' },
    source: { author: 'Thomas Carlyle', work: 'On Heroes, Hero-Worship, and the Heroic in History (1841) and Latter-Day Pamphlets', year: 1850 },
    tagline: 'History is the biography of great men, and the ablest should rule.',
    desc: 'Carlyle holds that history is made by great men, whether prophets, poets or kings, and that reverence for them is the bond of every society. The task of politics is to find the ablest man and obey him. In the Latter-Day Pamphlets he turns this against his own age: counting votes cannot discover who is fit to rule, free market economics abandons the poor, and the idle should be enrolled in labour regiments under command. He saw democracy as the absence of real government.',
    wiki: 'Thomas Carlyle'
  },
  {
    id: 'catholic-integralism', name: 'Catholic Integralism', family: 'Reactionary',
    coords: coords(50, 30, 80, 75, 60, 25, 85, 100, 75, 50, 100, 45, 40),
    figure: { name: 'Pope Pius IX', years: '1792 to 1878' },
    source: { author: 'Pope Pius IX', work: 'Quanta Cura and the Syllabus of Errors', year: 1864 },
    tagline: 'The state owes public recognition to the Catholic faith.',
    desc: 'The encyclical and its attached list of eighty condemned propositions reject the leading ideas of nineteenth century liberalism. Among the errors named are that Church and state should be separated, that Catholicism need no longer be the religion of the state, that every person may choose a religion by the light of reason alone, and that the Pope should reconcile himself with progress, liberalism and modern civilisation. Integralists take from it that civil power must serve the spiritual end of human life.',
    symbol: 'cross', wiki: 'Pope Pius IX'
  },
  {
    id: 'civic-nationalism', name: 'Civic Nationalism', family: 'Nationalist',
    coords: coords(40, 25, 35, 20, 55, 75, 60, 50, 45, 35, 20, 40, 55),
    figure: { name: 'Ernest Renan', years: '1823 to 1892' },
    source: { author: 'Ernest Renan', work: 'What Is a Nation?', year: 1882 },
    tagline: 'A nation is a daily plebiscite.',
    desc: 'Renan argued that a nation is not made by race, language, religion, shared interests or natural frontiers. It is made by two things: a common store of memories, including what a people has agreed to forget, and the present will to go on living together. A nation therefore exists only by the continuing consent of its members, and no population may rightly be annexed against its wishes.',
    symbol: 'flag', wiki: 'Ernest Renan'
  },
  {
    id: 'romantic-nationalism', name: 'Romantic Nationalism', family: 'Nationalist',
    coords: coords(55, 40, 55, 45, 65, 90, 85, 60, 45, 45, 55, 50, 65),
    figure: { name: 'Johann Gottlieb Fichte', years: '1762 to 1814' },
    source: { author: 'Johann Gottlieb Fichte', work: 'Addresses to the German Nation', year: 1808 },
    tagline: 'A people is made by its language, and remade by its schools.',
    desc: 'Delivered in Berlin under French occupation, the addresses hold that a nation is defined by its original, living language, which shapes the inner life of those who speak it. Its true borders are these inner ones, not rivers or treaties. Fichte called for a new national education, run by the state and reaching every child, to form a generation devoted to the whole and able to restore German independence.',
    symbol: 'torch', wiki: 'Johann Gottlieb Fichte'
  },
  {
    id: 'mazzinianism', name: 'Mazzinian Republicanism', family: 'Nationalist',
    coords: coords(40, 50, 40, 10, 70, 70, 60, 55, 40, 35, 70, 50, 50),
    figure: { name: 'Giuseppe Mazzini', years: '1805 to 1872' },
    source: { author: 'Giuseppe Mazzini', work: 'The Duties of Man', year: 1860 },
    tagline: 'God and the people.',
    desc: 'Addressed to Italian working men, the book argues that a politics of rights alone breeds selfishness, and that life is a mission built on duties: to humanity first, then to country, then to family. Each nation has a task given by God within the wider association of peoples. Italy must be one free and united republic, with education for all, and with labour and capital joined in the same hands through voluntary association, not through communism.',
    symbol: 'torch', wiki: 'Giuseppe Mazzini'
  },
  {
    id: 'pan-slavism', name: 'Pan Slavism', family: 'Nationalist',
    coords: coords(55, 55, 70, 85, 65, 85, 55, 85, 55, 40, 80, 80, 65),
    figure: { name: 'Nikolay Danilevsky', years: '1822 to 1885' },
    source: { author: 'Nikolay Danilevsky', work: 'Russia and Europe', year: 1869 },
    tagline: 'The Slavs are a civilisation of their own, not a part of Europe.',
    desc: 'Danilevsky denied that there is one universal civilisation and divided history into separate cultural types, each with its own life cycle. Europe is the Romano Germanic type, and it is by nature hostile to the younger Slavic type led by Russia. He concluded that the Slavs should stop imitating the West and form an all Slavic federation under Russian leadership, with Constantinople as its capital, resting on Orthodoxy and the peasant commune.',
    symbol: 'flag', wiki: 'Nikolay Danilevsky'
  },
  {
    id: 'garveyism', name: 'Garveyism', family: 'Nationalist',
    coords: coords(30, 30, 45, 45, 60, 90, 80, 60, 35, 25, 60, 55, 75),
    figure: { name: 'Marcus Garvey', years: '1887 to 1940' },
    source: { author: 'Marcus Garvey and the 1920 convention of the Universal Negro Improvement Association', work: 'Declaration of the Rights of the Negro Peoples of the World', year: 1920 },
    tagline: 'Africa for the Africans, at home and abroad.',
    desc: 'The declaration lists the wrongs done to black people across the world and then claims their rights as one people: equal treatment before the law, self determination, and the freedom of Africa from colonial rule. Garvey\'s movement held that these rights would only be secured by race pride, black owned enterprise and a strong independent nation in Africa, and it looked to separate development, not integration.',
    symbol: 'star', wiki: 'Marcus Garvey'
  },
  {
    id: 'three-principles-of-the-people', name: 'Three Principles of the People', family: 'Nationalist',
    coords: coords(60, 50, 55, 40, 70, 85, 75, 45, 20, 20, 15, 55, 70),
    figure: { name: 'Sun Yat-sen', years: '1866 to 1925' },
    source: { author: 'Sun Yat-sen', work: 'The Three Principles of the People (lectures)', year: 1924 },
    tagline: 'Nationalism, democracy, the people\'s livelihood.',
    desc: 'In his 1924 lectures Sun set out three aims for China. Nationalism means freeing the country from foreign domination and binding its loose sand of clans into one nation. Democracy means a republic in which the people hold the powers of election, recall, initiative and referendum over a government of five branches. Livelihood means equalising land rights by taxing away rises in land value, and keeping large capital under state regulation.',
    symbol: 'sun', wiki: 'Sun Yat-sen'
  },
  {
    id: 'revisionist-zionism', name: 'Revisionist Zionism', family: 'Nationalist',
    coords: coords(35, 25, 65, 35, 65, 100, 75, 55, 35, 30, 35, 90, 60),
    figure: { name: 'Ze\'ev Jabotinsky', years: '1880 to 1940' },
    source: { author: 'Ze\'ev Jabotinsky', work: 'The Iron Wall', year: 1923 },
    tagline: 'Settlement behind an iron wall of force.',
    desc: 'Jabotinsky argued that no native population has ever agreed to be colonised, so the Arabs of Palestine would never consent freely to a Jewish majority. Zionism therefore had either to stop or to go ahead under the protection of a force the Arabs could not break, which he called an iron wall. Only once that wall stood, he held, would moderate Arab leaders negotiate, and he said the two peoples could then live with equal rights.',
    symbol: 'hexagram', wiki: 'Ze\'ev Jabotinsky'
  },
  {
    id: 'irish-republicanism', name: 'Irish Republicanism', family: 'Nationalist',
    coords: coords(45, 45, 35, 10, 55, 90, 60, 55, 50, 40, 50, 75, 65),
    figure: { name: 'Patrick Pearse', years: '1879 to 1916' },
    source: { author: 'Provisional Government of the Irish Republic', work: 'Proclamation of the Irish Republic', year: 1916 },
    tagline: 'A sovereign republic, won in arms, for all the people of Ireland.',
    desc: 'Read by Pearse at the start of the Easter Rising, the proclamation declares Ireland a sovereign independent state and asserts the right of the Irish people to the ownership of Ireland. It claims that right has been affirmed in arms by every generation. The republic promises religious and civil liberty, equal rights and opportunities for all citizens, and a government elected by the votes of all its men and women.',
    symbol: 'flag', wiki: 'Patrick Pearse'
  },
  {
    id: 'nehruvian-nationalism', name: 'Nehruvian Secular Nationalism', family: 'Nationalist',
    coords: coords(70, 60, 35, 10, 70, 65, 15, 25, 10, 20, 10, 30, 80),
    figure: { name: 'Jawaharlal Nehru', years: '1889 to 1964' },
    source: { author: 'Jawaharlal Nehru', work: 'The Discovery of India', year: 1946 },
    tagline: 'One nation out of many faiths and languages.',
    desc: 'Written in prison, the book reads Indian history as a long process of absorbing and blending many peoples, faiths and languages into one composite culture. India\'s nationhood rests on that shared civilisation and not on any single religion. Nehru wanted an independent India that is democratic and secular, guided by a scientific temper in place of dogma, and that ends poverty through planning and industry.',
    symbol: 'wheel', wiki: 'Jawaharlal Nehru'
  },
  {
    id: 'pancasila', name: 'Pancasila', family: 'Nationalist',
    coords: coords(60, 55, 55, 40, 70, 75, 35, 55, 40, 35, 70, 45, 60),
    figure: { name: 'Sukarno', years: '1901 to 1970' },
    source: { author: 'Sukarno', work: 'The Birth of Pancasila (speech of 1 June 1945)', year: 1945 },
    tagline: 'Five principles for one nation of many islands and faiths.',
    desc: 'Sukarno proposed five foundations for an independent Indonesia: a single nationhood covering the whole archipelago, a humane internationalism, government by deliberation and consensus among representatives, social justice and prosperity for all, and belief in God with respect between religions. He said the five could be pressed into one idea, mutual cooperation. The state belongs to no single group, faith or class.',
    symbol: 'star', wiki: 'Sukarno'
  },
  {
    id: 'bolivarianism', name: 'Bolivarianism', family: 'Nationalist',
    coords: coords(35, 25, 55, 50, 85, 60, 65, 45, 35, 30, 45, 70, 75),
    figure: { name: 'Simón Bolívar', years: '1783 to 1830' },
    source: { author: 'Simón Bolívar', work: 'The Jamaica Letter (1815) and the Angostura Address', year: 1819 },
    tagline: 'Independence, union and a strong republic for Spanish America.',
    desc: 'In the Jamaica Letter Bolívar defended independence from Spain and hoped the new American nations would be bound together in a league, meeting in a congress at Panama. At Angostura he argued that laws must fit the people they govern, and that federalism copied from the United States had weakened Venezuela. He proposed a unitary republic with a strong president, a hereditary senate, a branch of government for public morals and education, and the abolition of slavery.',
    symbol: 'flag', wiki: 'Simón Bolívar'
  },
  {
    id: 'pan-turkism', name: 'Pan Turkism', family: 'Nationalist',
    coords: coords(50, 40, 65, 65, 70, 95, 85, 45, 35, 25, 30, 65, 65),
    figure: { name: 'Yusuf Akçura', years: '1876 to 1935' },
    source: { author: 'Yusuf Akçura', work: 'Three Types of Policy', year: 1904 },
    tagline: 'A political union of all the Turks.',
    desc: 'Akçura weighed three courses open to the Ottoman state. Ottomanism, the making of one nation out of all its subjects, he judged a failure. Pan Islamism, uniting all Muslims, would be blocked by the great powers that ruled Muslim lands. The third and newest course was a political nation founded on the Turkish race, joining the Turks of the empire with the Turkic peoples of Russia and Central Asia. He set out its advantages while leaving the final choice open.',
    symbol: 'crescentStar', wiki: 'Yusuf Akçura'
  },
  {
    id: 'kokutai', name: 'Kokutai Thought', family: 'Nationalist',
    coords: coords(60, 35, 90, 100, 95, 100, 95, 95, 50, 45, 100, 90, 75),
    figure: { name: 'Aizawa Seishisai', years: '1782 to 1863' },
    source: { author: 'Aizawa Seishisai; Japanese Ministry of Education', work: 'New Theses (1825) and Kokutai no Hongi', year: 1937 },
    tagline: 'One nation as one family under a divine and unbroken imperial line.',
    desc: 'Aizawa gave the word kokutai, the national polity, its political sense: Japan is a unity of ritual and government under an emperor descended from the sun goddess. The 1937 Ministry of Education text made this the official creed. It teaches that subjects find their purpose in loyalty and filial piety toward the throne, and it rejects Western individualism as the common root of liberalism, socialism and communism. It was the orthodoxy of the wartime Japanese state.',
    symbol: 'sun', wiki: 'Aizawa Seishisai'
  },
  {
    id: 'economic-nationalism', name: 'Economic Nationalism', family: 'Nationalist',
    coords: coords(55, 25, 45, 45, 65, 80, 55, 45, 15, 10, 35, 50, 95),
    figure: { name: 'Friedrich List', years: '1789 to 1846' },
    source: { author: 'Friedrich List', work: 'The National System of Political Economy', year: 1841 },
    tagline: 'The power to produce wealth matters more than wealth itself.',
    desc: 'List charged Adam Smith\'s school with seeing only individuals and humanity and missing the nation that stands between them. A country\'s wealth lies in its productive powers, meaning its industry, skills, institutions and transport, and not in the goods it can buy cheaply today. A nation that is behind must therefore shelter its young industries with tariffs until they can compete, with free trade inside its borders and open trade only among equals.',
    symbol: 'gear', wiki: 'Friedrich List'
  },
  {
    id: 'apartheid', name: 'Apartheid (Afrikaner Nationalism)', family: 'Nationalist',
    coords: coords(60, 35, 95, 85, 85, 100, 60, 90, 50, 35, 80, 80, 75),
    figure: { name: 'Geoffrey Cronjé', years: '1907 to 1992' },
    source: { author: 'Geoffrey Cronjé', work: '\'n Tuiste vir die Nageslag (A Home for Posterity)', year: 1945 },
    tagline: 'Total separation of the races under white rule.',
    desc: 'A doctrine of white supremacy. Cronjé argued that the Afrikaner people could only survive as a white minority if the races of South Africa were separated completely and for good, in territory, work and family life, and he treated racial mixing as the gravest threat of all. The National Party made apartheid law from 1948. It denied the black majority the vote, stripped millions of their citizenship, forced millions from their homes, and was declared a crime against humanity by the United Nations.',
    restricted: true
  },
  {
    id: 'white-nationalism', name: 'White Nationalism', family: 'Nationalist',
    coords: coords(35, 15, 70, 55, 50, 100, 100, 85, 50, 35, 45, 50, 60),
    figure: { name: 'Jared Taylor', years: 'born 1951' },
    source: { author: 'Jared Taylor', work: 'White Identity: Racial Consciousness in the 21st Century', year: 2011 },
    tagline: 'The claim that white people are a nation and must keep a country to themselves.',
    desc: 'A racist doctrine. Taylor argues that loyalty to one\'s own race is natural and permanent, that racial diversity weakens a society, and that white people should organise around their racial interests, end non white immigration and remain the majority. Its claims about innate racial difference are rejected by mainstream science. Ideas from this movement were cited by the men who carried out the mass shootings in Charleston in 2015 and Christchurch in 2019.',
    restricted: true
  },
  {
    id: 'hutu-power', name: 'Hutu Power', family: 'Nationalist',
    coords: coords(55, 45, 100, 90, 85, 100, 95, 60, 50, 40, 45, 95, 70),
    figure: { name: 'Hassan Ngeze', years: 'born 1957' },
    source: { author: 'Hassan Ngeze (publisher), Kangura', work: 'The Hutu Ten Commandments', year: 1990 },
    tagline: 'Rwanda for the Hutu alone, with the Tutsi cast as the enemy within.',
    desc: 'A doctrine of ethnic supremacy and hatred. The commandments brand every Tutsi as dishonest and bent on domination, call any Hutu who marries, employs or does business with a Tutsi a traitor, reserve the army, the government and the schools for Hutu, and tell Hutu to show the Tutsi no mercy. This propaganda prepared the 1994 genocide, in which more than half a million Tutsi were murdered in about a hundred days. Ngeze was convicted by the international tribunal for Rwanda.',
    restricted: true
  },
  {
    id: 'kahanism', name: 'Kahanism', family: 'Nationalist',
    coords: coords(45, 30, 90, 75, 75, 100, 100, 90, 45, 35, 95, 90, 65),
    figure: { name: 'Meir Kahane', years: '1932 to 1990' },
    source: { author: 'Meir Kahane', work: 'They Must Go', year: 1981 },
    tagline: 'The expulsion of Arabs from Israel and the territories it holds.',
    desc: 'A racist and violent doctrine. Kahane argued that a state cannot be both Jewish and fully democratic, because its Arab citizens would one day outnumber or outvote the Jews, and that the Arabs must therefore be removed, by paid emigration if they agree and by force if they do not. His Kach party was barred from Israeli elections for racism in 1988 and outlawed as a terrorist organisation in 1994, after a follower murdered 29 Muslim worshippers in Hebron.',
    restricted: true
  },
  {
    id: 'british-fascism', name: 'British Fascism', family: 'Third Position',
    coords: coords(70, 35, 80, 80, 90, 90, 80, 60, 15, 20, 40, 70, 92),
    figure: { name: 'Oswald Mosley', years: '1896 to 1980' },
    source: { author: 'Oswald Mosley', work: 'The Greater Britain', year: 1932 },
    tagline: 'A corporate state and a closed imperial economy.',
    desc: 'The founding programme of the British Union of Fascists. Mosley wanted parliament reduced to a body elected by occupation, which would hand a small executive the power to govern by order and judge it only at intervals. Industry is to be run through corporations of employers, workers and consumers under state direction, with high wages and scientific planning, inside an empire sealed off from world trade. The movement soon turned to open antisemitism and street violence.',
    symbol: 'bolt', wiki: 'Oswald Mosley'
  },
  {
    id: 'rexism', name: 'Rexism', family: 'Third Position',
    coords: coords(60, 35, 75, 75, 70, 80, 75, 90, 55, 40, 90, 50, 65),
    figure: { name: 'Léon Degrelle', years: '1906 to 1994' },
    source: { author: 'Jean Denis', work: 'Principes Rexistes', year: 1936 },
    tagline: 'A Catholic and corporatist revolt against the Belgian party system.',
    desc: 'Named after Christ the King, the movement led by Degrelle grew out of Belgian Catholic Action. Denis, its main theorist, presented Rex as a popular movement and not a party, and called for a moral renewal of Belgium through a new hierarchical state organised by corporations, in place of parliamentary parties and the financiers it accused of corrupting them. Under German occupation Degrelle took the movement into full collaboration with National Socialism.'
  },
  {
    id: 'legionarism', name: 'Legionarism', family: 'Third Position',
    coords: coords(55, 40, 95, 95, 75, 100, 100, 95, 60, 55, 100, 95, 70),
    figure: { name: 'Corneliu Zelea Codreanu', years: '1899 to 1938' },
    source: { author: 'Corneliu Zelea Codreanu', work: 'For My Legionaries', year: 1936 },
    tagline: 'A fascism of Orthodox mysticism, antisemitism and the cult of death.',
    desc: 'The creed of the Romanian Iron Guard, a fascist and violently antisemitic movement. Codreanu presents the Jews as the cause of Romania\'s ills and calls for their removal, and he wants not a new programme but a new man, formed in small disciplined nests through prayer, sacrifice and readiness to die and to kill. The Legion murdered two prime ministers and many opponents, and in power in 1940 and 1941 it carried out pogroms, including the killing of 125 Jews in Bucharest.',
    restricted: true
  },
  {
    id: 'ustashism', name: 'Ustaša Doctrine', family: 'Third Position',
    coords: coords(60, 45, 95, 95, 90, 100, 100, 90, 55, 45, 80, 100, 75),
    figure: { name: 'Ante Pavelić', years: '1889 to 1959' },
    source: { author: 'Ante Pavelić', work: 'The Principles of the Ustaša Movement', year: 1933 },
    tagline: 'A Croatian state for those of Croatian blood alone.',
    desc: 'A fascist and genocidal movement. The principles declare the Croats a distinct nation with a right to their own sovereign state on all their historic land. Only those who are Croat by descent and blood may have a say in it, and the peasantry is named as the source of the nation\'s life. Ruling the Independent State of Croatia from 1941 to 1945, the Ustaše murdered hundreds of thousands of Serbs, Jews and Roma, many in the Jasenovac camp.',
    restricted: true
  },
  {
    id: 'salazarism', name: 'Estado Novo Corporatism (Salazarism)', family: 'Third Position',
    coords: coords(55, 25, 85, 90, 80, 80, 80, 95, 70, 40, 85, 50, 80),
    figure: { name: 'António de Oliveira Salazar', years: '1889 to 1970' },
    source: { author: 'António de Oliveira Salazar', work: 'Doctrine and Action: Internal and Foreign Policy of the New Portugal, 1928 to 1939', year: 1939 },
    tagline: 'A strong state without parties, bounded by Catholic morals.',
    desc: 'In these speeches Salazar sets out an authoritarian state that rejects parliamentary parties and class struggle and also rejects the totalitarian claim that the state stands above morality and law. The nation is to be organised through the family, the parish, the municipality and corporations of employers and workers. He places sound public finance, order, Catholic values and the unity of Portugal with its overseas empire ahead of rapid change or mass mobilisation.',
    symbol: 'cross', wiki: 'António de Oliveira Salazar'
  },
  {
    id: 'showa-statism', name: 'Shōwa Statism', family: 'Third Position',
    coords: coords(85, 70, 85, 90, 95, 100, 85, 55, 20, 20, 45, 100, 85),
    figure: { name: 'Kita Ikki', years: '1883 to 1937' },
    source: { author: 'Kita Ikki', work: 'An Outline Plan for the Reorganization of Japan', year: 1923 },
    tagline: 'A coup in the emperor\'s name, state control of big capital, empire abroad.',
    desc: 'Written in 1919, banned and then published in censored form, the plan calls for a coup that suspends the constitution for three years under martial law and unites the emperor directly with the people. Private fortunes, landholdings and firms above fixed limits pass to the state, and workers share in profits. Kita held that Japan, as a poor nation among rich empires, has the right to wage war for territory and to lead Asia. The plan inspired the young officers of the 1936 mutiny.',
    symbol: 'sun', wiki: 'Kita Ikki'
  },
  {
    id: 'hungarism', name: 'Hungarism', family: 'Third Position',
    coords: coords(75, 55, 95, 95, 90, 100, 90, 85, 50, 50, 70, 85, 80),
    figure: { name: 'Ferenc Szálasi', years: '1897 to 1946' },
    source: { author: 'Ferenc Szálasi', work: 'Cél és követelések (Aim and Demands)', year: 1935 },
    tagline: 'A Hungarian national socialism for the Carpathian basin.',
    desc: 'A fascist and antisemitic doctrine. Szálasi\'s programme for his Party of National Will joined nationalism, Christianity and an anti capitalist socialism, sought a greater Hungary restored across the Carpathian basin under Hungarian leadership, and demanded the removal of the Jews from national life. His Arrow Cross government, installed by Germany in October 1944, murdered thousands of Budapest Jews and sent tens of thousands more on forced marches. He was executed in 1946.',
    restricted: true
  },
  {
    id: 'national-anarchism', name: 'National Anarchism', family: 'Third Position',
    coords: coords(30, 60, 35, 30, 0, 75, 95, 85, 75, 75, 50, 45, 55),
    figure: { name: 'Troy Southgate', years: 'born 1965' },
    source: { author: 'Troy Southgate', work: 'Tradition and Revolution: Collected Writings of Troy Southgate', year: 2010 },
    tagline: 'Stateless villages, each for one people only.',
    desc: 'A racial separatist doctrine that came out of the British far right. Southgate, a former National Front activist, calls for the state, capitalism and the cities to be replaced by small self sufficient rural communities, each free to set its own rules and to admit only its own ethnic group. It borrows the language of anarchism, but anarchists reject it, and scholars who have studied it describe it as a repackaging of fascist and racial nationalist ideas.',
    restricted: true
  },
  {
    id: 'political-soldier', name: 'Political Soldier Doctrine', family: 'Third Position',
    coords: coords(55, 45, 70, 75, 35, 95, 95, 90, 65, 60, 80, 80, 70),
    figure: { name: 'Derek Holland', years: 'active 1980s' },
    source: { author: 'Derek Holland', work: 'The Political Soldier: A Statement', year: 1984 },
    tagline: 'A new man who gives his whole life to the nationalist cause.',
    desc: 'A neo fascist doctrine from the British National Front of the 1980s. Holland\'s pamphlet says that programmes and votes are useless without a new kind of man, who rejects materialism and serves the national struggle with religious zeal. Its models are the Spartans, the Roman centurion, the Crusaders and the Romanian Iron Guard. The faction opposed both capitalism and communism and called for the separation of the races, and its leaders went on to found the International Third Position.',
    restricted: true
  },

  /* ====================== ADDED IN THE 250 EXPANSION ======================
     Each entry was researched against its source text. symbol names its emblem,
     wiki is the article used to find a portrait, and restricted marks hateful or
     violent extremist ideologies, which get no emblem and no portrait. */
  {
    id: 'liberation-theology', name: 'Liberation Theology', family: 'Religious',
    coords: coords(75, 75, 30, 15, 35, 15, 20, 45, 50, 50, 85, 35, 65),
    figure: { name: 'Gustavo Gutiérrez', years: '1928 to 2024' },
    source: { author: 'Gustavo Gutiérrez', work: 'A Theology of Liberation', year: 1971 },
    tagline: 'Theology done from the side of the poor.',
    desc: 'Gutiérrez argued that theology must begin from the lived experience of the poor of Latin America, with whom the God of the Bible takes sides. Poverty is not fate but the product of unjust structures, which he calls a situation of sin, and salvation includes liberation from them in history. He drew on dependency theory and on class analysis, held that the Church cannot be neutral, and looked to a socialist society built by the poor themselves.',
    symbol: 'cross', wiki: 'Gustavo Gutiérrez'
  },
  {
    id: 'christian-reconstructionism', name: 'Christian Reconstructionism (Theonomy)', family: 'Religious',
    coords: coords(10, 5, 75, 75, 10, 45, 90, 100, 55, 25, 100, 50, 30),
    figure: { name: 'R. J. Rushdoony', years: '1916 to 2001' },
    source: { author: 'Rousas John Rushdoony', work: 'The Institutes of Biblical Law', year: 1973 },
    tagline: 'The law of Moses as the standard for every society.',
    desc: 'Rushdoony held that all law is religious in origin and that the law given in the Old Testament, including its civil and penal provisions, remains binding on every society. The book works through the Ten Commandments as a complete legal order, with capital penalties for offences such as adultery and blasphemy. The civil state is to be small and confined to justice, while most of life is governed by the family, the church and the self governing believer. He regarded democracy and state schooling as rivals to God\'s sovereignty.',
    symbol: 'cross', wiki: 'R. J. Rushdoony'
  },
  {
    id: 'neo-calvinism', name: 'Neo Calvinism (Sphere Sovereignty)', family: 'Religious',
    coords: coords(35, 25, 35, 25, 15, 45, 25, 80, 50, 50, 90, 40, 45),
    figure: { name: 'Abraham Kuyper', years: '1837 to 1920' },
    source: { author: 'Abraham Kuyper', work: 'Sphere Sovereignty', year: 1880 },
    tagline: 'Each sphere of life answers to God, not to the state.',
    desc: 'In his address opening the Free University of Amsterdam, Kuyper argued that absolute sovereignty belongs to God alone and is delegated separately to the distinct spheres of life: family, church, science, business, art and the state. No sphere may swallow another. The state has the task of keeping the boundaries between them and protecting the weak within them, but it may not run them. From this he drew the case for schools, universities and associations free of both state and established church.',
    symbol: 'cross', wiki: 'Abraham Kuyper'
  },
  {
    id: 'political-augustinianism', name: 'Political Augustinianism', family: 'Religious',
    coords: coords(50, 35, 65, 65, 50, 20, 55, 80, 55, 50, 90, 45, 40),
    figure: { name: 'Augustine of Hippo', years: '354 to 430' },
    source: { author: 'Augustine of Hippo', work: 'The City of God', year: 'c. 413 to 426' },
    tagline: 'Two cities, formed by two loves.',
    desc: 'Written after the sack of Rome, the book divides humanity into two cities: one formed by love of God, the other by love of self and the lust to dominate. No earthly state is the city of God, and a kingdom without justice differs from a robber band only in scale. Government exists because of sin, to restrain wrongdoing and keep a limited peace, which believers should use and obey as pilgrims passing through. War may be just, but it is always a matter for grief.',
    symbol: 'cross', wiki: 'Augustine of Hippo'
  },
  {
    id: 'thomism', name: 'Thomism', family: 'Religious',
    coords: coords(45, 30, 60, 75, 60, 35, 65, 90, 55, 50, 90, 45, 40),
    figure: { name: 'Thomas Aquinas', years: 'c. 1225 to 1274' },
    source: { author: 'Thomas Aquinas', work: 'On Kingship (De Regno)', year: 'c. 1265 to 1267' },
    tagline: 'Government exists for the common good.',
    desc: 'Aquinas began from Aristotle: people are social and political by nature, so government is natural and not merely a remedy for sin. A community needs one directing power to seek the common good, and rule by one just king is best because it best secures unity and peace. Rule for private gain is tyranny, the worst of regimes, to be checked by public authority and not by private violence. Since the final end of human life is beyond this world, kings are subject in spiritual matters to the priesthood.',
    symbol: 'cross', wiki: 'Thomas Aquinas'
  },
  {
    id: 'islamic-modernism', name: 'Islamic Modernism', family: 'Religious',
    coords: coords(45, 40, 35, 25, 45, 35, 50, 40, 30, 45, 80, 45, 40),
    figure: { name: 'Muhammad Iqbal', years: '1877 to 1938' },
    source: { author: 'Muhammad Iqbal', work: 'The Reconstruction of Religious Thought in Islam', year: 1930 },
    tagline: 'Reopen the gates of independent reasoning.',
    desc: 'Iqbal argued that Islam is dynamic at its core and that its law froze only when independent reasoning, ijtihad, was abandoned. He called for that reasoning to be taken up again in the light of modern science and philosophy. The power to interpret the law, he proposed, should pass from individual jurists to an elected Muslim legislative assembly, and he judged the republican form of government to be fully in keeping with the spirit of Islam.',
    symbol: 'crescentStar', wiki: 'Muhammad Iqbal'
  },
  {
    id: 'islamic-democracy', name: 'Islamic Democracy', family: 'Religious',
    coords: coords(50, 40, 35, 15, 40, 45, 55, 80, 50, 45, 95, 35, 45),
    figure: { name: 'Rached Ghannouchi', years: 'born 1941' },
    source: { author: 'Rached Ghannouchi', work: 'Public Freedoms in the Islamic State', year: 1993 },
    tagline: 'Elections, pluralism and rights grounded in Islamic sources.',
    desc: 'Ghannouchi argued that human beings are God\'s trustees on earth, so authority belongs to the community and rulers hold office only by its consent. Consultation, shura, is binding and takes the modern form of elections, parties, a free press and the peaceful handover of power. He grounded civil liberties and the rights of non Muslim citizens in the Quran and the purposes of Islamic law, which remains the frame of reference for legislation. Against Qutb, he denied that democracy is alien to Islam.',
    symbol: 'crescentStar', wiki: 'Rached Ghannouchi'
  },
  {
    id: 'salafi-jihadism', name: 'Salafi Jihadism', family: 'Religious',
    coords: coords(50, 40, 95, 95, 70, 0, 100, 100, 55, 30, 100, 100, 25),
    figure: { name: 'Abdullah Azzam', years: '1941 to 1989' },
    source: { author: 'Abdullah Azzam; Osama bin Laden and others', work: 'Join the Caravan (1987) and the World Islamic Front statement Jihad Against Jews and Crusaders', year: 1998 },
    tagline: 'Armed struggle declared a personal duty of every believer.',
    desc: 'A violent extremist doctrine. Azzam argued that once Muslim land is occupied, armed jihad becomes an individual duty for every Muslim, needing no permission from state, parent or creditor. In 1998 bin Laden and his co signatories extended this into a ruling that killing Americans and their allies, civilians included, is a duty anywhere in the world. The movement treats existing governments and most other Muslims as illegitimate and aims at a caliphate by force. It produced al Qaeda, the attacks of 11 September 2001 and the mass killings of the Islamic State.',
    restricted: true
  },
  {
    id: 'religious-zionism', name: 'Religious Zionism', family: 'Religious',
    coords: coords(45, 40, 50, 40, 55, 95, 85, 85, 45, 45, 100, 60, 65),
    figure: { name: 'Abraham Isaac Kook', years: '1865 to 1935' },
    source: { author: 'Abraham Isaac Kook', work: 'Orot', year: 1920 },
    tagline: 'The return to the Land as the beginning of redemption.',
    desc: 'Kook taught that the Land of Israel is not an external possession of the Jewish people but part of its inner spiritual life, and that Jewish thought and holiness can be whole only there. The national revival is therefore a stage in divine redemption. Even secular pioneers who reject religion are, without knowing it, carrying out a sacred purpose by rebuilding the nation and its land. Unlike Political Zionism, which sought a refuge and a normal state, this makes the return a religious duty.',
    symbol: 'hexagram', wiki: 'Abraham Isaac Kook'
  },
  {
    id: 'engaged-buddhism', name: 'Engaged Buddhism', family: 'Religious',
    coords: coords(50, 55, 20, 15, 25, 45, 15, 50, 60, 60, 85, 0, 50),
    figure: { name: 'Thích Nhất Hạnh', years: '1926 to 2022' },
    source: { author: 'Thích Nhất Hạnh', work: 'Vietnam: Lotus in a Sea of Fire', year: 1967 },
    tagline: 'Practice that goes out to meet suffering in society.',
    desc: 'Written in the middle of the Vietnam War, the book argues that Buddhism cannot stay in the monastery while people are bombed and starved: compassion has to act in the world. Nhất Hạnh held that for most Vietnamese the war was about independence, not ideology, and that foreign firepower only strengthened the insurgency. He presented the Buddhists as a peaceful majority refusing both sides, and called for a ceasefire, an end to the bombing and the withdrawal of foreign troops.',
    symbol: 'wheel', wiki: 'Thích Nhất Hạnh'
  },
  {
    id: 'dhammic-socialism', name: 'Dhammic Socialism', family: 'Religious',
    coords: coords(65, 70, 60, 75, 50, 30, 45, 75, 75, 85, 90, 10, 50),
    figure: { name: 'Buddhadasa Bhikkhu', years: '1906 to 1993' },
    source: { author: 'Buddhadasa Bhikkhu', work: 'Dhammic Socialism', year: 1986 },
    tagline: 'Take only what you need; the rest belongs to all.',
    desc: 'In essays of the 1970s the Thai monk Buddhadasa argued that socialism is the natural state of things: in nature nothing takes more than its share, and the early Buddhist community lived the same way. Hoarding a surplus is the root of social disorder. He set this against both capitalism and Marxism, which he saw as driven by greed and class revenge. He also distrusted liberal democracy as licence for selfish desire, and preferred firm rule by a leader bound by the ten virtues of a Buddhist king.',
    symbol: 'wheel', wiki: 'Ajahn Buddhadasa'
  },
  {
    id: 'integral-humanism', name: 'Integral Humanism', family: 'Religious',
    coords: coords(50, 40, 55, 35, 45, 90, 85, 85, 65, 55, 75, 50, 80),
    figure: { name: 'Deendayal Upadhyaya', years: '1916 to 1968' },
    source: { author: 'Deendayal Upadhyaya', work: 'Integral Humanism', year: 1965 },
    tagline: 'Body, mind, intellect and soul, for the person and the nation alike.',
    desc: 'In four lectures given in Bombay, Upadhyaya rejected capitalism and communism alike as Western systems that see only one part of the human being. A person is body, mind, intellect and soul together, and society must serve all four aims of life recognised in Hindu thought. Each nation has its own soul, and India must build on its own culture and not on borrowed models. Dharma stands above the state and above majorities. He favoured a decentralised, self reliant economy of small producers with work for all.',
    wiki: 'Deendayal Upadhyaya'
  },
  {
    id: 'anabaptist-pacifism', name: 'Anabaptist Pacifism', family: 'Religious',
    coords: coords(50, 50, 15, 25, 0, 0, 30, 90, 70, 55, 100, 0, 30),
    figure: { name: 'Michael Sattler', years: 'c. 1490 to 1527' },
    source: { author: 'Michael Sattler and the Swiss Brethren', work: 'The Schleitheim Confession', year: 1527 },
    tagline: 'A church apart, without sword or oath.',
    desc: 'Seven articles agreed by Swiss Anabaptists. The church is a voluntary body of adult believers who govern themselves, choose their own pastors and discipline members only by exclusion. Believers must separate from the world. The sword is ordained by God to punish the wicked, but it lies outside the perfection of Christ, so a Christian may not bear arms, serve as a magistrate or sit in judgement. Oaths are forbidden. Unlike Tolstoy, the text does not call for the state to be abolished, only for believers to stand apart from it.',
    symbol: 'cross', wiki: 'Michael Sattler'
  },
  {
    id: 'social-gospel', name: 'Social Gospel', family: 'Religious',
    coords: coords(60, 60, 30, 10, 45, 40, 40, 55, 40, 45, 80, 30, 50),
    figure: { name: 'Walter Rauschenbusch', years: '1861 to 1918' },
    source: { author: 'Walter Rauschenbusch', work: 'Christianity and the Social Crisis', year: 1907 },
    tagline: 'The Kingdom of God as a just social order on earth.',
    desc: 'Rauschenbusch argued that the Hebrew prophets and Jesus were concerned with the life of the community, and that the Kingdom of God means the transformation of society, not only the rescue of individual souls. The church lost this purpose over the centuries. Industrial capitalism, built on competition and the wage system, was producing a crisis that Christians had to answer by siding with the working class. He supported trade unions, cooperatives and public ownership of natural monopolies.',
    symbol: 'cross', wiki: 'Walter Rauschenbusch'
  },
  {
    id: 'christian-realism', name: 'Christian Realism', family: 'Religious',
    coords: coords(55, 50, 45, 15, 50, 35, 35, 40, 45, 45, 65, 60, 45),
    figure: { name: 'Reinhold Niebuhr', years: '1892 to 1971' },
    source: { author: 'Reinhold Niebuhr', work: 'Moral Man and Immoral Society', year: 1932 },
    tagline: 'Individuals can be unselfish; groups rarely are.',
    desc: 'Niebuhr argued that individuals are capable of putting others first, but nations, classes and races act from collective self interest that reason and goodwill cannot dissolve. Justice between groups is therefore won by setting power against power, and some coercion is unavoidable in politics. He criticised both secular and religious liberals for trusting education and moral appeal, and denied that there is a clean line between violent and non violent pressure. The aim is not a perfect society but enough justice to prevent disaster.',
    symbol: 'cross', wiki: 'Reinhold Niebuhr'
  },
  {
    id: 'aristotelian-polity', name: 'Aristotelian Polity', family: 'Classical',
    coords: coords(40, 30, 50, 40, 35, 60, 75, 75, 55, 50, 45, 50, 50),
    figure: { name: 'Aristotle', years: '384 to 322 BC' },
    source: { author: 'Aristotle', work: 'Politics', year: '4th century BC' },
    tagline: 'A mixed constitution resting on a strong middle class.',
    desc: 'Aristotle held that humans are political animals and that the city exists not just for survival but for the good life. Constitutions are sound when rulers serve the common interest and corrupt when they serve themselves. The best that most cities can achieve is polity, a blend of oligarchy and democracy in which a large middle class holds the balance and law rules over men. Against Plato he defended private property put to common use. He also accepted slavery and limited citizenship to free men.',
    symbol: 'column', wiki: 'Aristotle'
  },
  {
    id: 'stoic-cosmopolitanism', name: 'Stoic Cosmopolitanism', family: 'Classical',
    coords: coords(50, 40, 50, 60, 50, 0, 30, 65, 55, 65, 55, 40, 20),
    figure: { name: 'Marcus Aurelius', years: '121 to 180' },
    source: { author: 'Marcus Aurelius', work: 'Meditations', year: 'c. 170 to 180' },
    tagline: 'All rational beings are citizens of one city.',
    desc: 'In notes written to himself while emperor, Marcus Aurelius reasons that all humans share in reason, reason gives a common law, and so the whole world is a single city of which everyone is a citizen. People are made for cooperation, like the parts of one body, and what does not benefit the whole cannot benefit the part. Each must do the duty of the station he is given, without anger at others and in accord with nature. He names as his ideal a state with one law for all and a ruler who respects the freedom of the governed.',
    symbol: 'column', wiki: 'Marcus Aurelius'
  },
  {
    id: 'machiavellian-republicanism', name: 'Machiavellian Republicanism', family: 'Classical',
    coords: coords(40, 30, 50, 30, 55, 85, 70, 55, 45, 30, 30, 90, 60),
    figure: { name: 'Niccolò Machiavelli', years: '1469 to 1527' },
    source: { author: 'Niccolò Machiavelli', work: 'Discourses on Livy', year: 1531 },
    tagline: 'A free republic kept alive by conflict, law and its own arms.',
    desc: 'Reading the history of Rome, Machiavelli concluded that republics are stronger and more lasting than principalities, and that the people are safer guardians of liberty than the nobles. The quarrels between plebeians and senate, far from weakening Rome, produced the laws that kept it free. A republic needs a mixed constitution, citizens who fight in their own armies instead of mercenaries, and a civic religion that binds them to the common good. It must expand or decay, and be pulled back to its founding principles from time to time.',
    symbol: 'column', wiki: 'Niccolò Machiavelli'
  },
  {
    id: 'legalism', name: 'Legalism', family: 'Classical',
    coords: coords(70, 45, 100, 100, 100, 70, 90, 25, 40, 20, 5, 90, 85),
    figure: { name: 'Han Fei', years: 'c. 280 to 233 BC' },
    source: { author: 'Han Fei', work: 'Han Feizi', year: 'mid 3rd century BC' },
    tagline: 'Rule by law, reward and punishment, not by virtue.',
    desc: 'Han Fei held that people follow their own interest, so a state built on the virtue of rulers or subjects is built on sand. Order comes from clear public laws applied to high and low alike, enforced by the two handles of reward and punishment. The ruler keeps his position by holding these himself, hiding his intentions, and judging ministers strictly by whether results match their words. Farming and war make the state strong; scholars who praise the past, private swordsmen and merchants weaken it and should be curbed.',
    symbol: 'scales', wiki: 'Han Fei'
  },
  {
    id: 'mohism', name: 'Mohism', family: 'Classical',
    coords: coords(60, 45, 65, 75, 80, 10, 60, 30, 50, 40, 65, 15, 35),
    figure: { name: 'Mozi', years: 'c. 470 to 391 BC' },
    source: { author: 'Mozi and his school', work: 'Mozi', year: '5th to 3rd century BC' },
    tagline: 'Impartial care for all, and an end to wars of aggression.',
    desc: 'The Mohists taught that disorder comes from partiality: caring for one\'s own family and state at the expense of others. The cure is impartial care for everyone, judged by what benefits the people. They condemned offensive war as mass murder while training to defend cities under attack. Office should go to the able whatever their birth, and all should conform their standards to those of their superiors, up to the ruler and to Heaven. They attacked lavish funerals, court music and fatalism as waste.',
    wiki: 'Mozi'
  },
  {
    id: 'daoism', name: 'Daoism', family: 'Classical',
    coords: coords(25, 45, 10, 55, 0, 15, 35, 60, 95, 90, 50, 5, 80),
    figure: { name: 'Laozi', years: 'c. 6th century BC (traditional)' },
    source: { author: 'Attributed to Laozi', work: 'Tao Te Ching', year: 'c. 4th century BC' },
    tagline: 'Govern by not interfering.',
    desc: 'Read as a book of government, the Tao Te Ching advises the ruler to act as little as possible and let things follow their natural course. The more laws and prohibitions there are, the poorer and more unruly the people become; the best ruler is one whose subjects barely know he exists. Weapons are instruments of ill omen, to be used only when there is no choice. Its ideal is a small country with few people, who have labour saving tools but do not use them and are content never to visit the next village.',
    wiki: 'Laozi'
  },
  {
    id: 'kautilyan-statecraft', name: 'Kautilyan Statecraft', family: 'Classical',
    coords: coords(65, 50, 90, 95, 90, 65, 55, 70, 45, 35, 40, 85, 65),
    figure: { name: 'Kautilya (Chanakya)', years: 'c. 4th century BC (traditional)' },
    source: { author: 'Attributed to Kautilya', work: 'Arthashastra', year: 'c. 2nd century BC to 3rd century AD' },
    tagline: 'The science of acquiring and keeping the earth.',
    desc: 'A manual for a king. The state has seven limbs, from ruler and ministers to treasury, army and allies, and the king\'s own good lies in the welfare of his subjects. He rules through a large administration that runs mines, trade and farms, fixes penalties in detail and watches officials and people through networks of spies. Abroad, every neighbour is a natural enemy and the neighbour\'s neighbour a natural ally, and the king chooses between peace, war, waiting and intrigue by cold advantage. Scholars now date the text well after the minister it is named for.',
    symbol: 'crown', wiki: 'Chanakya'
  },
  {
    id: 'hobbesian-absolutism', name: 'Hobbesian Absolutism', family: 'Classical',
    coords: coords(40, 25, 100, 95, 100, 50, 70, 50, 40, 30, 25, 60, 45),
    figure: { name: 'Thomas Hobbes', years: '1588 to 1679' },
    source: { author: 'Thomas Hobbes', work: 'Leviathan', year: 1651 },
    tagline: 'Without a common power, a war of all against all.',
    desc: 'Hobbes argued that people are roughly equal in strength and wants, so without a power to overawe them they live in constant fear and conflict. Reason tells them to give up their natural liberty by covenant and authorise a sovereign to act for all. That sovereign, whether one man or an assembly, must be absolute and undivided: it makes the law, judges disputes, and decides which doctrines and what worship are allowed. Subjects may not resist it, except to save their own lives. Authority rests on consent and fear, not on divine appointment.',
    symbol: 'crown', wiki: 'Thomas Hobbes'
  },
  {
    id: 'rousseauian-republicanism', name: 'Rousseauian Republicanism', family: 'Classical',
    coords: coords(45, 45, 45, 5, 40, 75, 85, 60, 60, 55, 50, 50, 60),
    figure: { name: 'Jean-Jacques Rousseau', years: '1712 to 1778' },
    source: { author: 'Jean-Jacques Rousseau', work: 'The Social Contract', year: 1762 },
    tagline: 'Man is born free, and everywhere he is in chains.',
    desc: 'Rousseau held that legitimate authority comes only from a pact in which each person gives himself wholly to the community and obeys laws he has helped to make. Sovereignty belongs to the people as a body, expresses the general will, and can be neither divided nor handed to representatives; citizens must vote the laws in person, which suits small states. Whoever refuses the general will may be compelled to obey it. He wanted no citizen rich enough to buy another, and a simple civil religion to bind citizens to their duties.',
    symbol: 'torch', wiki: 'Jean-Jacques Rousseau'
  },
  {
    id: 'montesquieuan-constitutionalism', name: 'Montesquieuan Constitutionalism', family: 'Classical',
    coords: coords(25, 20, 15, 40, 25, 45, 45, 55, 45, 40, 35, 35, 40),
    figure: { name: 'Montesquieu', years: '1689 to 1755' },
    source: { author: 'Montesquieu', work: 'The Spirit of the Laws', year: 1748 },
    tagline: 'Power must be arranged so that power checks power.',
    desc: 'Montesquieu defined political liberty as the security of living under law, and held that anyone with power will abuse it unless another power stands in the way. Legislative, executive and judicial power must therefore sit in different hands, as he believed they did in England. Moderate government also depends on intermediate bodies such as nobility, courts and towns, which stand between ruler and subject. Laws should fit the climate, customs and commerce of each people, and commerce itself softens manners and inclines nations to peace.',
    symbol: 'scales', wiki: 'Montesquieu'
  },
  {
    id: 'morean-utopianism', name: 'Morean Utopianism', family: 'Classical',
    coords: coords(90, 100, 75, 35, 55, 40, 85, 65, 50, 45, 55, 30, 80),
    figure: { name: 'Thomas More', years: '1478 to 1535' },
    source: { author: 'Thomas More', work: 'Utopia', year: 1516 },
    tagline: 'An island with no money and no private property.',
    desc: 'More\'s traveller describes an island commonwealth where all goods are held in common, money is abolished and gold is used for chamber pots. Everyone works six hours a day at farming and a trade, cities are built to one plan, and households elect the magistrates who choose a prince for life. Daily life is closely regulated: dress is uniform, travel needs a permit and serious offenders become slaves. Most religions are tolerated, and war is despised and left to mercenaries where possible. More presents the scheme through a narrator and voices his own doubts about it.',
    wiki: 'Thomas More'
  },
  {
    id: 'digger-communism', name: 'Digger Communism', family: 'Classical',
    coords: coords(85, 100, 40, 10, 35, 35, 45, 45, 50, 60, 60, 20, 60),
    figure: { name: 'Gerrard Winstanley', years: '1609 to 1676' },
    source: { author: 'Gerrard Winstanley', work: 'The Law of Freedom in a Platform', year: 1652 },
    tagline: 'The earth held in common, with no buying and selling.',
    desc: 'Addressed to Oliver Cromwell after the Digger colonies had been broken up, the book sets out a commonwealth in which land is held in common and buying, selling and working for hire are abolished. Each household keeps its own home and goods, works at farming or a trade, and draws what it needs from public storehouses. All officers, up to parliament, are chosen every year by the men of the commonwealth. Winstanley argued from scripture that true freedom is free use of the earth, and he attacked landlords, lawyers and a paid clergy.',
    wiki: 'Gerrard Winstanley'
  },

  /* -------------------------------- MEME -------------------------------- */
  /* Joke ideologies from political compass meme culture. The first two have
     no founding text at all, so they carry a note instead of a source. */
  {
    id: 'neo-libertarian-falangism', name: 'Neo Libertarian Falangism', family: 'Meme',
    coords: coords(10, 10, 60, 75, 70, 95, 90, 90, 45, 30, 90, 80, 50),
    figure: { name: 'Internet Meme', years: 'no founder' },
    source: { note: 'No founding text. This is an internet joke ideology, built by bolting free market libertarianism onto Falangism.' },
    tagline: 'Deregulate everything, for the unity of destiny.',
    desc: 'A deliberate contradiction. Real Falangism wants a national syndicalist economy with nationalised banking, and real libertarianism rejects the authoritarian nation state. This mash up keeps the Falangist nation, Catholic identity and strongman while swapping the syndicates for free markets and low taxes. If you land here, you scored strongly nationalist, religious and pro market all at once.'
  },
  {
    id: 'monarcho-brezhnevism', name: 'Monarcho Brezhnevism', family: 'Meme',
    coords: coords(95, 95, 85, 100, 100, 55, 60, 70, 60, 20, 30, 80, 85),
    figure: { name: 'Internet Meme', years: 'no founder' },
    source: { note: 'No founding text. This is an internet joke ideology that crowns the Soviet General Secretary.' },
    tagline: 'A hereditary throne atop a five year plan.',
    desc: 'Takes the late Soviet system of the Brezhnev years, with its planned economy, ageing leadership and preference for stability over reform, and makes the top job hereditary. The joke is that the two are closer than they look. If you land here, you scored for full state planning under a ruler nobody elects, with little appetite for change.'
  },
  {
    id: 'anarcho-monarchism', name: 'Anarcho Monarchism', family: 'Meme',
    coords: coords(30, 30, 5, 60, 5, 45, 55, 95, 95, 85, 90, 20, 45),
    figure: { name: 'J. R. R. Tolkien', years: '1892 to 1973' },
    source: { author: 'J. R. R. Tolkien', work: 'Letter to Christopher Tolkien, 29 November', year: 1943 },
    tagline: 'A king who leaves everyone alone.',
    desc: 'Usually treated as a joke, but it has a real source. Tolkien wrote that his politics leaned toward anarchy, meaning the abolition of control, or else toward unconstitutional monarchy. The idea is a crown that exists as a symbol and a last resort while daily life is left ungoverned, rural and traditional, with deep suspicion of machines and planners.'
  },
  {
    id: 'posadism', name: 'Posadism', family: 'Meme',
    coords: coords(100, 100, 85, 80, 90, 0, 20, 15, 0, 10, 0, 100, 40),
    figure: { name: 'J. Posadas', years: '1912 to 1981' },
    source: { author: 'J. Posadas', work: 'Flying Saucers, the Process of Matter and Energy, Science, the Revolutionary and Working Class Struggle and the Socialist Future of Mankind', year: 1968 },
    tagline: 'Nuclear war, then socialism, then the aliens.',
    desc: 'A real Trotskyist current that the internet adopted as a meme. Posadas argued that nuclear war was inevitable and that the workers\' states should not fear it, since socialism would be built on the ruins. He also reasoned that any civilisation able to cross space must already be socialist, so visiting aliens would be allies.'
  },
  {
    id: 'luxury-space-communism', name: 'Fully Automated Luxury Communism', family: 'Meme',
    coords: coords(90, 100, 10, 10, 50, 0, 5, 0, 0, 35, 0, 15, 40),
    figure: { name: 'Aaron Bastani', years: 'born 1984' },
    source: { author: 'Aaron Bastani', work: 'Fully Automated Luxury Communism', year: 2019 },
    tagline: 'Robots do the work. Everyone gets the good life.',
    desc: 'Began as a slogan and a meme, often with the words gay and space added, before Bastani wrote it up as a manifesto. It claims that automation, cheap solar energy, asteroid mining and synthetic food can end scarcity. If the machines are owned in common, the result is abundance and leisure for all instead of mass unemployment.'
  }
];
