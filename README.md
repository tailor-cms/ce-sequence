# Sequence

An ordered series of entries laid out on a vertical track, where each entry has
a **title** and a body that can hold other content elements. A single `mode`
switches the element between two presentations — numbered **steps** (how-to
processes) and a chronological **timeline** (dated entries) — so one element
covers both. A composite element (`isComposite: true`).

**Type:** `SEQUENCE`

## Data

| Field | Type | Description |
|-------|------|-------------|
| `mode` | `'steps' \| 'timeline'` | How entries are presented (see below). |
| `items` | `Record<string, SequenceItem>` | The entries, keyed by id. |
| `embeds` | `Record<string, Embed>` | Flat map of every embedded element across all entries. |

Each `SequenceItem` is `{ id, marker, title, body, position }`:

- `marker` — date/period label (e.g. `"1990"`, `"Q1 2024"`). Shown only in
  **timeline** mode; ignored in steps mode (but retained, so toggling modes
  doesn't lose it).
- `title` — bold heading shown in the collapsed editor panel and the display.
- `body` — embed container (a map of the embed ids placed under that entry).

### Mode

- **`steps`** — each node shows its **position number**; markers are hidden.
- **`timeline`** — each node is a plain dot with its **marker** shown opposite
  the content; numbers are hidden.

## Edit

- Mode toggle (Steps / Timeline) in the side toolbar
- Reorderable list of entries (drag handle), each a collapsible panel
- Per entry: editable **title** in the header — preceded by a numbered avatar
  (steps) or a **date** field (timeline) — plus an embedded-element container
  (body)
- Add Entry / delete entry (delete confirmed via dialog; the last entry can't
  be deleted)

## Display

- Entries rendered on a vertical `VTimeline`, ordered by position
- Each node shows its number (steps) or date marker (timeline), the title, and
  the embedded content

## AI

`generate` produces either variant: the model picks `timeline` (with a date
`marker` per entry) for chronological topics and `steps` for procedural ones.

## Development

Requires Node `>=24` and pnpm.

```sh
pnpm dev     # Preview :8080 | Edit :8010 | Display :8020 | Server :8030
pnpm build
pnpm lint
pnpm test
```

## Run with Docker

```sh
docker compose up
```
