# Design: how this site is made, and why

This is a description of the current site (v0.2, the June 2026 "new design"
rewrite, plus later content updates). Use it to decide what to keep and what to
change. It covers the idea first, then the rules that follow from it, then the
actual tokens and code that carry those rules.

---

## 1. The essence

> **A quiet page about a person, in a world that keeps running whether or not
> anyone is watching.**

The site is a small world, not a résumé laid out as a web page. Four things
make it one:

1. **Real time.** The theme is set by the visitor's actual sun, not by a
   preference. The globe is lit by the real subsolar point. Between midnight and
   four the hero line changes. Sunrise switches the page to day without a reload.
2. **Living things.** Every section has something alive behind it: a dragon, a
   flock, cells, a snake, steam. None of them is scripted to look nice. Each
   runs a simple rule (Life, boids, follow-the-leader, a greedy path to food)
   and the shape you see comes out of that rule.
3. **One clock.** All of those living things share a single clock
   (`lib/clock.js`). A cheat code speeds the whole world up; a word stops it.
   That's how you can tell it's one world rather than six animations.
4. **A quiet surface over a loud underside.** The visible UI is restrained to
   the point of austerity. Underneath sit a terminal, seven secrets, twenty-odd
   cheat codes, a talking page and a hidden ash room. You only meet the
   underside if you go looking.

Everything below follows from these four.

---

## 2. The bloodline

The design draws on five traditions. Knowing which is which helps you see what
you'd lose if you changed something.

