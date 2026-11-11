/* ==========================================================================
   ETHOSSCALES
   questions.js : the bank of 60 statements, five led by each of the 12 axes
   --------------------------------------------------------------------------
   effects: how much a full "Strongly Agree" (+1.0) moves each axis.
     positive value = pushes toward the 100 pole (planned, collective,
       security, autocracy, centralised, nationalist, assimilation,
       traditional, precautionary, deep ecology, religious, militarist)
     negative value = pushes toward the 0 pole   (market, private, liberty,
       democracy, decentralised, internationalist, multicultural,
       progressive, accelerationist, industrial, secular, pacifist)
   The first axis listed in effects is the lead axis. It sets the color
   and shape of the question.
   quick: true marks the 24 statements used by the Quick test. Every axis
   leads two of them, one pushing each way.
   ========================================================================== */

const RESPONSES = [
  { label: 'Strongly Agree', weight: 1.0, key: '1' },
  { label: 'Agree', weight: 0.5, key: '2' },
  { label: 'Neutral / Unsure', weight: 0.0, key: '3' },
  { label: 'Disagree', weight: -0.5, key: '4' },
  { label: 'Strongly Disagree', weight: -1.0, key: '5' }
];

/* Grouped by lead axis here so the bank is easy to audit.
   QUESTIONS (below) interleaves them so the test never asks two in a row
   about the same axis. */
