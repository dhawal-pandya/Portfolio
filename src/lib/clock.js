// One clock for every living thing on the page. The simulations multiply
// their delta-time by `scale`, and stop entirely while `frozen`.
// Konami winds it up; the typed word stills it. Neither is named here.

const clock = { scale: 1, frozen: false };

export function getScale() {
  return clock.frozen ? 0 : clock.scale;
}

export function windUp(factor = 10, ms = 10000) {
  clock.scale = factor;
  window.dispatchEvent(new CustomEvent("kc-clock", { detail: { ...clock } }));
  setTimeout(() => {
    clock.scale = 1;
    window.dispatchEvent(new CustomEvent("kc-clock", { detail: { ...clock } }));
  }, ms);
}

export function stillness(ms = 5000) {
  clock.frozen = true;
  window.dispatchEvent(new CustomEvent("kc-clock", { detail: { ...clock } }));
  setTimeout(() => {
    clock.frozen = false;
    window.dispatchEvent(new CustomEvent("kc-clock", { detail: { ...clock } }));
  }, ms);
}