| Lineage | What it contributes | Where it shows |
|---|---|---|
| **Editorial / literary web** (quiet-craft personal sites, book typography) | Warm paper background, serif display over neutral sans, one ember accent, hairlines instead of boxes, generous measure (`68ch`) | Palette, Fraunces + Inter, `SectionHead`, Work timeline, Projects list |
| **Creative coding / artificial life** (Conway 1970, Reynolds' boids 1986, demoscene, pixel art) | Simulations as decoration, emergence over animation, grid-snapped square cells | `GameOfLife`, `Birds`, `Dragon`, `Snake`, `Chai`, `Ash` |
| **Games and hacker culture** (Quake console, GTA cheat codes, Konami code, console greetings) | Hidden input layers, a backtick terminal, a playable snake, secrets you collect | `Terminal`, `lib/words.js`, the `console.log` greeting, `lib/secrets.js` |
| **Indian and Vedantic thought** | Section names as concepts; a philosophy of witnessing, play and impermanence | Devanagari marks, *sakshi*, *tathastu*, chai, the Nirvana Shatakam footer, the ash room |
| **The previous versions of this site** (2022–2025) | The kanban board, scrambled text, custom cursor | The kanban survives as a *secret* ("the old board, kept out of sight") |

### The Sanskrit layer is the spine, not ornament

The section marks set the meaning of each section:

| Section | Mark | Meaning | Why it fits |
|---|---|---|---|
| about | परिचयः *paricayaḥ* | introduction | — |
| work | कर्म *karma* | action, duty | the jobs |
| projects | लीला *līlā* | divine play | side projects as play, with Game of *Life* behind them |
| verses | शब्द *śabda* | word, sound | the poems |
| contact | संपर्क *samparka* | contact | — |
| footer | चिदानन्दरूपः शिवोऽहं शिवोऽहम् | "I am consciousness and bliss, I am Shiva" | the refrain of Shankara's *Nirvana Shatakam* |

The secrets carry the same thread: *sakshi* (the witness) freezes time,
*tathastu* ("so be it") is the console's word, the reward for finding all seven
is "nirvana", and the room at the end is ash, which is impermanence made
literal. (The ash room's line, "better to be ashes than merely dust", is Jack
London's.) If you drop this layer you get a nicely made dev portfolio. If you
keep it, the site belongs to one particular person.

---

## 3. Design principles (derived from the code)

These rules aren't written down anywhere else, but the code follows them almost
everywhere.

1. **Day and night are times, not preferences.** The theme toggle has three
   states: follow the sun, pin day, pin night. The default is always the real
   sky (`index.html` inline script, `lib/sun.js`, `lib/theme.js`).
2. **Living things are drawn as cells.** Every creature is built from
   grid-snapped squares in one faint ink (`--sim`, 7% alpha). The only thing
   that changes from creature to creature is cell size: chai 5px, dragon and
   birds 6px, Life 18px, snake 20px.
3. **The accent is round; the ink is square.** Ember orange only ever shows up
   as a *dot*: cursor, active nav marker, work-timeline bullets, the globe's
   home marker and terminator, snake food, ash embers. Squares are always ink.
   This rule is never stated but it holds across the whole site.
4. **One world, one clock.** Simulations take their delta-time from
   `getScale()`, so a cheat can wind everything up ×10 and *sakshi* can stop
   it. A new creature that uses its own timer breaks the illusion.
5. **The UI stays out of the way.** No cards, no gradients, no filled buttons,
   no icons beyond four hand-drawn SVGs. Links are lowercase text with `↗`
   (out) or `↓` (down). Metadata is `text-xs` in `--ink-soft`. Only two things
   cast a shadow: the poem sheets and the toast.
6. **Poems carry their own weather.** Each poem sheet ignores the site theme
   and takes its paper, ink and typeface from its *nature* (love, night, rage,
   cosmic, resolve, grief, light). It's the only place on the site where colour
   and type change.
7. **The page speaks rarely.** Quips have a 45-second global cooldown. Each
   pool runs out and then goes silent ("a joke that begs is not one"). Phones
   get no quips at all.
8. **Secrets are earned, never advertised.** Hints only come if you type
   `hint`. The secret count is only spoken inside the terminal. The README
   refuses to list them.
9. **Kind to machines and people.** Canvases pause off-screen and in hidden
   tabs. Reduced motion gets one still frame. The custom cursor only appears on
   precise pointers. On phones the terminal opens from the spinning `dp` logo,
   since phones have no backtick key.
10. **Content is data.** All copy lives in `src/data/*.json`, so the voice can
    be edited without touching components.

---

## 4. Voice

The words are as much a part of the design as the pixels.

- **lowercase**, always: nav, links, buttons, quips, terminal.
- **Dry, short, self-deprecating, second person.** "nothing is broken. between
  us, that surprises me too."
- **Speaks as a person, not a brand.** The page says "I" and means Dhawal.
- **Mythic and mundane side by side.** Shiva in the footer, GTA cheat codes in
  the keyboard handler, chai as a karmic obligation.
- **Comments read like prose.** Code comments use the same voice ("The head
  goes; the body has no choice."). Keep that if you rewrite components.

---

## 5. Tokens

### Colour (`src/index.css`)

| Token | Day | Night | Role |
|---|---|---|---|
| `--bg` | `#f7f4ee` warm paper | `#0a0b12` blue-black | page, globe disc |
| `--bg-soft` | `#efeae0` | `#11131d` | terminal, toast, kanban, photo-hold |
| `--ink` | `#20201d` | `#e6e4dd` | text, lit globe dots |
| `--ink-soft` | `#6b675e` | `#8d8a81` | meta text, night-side dots, chai, ash |
| `--accent` | `#c2540a` ember | `#e8730f` brighter ember | the single colour |
| `--line` | `#e0dacd` | `#1f2230` | hairlines, globe rim |
| `--sim` | ink @ 7% | ink @ 7% | every simulated creature |
| `--moth` | `#4a4842` | `#5e5c57` | moths, and fireflies between flares |

Body background and text cross-fade over 600ms when the theme changes. Canvases
re-read their colours on the `kc-theme` event.

Poem natures (`Verses.jsx`) have their own palette, independent of the theme:

| nature | paper | ink | face |
|---|---|---|---|
| love | `#f6efe3` | `#6b4a32` | Kalam (handwritten) |
| night | `#141828` | `#cdd3e8` | Fraunces light italic |
| rage | `#171210` | `#e05d1e` | Fraunces black |
| cosmic | `#0a0b12` | `#e6e4dd` | EB Garamond |
| resolve | `#f7f4ee` | `#20201d` | EB Garamond |
| grief | `#e3e1dd` | `#4a4a48` | Fraunces |
| light | `#fbfaf7` | `#3a3833` | Kalam (defined, currently unused) |

### Typography

| Role | Face | Size |
|---|---|---|
| Name (h1) | Fraunces Variable | `5xl` / `md:7xl`, leading-tight |
| Section titles (h2) | Fraunces | `3xl` / `md:4xl` |
| Item titles (h3) | Fraunces | `xl` (work), `lg` (projects) |
| Body | Inter Variable | `15px`, line-height ~1.7 |
| Meta, nav, links | Inter | `text-xs`, `tracking-wide` on nav |
| Terminal, toast, kanban | JetBrains Mono Variable | `13px` / `sm` |
| Section marks, footer | Noto Serif Devanagari | `sm` / `lg` |
| Poems only | EB Garamond, Kalam | `14–15px` |

All fonts are self-hosted through `@fontsource`, so nothing is fetched from a
CDN.

### Layout

- Content width `max-w-site` = **1100px**; prose `max-w-prose` = **68ch**.
- Gutters `px-5` / `md:px-8`.
- Section rhythm `py-12` / `md:py-16`. About is the exception at
  `py-24` / `md:py-32`.
- Hero: full viewport, two columns `1.1fr / 1fr` (text and globe). On mobile
  the globe goes on top at 60% opacity.
- Every section uses `<SectionHead>`: a serif title and a small Devanagari mark
  on one baseline.
- Each section is `relative`. Its creature is an `absolute inset-0` canvas,
  and the content sits above it at `z-10`.

### Z-stack

```
0    section creatures (Life, Birds, Snake, Chai)
1    globe            2  dragon (clips itself around the globe's disc)
10   section content
50   nav (82% bg, backdrop blur, bottom hairline)
80   terminal (bottom sheet, 46vh)
85   kanban          90  toast          95  stillness veil
100  cursor
```

### Motion

| Thing | Behaviour |
|---|---|
| Theme change | 600ms ease colour cross-fade |
| `dp` logo click | +1080° spin, 1600ms, `cubic-bezier(0.16,1,0.3,1)` |
| Role line | ScrambledText settles letter by letter over 600ms and cycles every 3.6s. It shuffles the word's own letters, so the width never jumps |
| Cursor | a 6px ember dot and nothing else; it swells ×1.8 over anything clickable. Fireflies keep it company at dawn and dusk, moths at night (`Moths.jsx`) |
| Globe | turns slowly west to east; drag with inertia; terminator band in accent |
| Dragon | head follows a sum of three slow sines per axis (periods in minutes); body follows the leader; it decides at random whether to pass in front of or behind the globe |

---

## 6. The creatures, section by section

| Section | Creature | Rule | Interaction |
|---|---|---|---|
| Hero | **Globe** | 2D-projected land dots, 23.5° tilt, lit by `sunVector()`; home marker at Valsad pulses | drag to spin; spinning too hard triggers a quip |
| Hero | **Dragon** | 72 segments, follow-the-leader, one pair of beating wings, horns, whiskers | none; it just lives there |
| everywhere | **Fireflies** (dawn, dusk; rare) | 6 round dots drifting lazily around the ember, each flaring from grey to ember every few seconds | follow the pointer; lose interest after 6s of stillness |
| everywhere | **Moths** (night; rare) | 3 square-cell moths in `--moth`, spring-and-flutter flight, two-frame wings | circle the pointer close; drift off when it is still |
| About | **Chai** | fixed pixel cup, steam wisps rise and fade | *(mobile only, see §9)* |
| Work | **Birds** | 15 boids (separation, alignment, cohesion) chasing a wandering waypoint, two-frame flap | none |
| Projects | **Game of Life** | 18px cells, 10% random soup plus a Gosper glider gun, tick 0.15s | moving the pointer births cells |
| Verses | *(none)* | the paper sheets are the living thing here | horizontal snap-scroll, slight per-poem tilt hashed from the slug |
| Contact | **Snake** | born 16 cells long (shorter only if the board is too narrow), greedy, a little random (8%), dies and respawns | `snake` in the terminal hands you the arrow keys |
| `#/ash` | **Moon** | tonight's real phase, a disc of cells in the top-right corner; ash falls in front of it | none |
| `#/ash` | **Ash** | falling flakes settle into a soft dune that persists across visits; the dune resets once it reaches 2/3 of the screen. A still visitor fills it in about 3–4 minutes (tune with `SPAWN`, `SETTLE`, `RAMP`, `AIR`, `SPREAD`, `REPOSE` in `Ash.jsx`) | stillness thickens the fall; your hand is wind; a click drops an ember |

---

## 7. The hidden layer

- **Terminal:** press `` ` `` (or tap the `dp` logo on a phone). Commands:
  `help`, `whoami`, `ls`, `poems [slug]`, `blog`, section names, `snake`,
  `life`, `kanban`, `secrets`, `hint`, `clear`, `exit`.
- **Seven secrets** (`lib/secrets.js`): terminal, hesoyam, stillness,
  tathastu, nightowl, photo-hold, chai. Finding all seven shows the "nirvana"
  toast.
- **Words typed anywhere** (`lib/words.js`): about 21 GTA SA and VC cheats
  wind up the clock; `sakshi` freezes it; `chai` / `cha` / `tea`.
- **Quips** (`data/quips.json`): the page notices copying, resizing, rage
  clicks, ⌘S, theme flipping, spinning the globe hard, double-clicking the
  name, and clicking on the snake's body. Links and buttons always take the
  click first.
- **Ash room:** click the footer seven times within six seconds. Esc returns.
- **`uptime`** in the terminal, never listed in `help`: how long since this browser first saw the page, and how many times the earth has turned since.
- **`?at=HH:MM`** pretends it is that local time today, for previewing the sky.

---

## 8. Architecture you need to know before changing anything

- **`useCanvasLoop(ref, draw)`** is the only animation primitive. It handles
  DPR, resize, off-screen and hidden-tab pausing, reduced motion, and passes a
  clock-scaled `dt` to `draw`. Every new creature should use it.
- **A window event bus**, all names prefixed `kc-`:
  `kc-theme`, `kc-clock`, `kc-toast`, `kc-secret`, `kc-word`,
  `kc-globe-spin`, `kc-poem`, `kc-snake-play`, `kc-life-reseed`,
  `kc-terminal`. Components never import each other; they talk over this bus.
- **Theme is set before first paint** by an inline script in `index.html` that
  duplicates the solar maths in `lib/sun.js`. If you change one, change both.
- **`lib/sun.js` is the page's sense of time.** `now()` (honours `?at=`),
  `sky()` (altitude, morning or not), `phase()` (day, dawn, dusk, night) and
  `moonAge()`. Anything that follows the real sky should ask it, not `Date`.
- **Companions are rare.** `lib/company.js` rolls once per page load: about
  one visit in twenty gets fireflies or moths. Clicking `dp` (with a cursor)
  toggles them; on phones `dp` stays the terminal's door.
- **State** lives only in `localStorage` (`kc-theme-override`, `kc-found`,
  `kc-nirvana`, `kc-kanban-v2`, `kc-ash-pile`, `kc-ash-cycles`,
  `kc-first-seen`).
- **Routing** is a single hash check: `#/ash` replaces the whole app.
- **Stack**: React 18, Vite 6, Tailwind 3 (colours mapped to the CSS
  variables), no runtime dependencies beyond React and fonts.

---

## 9. Drift and loose ends (as of Nov 2026)

These are places where the code and the intent have come apart. Deal with them
whether or not you redesign.

Still open:

- `Chai` is `md:hidden`, so it only shows on mobile. Its code still has a
  desktop position branch that never runs. It also draws at `--ink-soft` ×
  0.7, far louder than the 7% `--sim` every other creature uses. Left as it
  is, on purpose.
- `isDaylight()` assumes latitude 21°N (roughly home) for every visitor, so the
  page quietly assumes you live near Valsad. That's intentional: knowing the
  real latitude would mean asking for location permission.
- The `light` poem nature is defined but no poem uses it yet. It's documented
  in `src/data/POEMS_README.md` as available.

Fixed in Nov 2026: the README now points here; `POEMS_README.md` exists; the
share image (`public/screen.png`) was regenerated from the current build; the
hero has its day line again; About's padding matches the other sections; the
Kanban overlay uses the theme tokens instead of `bg-black/40`.

---

## 10. If you change it: what's load-bearing

**Load-bearing.** Removing any of these changes what the site *is*:

- the real sun drives the theme and the globe
- one shared clock and one cell dialect for all living things
- a quiet, austere surface over a deep hidden layer
- the lowercase, dry, first-person voice
- the Sanskrit spine (section concepts, witness, *līlā*, ash, nirvana)
- poems as physical objects with their own weather

**Incidental.** Change these freely without losing the essence:

- the specific fonts (keep the pattern of a characterful serif, a neutral
  sans, and mono reserved for the machine voice)
- the exact orange (keep a *single* warm accent that only ever appears as a dot)
- the globe's placement, size or projection
- section order, the verses carousel format, the timeline styling
- which creature lives in which section
- React/Tailwind themselves; the ideas don't depend on the stack

**A test for any new idea:** would it still be running if nobody were looking?
Does it run on the shared clock? Is it quiet until you ask? If all three are
true, it belongs here.
