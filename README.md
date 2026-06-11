# dhawal-pandya.github.io

The personal site of Dhawal Pandya. A single page that keeps running whether or
not anyone is watching: the globe turns with the actual sun, cells live and die
behind the projects, a snake plays itself behind the contact lines, and the
poems are printed on paper that matches their nature.

Built with React, Vite, and Tailwind. Design and architecture notes live in
[REWRITE_PLAN.md](REWRITE_PLAN.md); read it before changing anything structural.

## Develop

```
npm install
npm run dev        # local dev server
npm run build      # production build to dist/
npm run deploy     # build + push to both GitHub Pages targets
npm run setup      # install the post-commit hook
```

## Editing content (no code required)

All copy and data live in `src/data/`:

| file | what it holds |
|---|---|
| `profile.json` | name, links, hero lines, about copy, closing words |
| `work.json` | jobs, bullet points, skills |
| `projects.json` | the project list and one-liners |
| `poems.json` | the verses; see [src/data/POEMS_README.md](src/data/POEMS_README.md) before adding one |
| `quips.json` | the one-liners the page says when you do something odd |
| `terminal.json` | everything the terminal says |

`src/data/globe-points.json` is generated; regenerate with `npm run globe-data`.

## The quiet parts

There is a terminal. There are seven secrets. The console knows one of them.
None of them are documented here on purpose.

## Author

**Dhawal Pandya** — [GitHub](https://github.com/dhawal-pandya) ·
[LinkedIn](https://www.linkedin.com/in/dhawal-pandya/) ·
[blog](https://dhawalpandya01.hashnode.dev/)
