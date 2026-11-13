// Whether the ember keeps company tonight. Most visits it does not: the
// fireflies and moths come on their own about one visit in twenty. The
// wheel in the nav (dp) calls them, or sends them away.

const CHANCE = 0.05;
let on = Math.random() < CHANCE;

export function hasCompany() {
  return on;
}

export function toggleCompany() {
  on = !on;
  window.dispatchEvent(new CustomEvent("kc-company", { detail: on }));
  return on;
}
