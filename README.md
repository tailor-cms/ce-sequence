# Sequence

An ordered series of entries laid out on a vertical track. Each entry has a
**marker** (a number when blank, or a custom label such as a date), a
**title**, a **description**, and a body that can hold other content elements.
One element covers both numbered "how-to" steps and chronological timelines. A
composite element (`isComposite: true`).

**Type:** `SEQUENCE`

## Data

| Field | Type | Description |
|-------|------|-------------|
| `items` | `Record<string, SequenceItem>` | The entries, keyed by id. |
| `embeds` | `Record<string, Embed>` | Flat map of every embedded element across all entries. |

Each `SequenceItem` is `{ id, marker, title, description, body, position }`:

- `marker` — node label. **Blank → auto-numbered** by position (steps mode);
  set → shown as-is, e.g. a date (timeline mode).
- `title` — bold heading shown in the collapsed editor panel and the display.
- `description` — one-line summary under the title.
- `body` — embed container (a map of the embed ids placed under that entry).

## Edit

- Reorderable list of entries (drag handle), each a collapsible panel
- Per entry: a numbered avatar + editable **title** (header), and **marker** +
  **description** fields plus an embedded-element container (body)
- Add Entry / delete entry (delete confirmed via dialog; the last entry can't
  be deleted)

## Display

- Entries rendered on a vertical `VTimeline`, ordered by position
- Each node shows its number (or the `marker` label), the title, the
  description, and the embedded content

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
