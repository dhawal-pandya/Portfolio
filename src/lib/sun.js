// Solar position, approximated. Good to about a degree, which is plenty:
// it decides dot shading on a 500px globe and a default theme, not a launch window.

// Subsolar point (where the sun is overhead right now), in radians.
export function subsolarPoint(date = new Date()) {
  const start = Date.UTC(date.getUTCFullYear(), 0, 1);
  const doy = (date.getTime() - start) / 864e5;
  const decl =
    ((-23.44 * Math.cos((2 * Math.PI * (doy + 10)) / 365.24)) * Math.PI) / 180;
  const utcH =
    date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  const lon = (((12 - utcH) * 15) * Math.PI) / 180;
  return { lat: decl, lon };
}

// Unit vector of sunlight in earth-fixed coordinates
// (x toward lon 0, y toward the north pole, z toward lon 90E).
export function sunVector(date = new Date()) {
  const { lat, lon } = subsolarPoint(date);
  return [
    Math.cos(lat) * Math.cos(lon),
    Math.sin(lat),
    Math.cos(lat) * Math.sin(lon),
  ];
}

// Is the sun up for this visitor? Latitude is unknown without asking, so we
// assume the tropics-adjacent band and estimate longitude from the timezone
// offset. Off by minutes at worst, and the toggle exists for the offended.
export function isDaylight(date = new Date()) {
  const { lat: decl, lon: subLon } = subsolarPoint(date);
  const lon = ((-date.getTimezoneOffset() / 60) * 15 * Math.PI) / 180;
  const lat = (21 * Math.PI) / 180;
  const cosZ =
    Math.sin(lat) * Math.sin(decl) +
    Math.cos(lat) * Math.cos(decl) * Math.cos(lon - subLon);
  return cosZ > -0.05;
}
