// The hidden surface. Each secret is found once, kept in localStorage,
// and only ever counted out loud inside the terminal. The ash page is not
// on this list: it is the reward, not the riddle.

export const SECRET_IDS = [
  "terminal", // opened the terminal
  "hesoyam", // the old cheat, grown up
  "stillness", // typed the word
  "tathastu", // followed the console's advice
  "nightowl", // visited between midnight and four
  "photo", // held the photo down
  "chai", // typed the drink that cannot be refused
];

const KEY = "kc-found";
const DONE_KEY = "kc-nirvana";

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
    // stale ids from older builds fall away quietly
    return new Set(raw.filter((id) => SECRET_IDS.includes(id)));
  } catch {
    return new Set();
  }
}

export function foundSecret(id) {
  if (!SECRET_IDS.includes(id)) return false;
  const set = load();
  const fresh = !set.has(id);
  if (fresh) {
    set.add(id);
    try {
      localStorage.setItem(KEY, JSON.stringify([...set]));
    } catch {}
    window.dispatchEvent(new CustomEvent("kc-secret", { detail: { id } }));
    // the seventh opens the door at the bottom of the page
    if (set.size === SECRET_IDS.length && !localStorage.getItem(DONE_KEY)) {
      try {
        localStorage.setItem(DONE_KEY, "1");
      } catch {}
      toast("nirvana nirvana nirvana nirvana nirvana nirvana nirvana", 9000);
    }
  }
  return fresh;
}

export function foundIds() {
  return [...load()];
}

export function secretCount() {
  return { found: load().size, total: SECRET_IDS.length };
}

export function toast(text, ms = 4000) {
  window.dispatchEvent(new CustomEvent("kc-toast", { detail: { text, ms } }));
}
