import { isDaylight } from "./sun";

// Modes: no override -> follow the sun. Override ("day"|"night") -> pinned.
const KEY = "kc-theme-override";
const listeners = new Set();

export function currentTheme() {
  return document.documentElement.dataset.theme === "night" ? "night" : "day";
}

export function getOverride() {
  try {
    const q = new URLSearchParams(window.location.search).get("theme");
    if (q === "day" || q === "night") return q;
    const v = localStorage.getItem(KEY);
    return v === "day" || v === "night" ? v : null;
  } catch {
    return null;
  }
}

function apply(theme) {
  if (currentTheme() === theme) return;
  document.documentElement.dataset.theme = theme;
  listeners.forEach((fn) => fn(theme));
  window.dispatchEvent(new CustomEvent("kc-theme", { detail: theme }));
}

export function setOverride(theme) {
  try {
    localStorage.setItem(KEY, theme);
  } catch {}
  apply(theme);
}

export function followSun() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
  apply(isDaylight() ? "day" : "night");
}

export function toggleTheme() {
  setOverride(currentTheme() === "day" ? "night" : "day");
}

export function onThemeChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// Re-check the sky every ten minutes; sunrise should not need a reload.
export function startSunWatch() {
  const tick = () => {
    if (!getOverride()) apply(isDaylight() ? "day" : "night");
  };
  tick();
  const id = setInterval(tick, 10 * 60 * 1000);
  return () => clearInterval(id);
}
