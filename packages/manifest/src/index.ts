import type { AiConfig } from '@tailor-cms/cek-common';
import { v4 as uuid } from 'uuid';

import type {
  DataInitializer,
  ElementData,
  ElementManifest,
} from './interfaces';

const id1 = uuid();
const id2 = uuid();

// Element unique id within the target system (e.g. Tailor)
export const type = 'SEQUENCE';

// Display name (e.g. shown to the author)
export const name = 'Sequence';

// Function which inits element state (data property on the Content Element
// entity). A sequence starts with two empty entries.
export const initState: DataInitializer = (): ElementData => ({
  numbered: true,
  embeds: {},
  items: {
    [id1]: { id: id1, title: '', body: {}, position: 1 },
    [id2]: { id: id2, title: '', body: {}, position: 2 },
  },
});

// Can be loaded from package.json
export const version = '1.0';

// UI configuration for Tailor CMS
const ui = {
  // Display icon, https://pictogrammers.com/library/mdi/
  icon: 'mdi-timeline-text',
  // Does element support only full width or can be used within layouts
  // (e.g. 50/50 layout)
  forceFullWidth: true,
};

// A sequence is empty when it has no entries.
export const isEmpty = (data: ElementData): boolean =>
  !data.items || Object.keys(data.items).length === 0;

export const ai: AiConfig = {
  Schema: {
    type: 'json_schema',
    name: 'ce_sequence',
    schema: {
      type: 'object',
      properties: {
        entries: {
          type: 'array',
          minItems: 2,
          items: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              content: { type: 'string' },
            },
            required: ['title', 'content'],
            additionalProperties: false,
          },
        },
      },
      required: ['entries'],
      additionalProperties: false,
    },
  },
  getPrompt: (): string => `
    Generate a sequence content element as an object with the following
    properties:
    {
      "entries": [
        {
          "title": "",
          "content": ""
        }
      ]
    }
    where:
      - 'entries' is an ordered array of steps/entries where:
        - 'title' is a short heading for the entry. Do not prefix it with an
          ordinal or step number (e.g. "Step 1:", "1.", "First:") — entries are
          numbered automatically.
        - 'content' is a paragraph of detail for the entry.
  `,
  processResponse: (val: any): Record<string, any> => {
    // Models tend to prepend redundant numbering (e.g. "Step 1:", "1.") despite
    // the prompt; entries are numbered automatically, so strip it.
    const stripOrdinal = (title: string): string =>
      title.replace(/^\s*(step\s*)?\d+\s*[.):-]\s*/i, '').trim();
    const result = val.entries.reduce(
      (
        acc: Record<string, any>,
        entry: { title: string; content: string },
        index: number,
      ) => {
        const embedId = uuid();
        const itemId = uuid();
        acc.embeds[embedId] = {
          id: embedId,
          data: { content: entry.content },
          embedded: true,
          position: 1,
          type: 'TIPTAP_HTML',
        };
        acc.items[itemId] = {
          id: itemId,
          title: stripOrdinal(entry.title),
          body: { [embedId]: true },
          position: index + 1,
        };
        return acc;
      },
      { items: {}, embeds: {} },
    );
    return { ...result, numbered: true };
  },
};

const manifest: ElementManifest = {
  type,
  version,
  name,
  isComposite: true,
  ssr: false,
  initState,
  isEmpty,
  ui,
  ai,
};

export default manifest;
export * from './interfaces';
