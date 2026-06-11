// Generates src/data/globe-points.json: [lat, lon] pairs (deg, 1 decimal) for
// dots that fall on land, sampled from a Fibonacci sphere so density is even.
// Run: npm run globe-data (needs network once; output is committed).

const SOURCE =
  "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json";
const SAMPLES = 14000;

const res = await fetch(SOURCE);
if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
const geo = await res.json();

const rings = [];
for (const f of geo.features) {
  const g = f.geometry;
  if (!g) continue;
  if (g.type === "Polygon") rings.push(g.coordinates);
  else if (g.type === "MultiPolygon") rings.push(...g.coordinates);
}

function inRing(lon, lat, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi)
      inside = !inside;
  }
  return inside;
}

function onLand(lon, lat) {
  for (const poly of rings) {
    if (inRing(lon, lat, poly[0])) {
      let inHole = false;
      for (let h = 1; h < poly.length; h++)
        if (inRing(lon, lat, poly[h])) {
          inHole = true;
          break;
        }
      if (!inHole) return true;
    }
  }
  return false;
}

const golden = Math.PI * (3 - Math.sqrt(5));
const points = [];
for (let i = 0; i < SAMPLES; i++) {
  const y = 1 - (i / (SAMPLES - 1)) * 2;
  const lat = (Math.asin(y) * 180) / Math.PI;
  const lon = ((((i * golden) % (2 * Math.PI)) * 180) / Math.PI + 540) % 360 - 180;
  if (onLand(lon, lat)) points.push([+lat.toFixed(1), +lon.toFixed(1)]);
}

const fs = await import("node:fs");
fs.writeFileSync(
  new URL("../src/data/globe-points.json", import.meta.url),
  JSON.stringify(points)
);
console.log(`wrote ${points.length} land points`);
