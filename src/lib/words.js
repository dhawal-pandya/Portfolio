// Every word the page listens for, gathered in one place.
// The cheats come from the old cities, and each one grows up into the same
// small miracle here: the clock winds up, the globe spins, and the page
// remembers you knew the words. The rest of the words are ours.

export const CHEATS = {
  // san andreas
  hesoyam: {
    game: "san andreas",
    toast: "the wheel turns faster for no one. not even CJ.",
  },
  baguvix: {
    game: "san andreas",
    toast: "almost deathless. the drowning still counts.",
  },
  aezakmi: {
    game: "san andreas",
    toast: "no stars, no chase. the Witness watches anyway.",
  },
  rocketman: {
    game: "san andreas",
    toast: "a jetpack, and still nowhere to be but here.",
  },
  aiwprton: { game: "san andreas", toast: "a tank, on a portfolio. subtle." },
  jumpjet: {
    game: "san andreas",
    toast: "a Hydra will not make the reading go faster.",
  },
  lxgiwyl: {
    game: "san andreas",
    toast: "weapon set one. the strongest thing here is still the resume.",
  },
  uzumymw: {
    game: "san andreas",
    toast: "the heavy set, against a webpage. brave.",
  },
  ripazha: {
    game: "san andreas",
    toast: "the cars fly now. the clock was already spinning.",
  },
  fullclip: {
    game: "san andreas",
    toast: "infinite ammo. attention is the thing that runs out.",
  },
  // vice city
  thugstools: {
    game: "vice city",
    toast: "bats and pistols. 1986 never really ended.",
  },
  professionaltools: {
    game: "vice city",
    toast: "tools of the trade. mine are mostly keyboards.",
  },
  nuttertools: { game: "vice city", toast: "the good stuff. mind the footer." },
  aspirine: {
    game: "vice city",
    toast: "full health. deadlines deal chip damage anyway.",
  },
  preciousprotection: {
    game: "vice city",
    toast: "full armor. it never did cover the heart.",
  },
  leavemealone: {
    game: "vice city",
    toast: "stars gone. you were never in trouble here.",
  },
  panzer: {
    game: "vice city",
    toast: "a Rhino falls from the sky and the page holds.",
  },
  bigbang: {
    game: "vice city",
    toast: "everything explodes, politely, offscreen.",
  },
  fannymagnet: {
    game: "vice city",
    toast: "ohh fuck off",
  },
  seaways: {
    game: "vice city",
    toast: "ah yes, the jesus cheat",
  },
  comeflywithme: {
    game: "vice city",
    toast: "the cars take flight. Tommy stays on the ground.",
  },
};

export const CHEAT_WORDS = Object.keys(CHEATS);

// three names, one kettle. the first is the canonical one.
export const TEA_WORDS = ["chai", "cha", "tea"];

// the one who watches
export const WITNESS_WORD = "sakshi";

export const WORDS = [...CHEAT_WORDS, WITNESS_WORD, ...TEA_WORDS];
export const MAX_WORD_LEN = Math.max(...WORDS.map((w) => w.length));