const QUESTION_BANK = [
  /* ------------------------------ ECONOMY ------------------------------ */
  { quick: true, text: 'Free markets run an economy better than government planners ever could.',
    effects: { econ: -2.0, struct: -1.0 } },
  { quick: true, text: 'The government should own the power grid and heavy industry, and run them with automated systems.',
    effects: { econ: 2.0, own: 1.5, struct: 1.0, tech: -1.0 } },
  { text: 'Money should be run by fixed computer code with a hard limit on supply, like Bitcoin, not by central banks.',
    effects: { econ: -1.5, struct: -1.5, tech: -1.0 } },
  { text: 'During any shortage, the state should set the prices of essentials such as food, rent and energy.',
    effects: { econ: 2.0, own: 0.5 } },
  { text: 'Tariffs and import quotas cost ordinary people more than the industries they protect are worth.',
    effects: { econ: -1.5, nation: -1.5 } },

  /* ----------------------------- OWNERSHIP ----------------------------- */
  { quick: true, text: 'By law, the workers should hold the controlling share of any company with more than 50 employees.',
    effects: { own: 2.0, econ: 1.0, rule: -0.5 } },
  { quick: true, text: 'Someone who builds a company from nothing has the moral right to pass all of it to their children untaxed.',
    effects: { own: -2.0, cult: 0.5 } },
  { text: 'Land and natural resources should belong to the local community that lives on them, not to private owners or the national government.',
    effects: { own: 2.0, struct: -1.5, eco: 1.5 } },
  { text: 'Owning something should require actually using or occupying it. Absentee landlords and idle shareholders have no real claim.',
    effects: { own: 1.5, econ: 0.5 } },
  { text: 'Companies should be allowed to run their own self governing zones, with their own police and courts.',
    effects: { own: -2.0, struct: -1.5, rule: 1.0, nation: -1.0 } },

  /* ------------------------------- RIGHTS ------------------------------- */
  { quick: true, text: 'People should have the legal right to hide all their money and payments from the tax office using encryption.',
    effects: { rights: -2.0, econ: -1.5, struct: -1.0 } },
  { quick: true, text: 'Police should be able to use facial recognition in every public space if it measurably reduces violent crime.',
    effects: { rights: 2.0, tech: -0.5 } },
  { text: 'In a crisis that threatens the country, a strong leader must be able to put down unrest and keep order.',
    effects: { rights: 1.5, rule: 2.0, struct: 1.0 } },
  { text: 'Adults should be free to use any drug, however dangerous, without legal penalty.',
    effects: { rights: -2.0, cult: -1.0 } },
  { text: 'Speech that insults a religion or a nation should stay legal, even when it causes public outrage.',
    effects: { rights: -2.0, relig: -1.0, nation: -0.5 } },

  /* -------------------------------- RULE -------------------------------- */
  { quick: true, text: 'A capable leader who answers to no parliament will govern better than any elected assembly.',
    effects: { rule: 2.0, struct: 1.0 } },
  { quick: true, text: 'Major laws should be decided directly by citizens in referendums, not by representatives.',
    effects: { rule: -2.0, struct: -0.5 } },
  { text: 'Voting should be restricted to people who pass a test of civic and economic knowledge.',
    effects: { rule: 1.5 } },
  { text: 'A country should be run like a company, with a chief executive who answers to its owners and not to voters.',
    effects: { rule: 2.0, own: -1.0, econ: -1.0 } },
  { text: 'Councils elected in each workplace should hold political power in place of a professional parliament.',
    effects: { rule: -1.5, own: 1.5, struct: -1.0 } },

  /* ------------------------------ STRUCTURE ----------------------------- */
  { quick: true, text: 'A region should be able to leave its country by a simple majority vote of its residents.',
    effects: { struct: -2.0, nation: -1.0 } },
  { quick: true, text: 'One national standard for schools, policing and healthcare is better than letting each region set its own.',
    effects: { struct: 2.0 } },
  { text: 'Employers and workers in each industry should be organised into one state recognised body that settles wages without strikes or lockouts.',
    effects: { struct: 1.5, econ: 1.0, rule: 1.0 } },
  { text: 'National borders should be replaced by online communities you choose to join, each with its own laws and passport.',
    effects: { struct: -2.0, nation: -2.0, tech: -1.0 } },
  { text: 'Most decisions now made by national governments should be made by towns and neighbourhood assemblies.',
    effects: { struct: -2.0, rule: -1.0 } },

  /* ------------------------------- NATION ------------------------------- */
  { quick: true, text: 'A country should make its own essential goods at home, even if that makes things much more expensive.',
    effects: { nation: 2.0, econ: 1.0 } },
  { quick: true, text: 'A world body should set environmental limits for every country and punish those that break them, by force if needed.',
    effects: { nation: -2.0, eco: 2.0, struct: 1.0, force: 0.5 } },
  { text: 'A citizen owes more to their own countrymen than to strangers abroad.',
    effects: { nation: 2.0 } },
  { text: 'National armies should eventually be replaced by a single world government able to keep the peace.',
    effects: { nation: -2.0, struct: 1.0, force: -1.0 } },
  { text: 'Working people of all countries have more in common with each other than with the rich of their own nation.',
    effects: { nation: -2.0, own: 1.0 } },

  /* ------------------------------ IDENTITY ------------------------------ */
  { quick: true, text: 'Immigrants should be expected to adopt the language and customs of their new country, not keep separate ones.',
    effects: { ident: 2.0, nation: 1.0 } },
  { quick: true, text: 'A country is stronger when many distinct cultures live side by side under one law.',
    effects: { ident: -2.0, nation: -0.5 } },
  { text: 'Protecting a country\'s culture matters more than global trade or bringing in foreign workers.',
    effects: { ident: 1.5, nation: 1.5, cult: 1.0, econ: 0.5 } },
  { text: 'State schools should teach minority children in their own mother tongue where families want it.',
    effects: { ident: -2.0 } },
  { text: 'Religious and ethnic communities should be allowed their own courts for family matters such as marriage and inheritance.',
    effects: { ident: -2.0, relig: 1.0, struct: -1.0 } },

  /* ------------------------------- CULTURE ------------------------------ */
  { quick: true, text: 'A local community should be able to enforce its traditional values and ban speech that attacks its heritage.',
    effects: { cult: 2.0, rights: 1.0, ident: 1.0, struct: -1.0 } },
  { quick: true, text: 'Society should actively dismantle traditional gender roles.',
    effects: { cult: -2.0 } },
  { text: 'Customs that have lasted for centuries usually hold more wisdom than the reforms meant to replace them.',
    effects: { cult: 2.0 } },
  { text: 'The family built around marriage and children deserves special support in law and tax.',
    effects: { cult: 2.0 } },
  { text: 'Each generation should feel free to rewrite the moral rules it inherited.',
    effects: { cult: -2.0 } },

  /* ----------------------------- TECHNOLOGY ----------------------------- */
  { quick: true, text: 'The most powerful AI should have to be open source, free for anyone to copy, even if that spreads dangerous abilities faster.',
    effects: { tech: -2.0, struct: -1.0, rights: -0.5 } },
  { quick: true, text: 'Ethics boards should strictly control science, to stop technology changing what it means to be human.',
    effects: { tech: 2.0, cult: 1.0, rights: 0.5 } },
  { text: 'Gene editing and brain implants for humans should have no regulation at all. Let people buy what they want.',
    effects: { tech: -2.0, econ: -1.5, cult: -1.0 } },
  { text: 'The government should pay to replace human workers with machines in every job where it is possible.',
    effects: { tech: -1.5, eco: -1.0, econ: 0.5 } },
  { text: 'A powerful new technology should be banned until it has been proven safe.',
    effects: { tech: 2.0 } },

  /* ------------------------------- ECOLOGY ------------------------------ */
  { quick: true, text: 'We should deliberately shrink industry to protect the planet, even if the economy stops growing.',
    effects: { eco: 2.0, tech: 1.5, econ: 1.0 } },
  { quick: true, text: 'Human welfare should always come before the preservation of wilderness.',
    effects: { eco: -2.0 } },
  { text: 'Rivers, forests and species should have legal rights that can be defended in court against human interests.',
    effects: { eco: 2.0 } },
  { text: 'Nuclear power and large scale engineering are the right answer to the climate problem.',
    effects: { eco: -1.5, tech: -1.5 } },
  { text: 'The world would be better with far fewer people in it.',
    effects: { eco: 2.0 } },

  /* ------------------------------ RELIGION ------------------------------ */
  { quick: true, text: 'Laws should rest on religious moral teaching.',
    effects: { relig: 2.0, cult: 1.0 } },
  { quick: true, text: 'Religious symbols and prayer have no place in state schools.',
    effects: { relig: -2.0 } },
  { text: 'A society that loses its faith will lose its morals.',
    effects: { relig: 2.0, cult: 1.0 } },
  { text: 'Religious organisations should pay the same taxes and obey the same equality laws as any other body.',
    effects: { relig: -2.0 } },
  { text: 'The state should recognise one faith as the spiritual foundation of the nation.',
    effects: { relig: 2.0, nation: 1.0, ident: 1.0 } },

  /* -------------------------------- FORCE ------------------------------- */
  { quick: true, text: 'Every young citizen should complete a period of compulsory military service.',
    effects: { force: 2.0, nation: 1.0, rights: 0.5 } },
  { quick: true, text: 'It is never right to kill for a political cause, even to resist an invader.',
    effects: { force: -2.0 } },
  { text: 'A nation that will not use force abroad to protect its interests will lose them.',
    effects: { force: 2.0, nation: 1.0 } },
  { text: 'Military spending should be cut to the bare minimum needed to defend the country\'s own territory.',
    effects: { force: -1.5 } },
  { text: 'War and struggle bring out the highest qualities in a people.',
    effects: { force: 2.0, cult: 0.5 } }
];

/* Interleave: first statement of every axis, then the second of every axis,
   and so on. Each group above holds exactly five. */
const QUESTIONS = (function interleave() {
  const perAxis = 5;
  const groups = QUESTION_BANK.length / perAxis;
  const out = [];
  for (let round = 0; round < perAxis; round++) {
    for (let g = 0; g < groups; g++) {
      const q = QUESTION_BANK[g * perAxis + round];
      out.push({ id: out.length + 1, quick: Boolean(q.quick), text: q.text, effects: q.effects });
    }
  }
  return out;
})();
