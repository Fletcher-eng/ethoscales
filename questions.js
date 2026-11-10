/* ==========================================================================
   AXIOMVALUES // ETHOSSCALES
   questions.js : the master bank of 18 situational dilemmas
   --------------------------------------------------------------------------
   effects: how much a full "Strongly Agree" (+1.0) moves each axis.
     positive value = pushes toward the 100 pole (planned, authority,
                      precautionary, localist, rigid, deep ecology)
     negative value = pushes toward the 0 pole   (market, autonomy,
                      accelerationist, cosmopolitan, fluid, industrial)
   quick: true marks the 12 questions used by the Quick Snapshot mode.
          The subset is chosen so that every axis still gets at least
          four questions worth of signal.
   ========================================================================== */

const RESPONSES = [
  { label: 'Strongly Agree', weight: 1.0, key: '1' },
  { label: 'Agree', weight: 0.5, key: '2' },
  { label: 'Neutral / Unsure', weight: 0.0, key: '3' },
  { label: 'Disagree', weight: -0.5, key: '4' },
  { label: 'Strongly Disagree', weight: -1.0, key: '5' }
];

const QUESTIONS = [
  {
    id: 1,
    quick: true,
    text: 'State agencies should mandate open-source protocols for high-level Artificial Intelligence, even if it accelerates dangerous proliferation.',
    effects: { tech: -2.0, gov: -1.0, struct: -1.5 }
  },
  {
    id: 2,
    quick: false,
    text: 'Critical energy and industrial infrastructure should be nationalized and managed by automated state systems.',
    effects: { econ: 2.0, gov: 1.5, tech: -1.0 }
  },
  {
    id: 3,
    quick: true,
    text: 'Individual citizens should have the absolute legal right to cryptographically conceal all personal assets and economic transactions from tax authorities.',
    effects: { econ: -2.0, gov: -2.0, struct: -1.5 }
  },
  {
    id: 4,
    quick: true,
    text: 'Global environmental quotas must be enforced by an international governing body with authority to levy military and economic sanctions.',
    effects: { eco: 2.0, gov: 1.5, struct: -1.0, cult: -1.0 }
  },
  {
    id: 5,
    quick: true,
    text: 'Communities should retain the sovereign authority to enforce traditional social norms and restrict public speech that undermines local heritage.',
    effects: { cult: 2.0, gov: 1.0, struct: 1.5 }
  },
  {
    id: 6,
    quick: true,
    text: 'Physical borders should be replaced by dynamic, opt-in digital jurisdictions and private network state passports.',
    effects: { struct: -2.0, cult: -1.5, gov: -1.0 }
  },
  {
    id: 7,
    quick: true,
    text: 'Human genetic modification and neural enhancements should be completely unregulated and left to private market adoption.',
    effects: { tech: -2.0, econ: -1.5, cult: -1.0 }
  },
  {
    id: 8,
    quick: false,
    text: 'The primary obligation of an economic system is to preserve national industrial sovereignty, even if consumer costs rise sharply.',
    effects: { econ: 1.0, struct: 2.0, cult: 1.5 }
  },
  {
    id: 9,
    quick: false,
    text: 'Labor unions and worker cooperatives should legally hold controlling shares in all commercial enterprises operating over 50 employees.',
    effects: { econ: 2.0, gov: -0.5, struct: -1.0 }
  },
  {
    id: 10,
    quick: true,
    text: 'Industrial production must be intentionally de-growth scaled, even if standard economic growth metrics collapse.',
    effects: { eco: 2.0, tech: 1.5, econ: 1.0 }
  },
  {
    id: 11,
    quick: true,
    text: 'A strong central executive authority is essential to suppress civil disorder and maintain social continuity during existential crises.',
    effects: { gov: 2.0, struct: 1.5, cult: 1.0 }
  },
  {
    id: 12,
    quick: false,
    text: 'Monetary policy should be governed exclusively by algorithmic code with fixed issuance caps rather than central banks.',
    effects: { econ: -1.5, gov: -1.5, tech: -1.0 }
  },
  {
    id: 13,
    quick: true,
    text: 'Subsidized technological automation should replace manual human labor in every sector where it is engineering-feasible.',
    effects: { tech: -1.5, eco: -1.0, econ: 0.5 }
  },
  {
    id: 14,
    quick: false,
    text: 'Cultural preservation takes priority over economic globalism or foreign labor integration.',
    effects: { cult: 2.0, struct: 1.5, econ: 0.5 }
  },
  {
    id: 15,
    quick: true,
    text: 'Land and natural resources should be owned collectively by local eco-communes rather than private entities or central governments.',
    effects: { econ: 1.5, gov: -1.5, eco: 1.5, struct: -1.5 }
  },
  {
    id: 16,
    quick: true,
    text: 'Private corporations should be permitted to establish autonomous sovereign enterprise zones with their own police and judicial systems.',
    effects: { econ: -2.0, gov: 1.0, struct: -2.0 }
  },
  {
    id: 17,
    quick: true,
    text: 'Scientific progress must be strictly regulated by ethical bio-panels to prevent post-human degradation.',
    effects: { tech: 2.0, gov: 1.0, cult: 1.0 }
  },
  {
    id: 18,
    quick: false,
    text: 'Central state planning has proven fundamentally inefficient compared to decentralized price-signal networks.',
    effects: { econ: -2.0, gov: -1.0 }
  }
];
