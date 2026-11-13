# Adding a poem

Poems live in `poems.json`, one object per poem, in the order they appear on
the page. Each one is printed on its own sheet of paper, and the paper, ink and
typeface come from the poem's **nature**, not from the site's day/night theme.

```json
{
  "slug": "after-midnight",
  "title": "After Midnight",
  "nature": "night",
  "note": "optional, a small line under the title",
  "year": "optional, printed at the foot of the sheet",
  "stanzas": [
    ["first line", "second line"],
    ["a new stanza starts a new array"]
  ]
}
```

| field | required | notes |
|---|---|---|
| `slug` | yes | unique, lowercase, hyphenated. The terminal uses it (`poems after-midnight`), and it also seeds the sheet's slight tilt |
| `title` | yes | |
| `nature` | yes | one of the natures below. Any other value means the poem is skipped, with a console error in dev |
| `stanzas` | yes | an array of stanzas, each an array of lines |
| `note` | no | |
| `year` | no | |

## Natures

Pick the one that matches the poem's weather. They're defined in
`src/components/verses/Verses.jsx` (`NATURES`).

| nature | paper | ink | face | use for |
|---|---|---|---|---|
| `love` | warm cream | brown | Kalam, handwritten | tenderness, longing |
| `light` | near-white | soft charcoal | Kalam, handwritten | playful, light-hearted (no poem uses it yet) |
| `night` | deep navy | pale blue | Fraunces light italic | late hours, quiet |
| `rage` | near-black | ember | Fraunces black | anger |
| `cosmic` | the site's night sky | the site's night ink | EB Garamond | the vast, the metaphysical |
| `resolve` | the site's day paper | the site's day ink | EB Garamond | will, duty, steadiness |
| `grief` | cool grey | grey | Fraunces | loss, endings |

To add a new nature, add an entry to `NATURES` with `paper`, `ink`, `font` and
`size`, then add it to this table.
