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
  mode: 'steps',
  embeds: {},
  items: {
    [id1]: { id: id1, marker: '', title: '', body: {}, position: 1 },
    [id2]: { id: id2, marker: '', title: '', body: {}, position: 2 },
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
        mode: { type: 'string', enum: ['steps', 'timeline'] },
        entries: {
          type: 'array',
          minItems: 2,
          items: {
            type: 'object',
            properties: {
              marker: { type: 'string' },
              title: { type: 'string' },
              content: { type: 'string' },
            },
            required: ['marker', 'title', 'content'],
            additionalProperties: false,
          },
        },
      },
      required: ['mode', 'entries'],
      additionalProperties: false,
    },
  },
  getPrompt: (): string => `
    Generate a sequence content element as an object with the following
    properties:
    {
      "mode": "steps" | "timeline",
      "entries": [
        {
          "marker": "",
          "title": "",
          "content": ""
        }
      ]
    }
    where:
      - 'mode' describes how the sequence is presented. Choose it from the topic:
        - 'timeline' for chronological subjects (historical events, milestones,
          anything organised by date or period).
        - 'steps' for procedural subjects (how-tos, processes, ordered
          instructions).
      - 'entries' is an ordered array of entries where:
        - 'marker' is the entry's date or period (e.g. "1990", "Q1 2024",
          "Day 1") — fill it only in 'timeline' mode; leave it "" in 'steps'
          mode.
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
    const isTimeline = val.mode === 'timeline';
    const result = val.entries.reduce(
      (
        acc: Record<string, any>,
        entry: { marker: string; title: string; content: string },
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
          marker: isTimeline ? (entry.marker ?? '') : '',
          title: stripOrdinal(entry.title),
          body: { [embedId]: true },
          position: index + 1,
        };
        return acc;
      },
      { items: {}, embeds: {} },
    );
    return { ...result, mode: isTimeline ? 'timeline' : 'steps' };
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
