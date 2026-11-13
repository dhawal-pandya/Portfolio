// Solar position, approximated. Good to about a degree, which is plenty:
// it decides dot shading on a 500px globe and a default theme, not a launch window.

// The page's "now". `?at=06:20` pretends it is that local time today, and
// keeps ticking from there, so dawn can be watched at any hour. Unadvertised.
const offset = (() => {
  try {
    const m = /^(\d{1,2}):(\d{2})$/.exec(new URLSearchParams(window.location.search).get("at") || "");
    if (!m) return 0;
    const t = new Date();
    t.setHours(+m[1], +m[2], 0, 0);
    return t.getTime() - Date.now();
  } catch {
    return 0;
  }
})();

export function now() {
  return new Date(Date.now() + offset);
}

const D2R = Math.PI / 180;
// Latitude is unknown without asking, so the page assumes the visitor stands
// where it does: about 21°N. Longitude comes from the timezone offset.
const LAT = 21 * D2R;

// Subsolar point (where the sun is overhead right now), in radians.
export function subsolarPoint(date = now()) {
  const start = Date.UTC(date.getUTCFullYear(), 0, 1);
  const doy = (date.getTime() - start) / 864e5;
  const decl = -23.44 * Math.cos((2 * Math.PI * (doy + 10)) / 365.24) * D2R;
  const utcH =
    date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  const lon = (12 - utcH) * 15 * D2R;
  return { lat: decl, lon };
}

// Unit vector of sunlight in earth-fixed coordinates
// (x toward lon 0, y toward the north pole, z toward lon 90E).
export function sunVector(date = now()) {
  const { lat, lon } = subsolarPoint(date);
  return [
    Math.cos(lat) * Math.cos(lon),
    Math.sin(lat),
    Math.cos(lat) * Math.sin(lon),
  ];
}

// The visitor's sky: the sun's altitude in degrees, its highest altitude
// today, and whether it is still climbing (morning) or already falling.
export function sky(date = now()) {
  const { lat: decl, lon: subLon } = subsolarPoint(date);
  const lon = (-date.getTimezoneOffset() / 60) * 15 * D2R;
  let ha = lon - subLon; // the sun's hour angle, as seen from here
  ha = Math.atan2(Math.sin(ha), Math.cos(ha));
  const sinAlt =
    Math.sin(LAT) * Math.sin(decl) + Math.cos(LAT) * Math.cos(decl) * Math.cos(ha);
  return {
    alt: Math.asin(sinAlt) / D2R,
    noon: 90 - Math.abs(LAT - decl) / D2R,
    // negative hour angle: the sun has not yet crossed the meridian
    morning: ha < 0,
  };
}

// Is the sun up for this visitor? Off by minutes at worst, and the toggle
// exists for the offended. Mirrors the inline script in index.html.
export function isDaylight(date = now()) {
  return Math.sin(sky(date).alt * D2R) > -0.05;
}

// The part of the day, as the creatures understand it.
//   twilight: the sun within 8° of the horizon, either end of the day
export function phase(date = now()) {
  const { alt, morning } = sky(date);
  if (alt >= 8) return "day";
  if (alt > -8) return morning ? "dawn" : "dusk";
  return "night";
}

// The moon's age as a fraction of its cycle: 0 new, 0.5 full.
export function moonAge(date = now()) {
  const SYNODIC = 29.530588853;
  const NEW = Date.UTC(2000, 0, 6, 18, 14); // a known new moon
  const days = (date.getTime() - NEW) / 864e5;
  return (((days / SYNODIC) % 1) + 1) % 1;
}
