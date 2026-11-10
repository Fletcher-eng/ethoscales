/* ==========================================================================
   AXIOMVALUES // ETHOSSCALES
   ideologies.js : axis definitions + the 15 archetype coordinate matrix
   --------------------------------------------------------------------------
   Every axis runs from 0 to 100.
     0   = the "low" pole  (first label, first color)
     100 = the "high" pole (second label, second color)
   ========================================================================== */

const AXES = [
  {
    key: 'econ',
    param: 'e',
    name: 'Economic',
    low: { label: 'Decentralized / Market', short: 'Market', color: '#00E5FF' },
    high: { label: 'Centralized / Planned', short: 'Planned', color: '#FF1744' }
  },
  {
    key: 'gov',
    param: 'g',
    name: 'Governance',
    low: { label: 'Autonomy / Anarchic', short: 'Autonomy', color: '#76FF03' },
    high: { label: 'Authority / State', short: 'Authority', color: '#D500F9' }
  },
  {
    key: 'tech',
    param: 't',
    name: 'Technological',
    low: { label: 'Accelerationist / Transhuman', short: 'Accelerationist', color: '#2979FF' },
    high: { label: 'Precautionary / Bioconservative', short: 'Precautionary', color: '#FFC400' }
  },
  {
    key: 'cult',
    param: 'c',
    name: 'Cultural',
    low: { label: 'Cosmopolitan / Progressive', short: 'Cosmopolitan', color: '#F50057' },
    high: { label: 'Localist / Traditional', short: 'Localist', color: '#00B0FF' }
  },
  {
    key: 'struct',
    param: 's',
    name: 'Structural',
    low: { label: 'Fluid / Network State', short: 'Fluid', color: '#1DE9B6' },
    high: { label: 'Rigid / Nation State', short: 'Rigid', color: '#FF3D00' }
  },
  {
    key: 'eco',
    param: 'ec',
    name: 'Ecological',
    low: { label: 'Anthropocentric / Industrial', short: 'Industrial', color: '#9E9E9E' },
    high: { label: 'Deep Ecology / Green', short: 'Deep Ecology', color: '#00C853' }
  }
];

