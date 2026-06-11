// The hidden surface. Each secret is found once, kept in localStorage,
// and only ever counted out loud inside the terminal.

export const SECRET_IDS = [
  "terminal", // opened the terminal
  "hesoyam", // the old cheat, grown up
  "stillness", // typed the word
  "tathastu", // followed the console's advice
  "nightowl", // visited between 3 and 4
  "ash", // clicked the last word seven times
  "photo", // held the photo down
];

const KEY = "kc-found";

function load() {
  try {
    return new Set(JSON.parse(localStorage.getItem(KEY) || "[]"));
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
  }
  return fresh;
}

export function secretCount() {
  return { found: load().size, total: SECRET_IDS.length };
}

export function toast(text, ms = 4000) {
  window.dispatchEvent(new CustomEvent("kc-toast", { detail: { text, ms } }));
}
