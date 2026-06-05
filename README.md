# Timeline

Timeline content element — a sequence of ordered events.

**Type:** `TIMELINE`

> **Scaffold:** the package is wired for CEK v2, but the Edit and Display
> components are still the template placeholders. Implement the timeline UI and
> fill in the **Data** table below as you build it out.

## Data

| Field | Type | Description |
|-------|------|-------------|
| _add timeline fields here_ | | |

Only list fields that are meaningful to the element's behavior. Omit framework
internals like `assets` (the dual-URL storage map).

## Edit

- _author-facing timeline editor (to be implemented)_

## Display

- _learner-facing timeline (to be implemented)_

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

## Documentation

- [xt Framework](https://tailor-cms.github.io/xt/introduction.html)
- [Edit](https://tailor-cms.github.io/xt/edit-package) · [Display](https://tailor-cms.github.io/xt/display-package) · [Server](https://tailor-cms.github.io/xt/server-package)
- [Manifest](https://tailor-cms.github.io/xt/manifest) · [Runtime](https://tailor-cms.github.io/xt/runtime) · [Testing](https://tailor-cms.github.io/xt/testing)