const IDEOLOGIES = [
  {
    id: 'third-position',
    name: 'Third Position',
    coords: { econ: 50, gov: 90, tech: 50, cult: 95, struct: 95, eco: 40 },
    tagline: 'Syncretic economics, extreme statism, radical traditionalism, rigid nationalism.',
    desc: 'Rejects both liberal capitalism and Marxist socialism in favor of a corporatist economy that is subordinate to the nation. The state is treated as the organic expression of a single people, so hierarchy, tradition and hard borders outrank individual rights and market outcomes.'
  },
  {
    id: 'solarpunk-anarchist',
    name: 'Solarpunk Anarchist',
    coords: { econ: 10, gov: 10, tech: 30, cult: 10, struct: 10, eco: 95 },
    tagline: 'Decentralized eco-socialism, anti-state, ecological harmony.',
    desc: 'Imagines a world of federated communes, repair culture and renewable abundance. Technology is welcome when it is open, appropriate in scale and in service of living systems. Authority is dissolved into voluntary cooperation and the biosphere is treated as a partner, never as raw material.'
  },
  {
    id: 'neo-cameralist',
    name: 'Neo-Cameralist (NRx)',
    coords: { econ: 15, gov: 95, tech: 10, cult: 85, struct: 20, eco: 20 },
    tagline: 'Sovereign corporate state, extreme authority, tech acceleration, anti-democracy.',
    desc: 'Treats the state as a joint stock company run by a CEO sovereign who answers to shareholders, not voters. Democracy is viewed as a failed operating system. Order comes from absolute ownership, and freedom comes from the right to exit toward a better run competitor.'
  },
  {
    id: 'techno-syndicalist',
    name: 'Techno-Syndicalist',
    coords: { econ: 85, gov: 30, tech: 5, cult: 15, struct: 25, eco: 60 },
    tagline: 'Worker-controlled automated production, decentralized governance, high tech.',
    desc: 'Wants the machines owned by the people who run them. Federated unions and cooperatives plan production with automation and open data, replacing both the boss and the bureaucrat. Full automation is the path to shorter work weeks and shared surplus.'
  },
  {
    id: 'eco-authoritarian',
    name: 'Eco-Authoritarian',
    coords: { econ: 75, gov: 90, tech: 60, cult: 50, struct: 85, eco: 95 },
    tagline: 'State-enforced ecological rationing, strict industrial containment.',
    desc: 'Holds that the climate and biodiversity crises are too urgent for consent based politics. A strong state must ration carbon, cap consumption and contain industry by force if needed. Planetary survival is the supreme law and personal liberty is negotiable.'
  },
  {
    id: 'democratic-transhumanist',
    name: 'Democratic Transhumanist',
    coords: { econ: 60, gov: 40, tech: 0, cult: 10, struct: 40, eco: 50 },
    tagline: 'State-funded technological augmentation, egalitarian access, progressive.',
    desc: 'Believes humans should be free to upgrade their bodies and minds, and that nobody should be priced out of doing so. Public funding and democratic oversight keep enhancement from becoming a luxury caste system. Morphological freedom is treated as a civil right.'
  },
  {
    id: 'cyber-libertarian',
    name: 'Cyber-Libertarian',
    coords: { econ: 5, gov: 15, tech: 5, cult: 30, struct: 10, eco: 15 },
    tagline: 'Cypherpunk ethics, crypto-economics, minimal state interference.',
    desc: 'Trusts math over ministers. Strong encryption, open protocols and permissionless money shift power from institutions to individuals. The ideal state is small enough to be routed around, and code is the most reliable form of law.'
  },
  {
    id: 'anarcho-distributist',
    name: 'Anarcho-Distributist',
    coords: { econ: 30, gov: 5, tech: 65, cult: 80, struct: 15, eco: 70 },
    tagline: 'Widespread micro-property ownership, anti-statist, traditional communal ethics.',
    desc: 'Wants as many people as possible to own their own land, tools and workshop. Opposes both big government and big business as twin engines of dependency. Family, parish and village provide the moral order that a distant state never could.'
  },
  {
    id: 'state-technocracy',
    name: 'State Technocracy',
    coords: { econ: 80, gov: 85, tech: 15, cult: 40, struct: 80, eco: 40 },
    tagline: 'Expert-led centralized planning, algorithmic governance, strong state.',
    desc: 'Argues that complex societies should be steered by engineers, scientists and data, not by popularity contests. Central planning is upgraded with sensors, models and optimization. Legitimacy comes from measurable results instead of ideology.'
  },
  {
    id: 'network-state-localist',
    name: 'Network State Localist',
    coords: { econ: 20, gov: 25, tech: 10, cult: 50, struct: 5, eco: 35 },
    tagline: 'Opt-in digital jurisdictions, physical enclave nodes, decentralized sovereignty.',
    desc: 'Starts with an online community, crowdfunds territory and eventually negotiates recognition. Citizenship is a subscription you can cancel. Geography becomes a set of connected enclaves and the nation becomes something you choose.'
  },
  {
    id: 'post-left-anarchist',
    name: 'Post-Left Anarchist',
    coords: { econ: 40, gov: 0, tech: 75, cult: 20, struct: 0, eco: 80 },
    tagline: 'Critique of the organizational state and formal leftist dogmas, radical individual autonomy.',
    desc: 'Breaks with the traditional left over its love of organizations, work and ideology. Rejects the state, the party and the mass movement alike. Favors direct personal autonomy, informal affinity groups and deep suspicion of industrial civilization.'
  },
  {
    id: 'classical-social-democrat',
    name: 'Classical Social Democrat',
    coords: { econ: 70, gov: 50, tech: 40, cult: 25, struct: 70, eco: 60 },
    tagline: 'Regulated market economy, strong welfare state, democratic governance.',
    desc: 'Keeps markets but tames them with unions, progressive taxes and universal public services. Change comes through elections and institutions, never through rupture. The goal is a society where your starting point does not decide your ending point.'
  },
  {
    id: 'national-conservative',
    name: 'National Conservative',
    coords: { econ: 45, gov: 75, tech: 60, cult: 90, struct: 95, eco: 30 },
    tagline: 'Protected national economy, strong sovereign state, traditional values.',
    desc: 'Puts the nation state, its borders and its inherited culture ahead of global markets and universal ideologies. Supports tariffs and industrial policy when they protect domestic workers. Sees family, faith and national identity as the foundations of freedom.'
  },
  {
    id: 'left-accelerationist',
    name: 'Left-Accelerationist (L/Acc)',
    coords: { econ: 90, gov: 45, tech: 0, cult: 5, struct: 30, eco: 30 },
    tagline: 'Using capitalist technology to surpass capitalism toward post-scarcity.',
    desc: 'Wants to seize the platforms, logistics and automation that capitalism built and point them at a world beyond work. Demands full automation, universal income and collective ownership of the machines. The only way out is through.'
  },
  {
    id: 'agorist',
    name: 'Agorist / Counter-Economist',
    coords: { econ: 0, gov: 0, tech: 20, cult: 40, struct: 5, eco: 30 },
    tagline: 'Black and grey market economic activity to render the state obsolete.',
    desc: 'Skips the ballot box and builds the alternative directly. Every untaxed, unlicensed peaceful trade starves the state and feeds a parallel free economy. Revolution is something you do quietly at the market, one transaction at a time.'
  }
];
