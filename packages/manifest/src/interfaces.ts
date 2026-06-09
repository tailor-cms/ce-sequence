import type * as common from '@tailor-cms/cek-common';

// 'steps' presents an ordered process (entries show their position number);
// 'timeline' presents a chronology (entries show their date marker instead).
export type SequenceMode = 'steps' | 'timeline';

// A single sequence entry. `body` is an embed container — it maps the ids of
// the content elements embedded under this entry.
export interface SequenceItem {
  id: string;
  // Date/year label shown in 'timeline' mode, e.g. "1990" or "Q1 2024".
  marker: string;
  title: string;
  body: Record<string, any>;
  position: number;
}

export interface ElementData extends common.ElementConfig {
  // Controls how entries are presented — see SequenceMode.
  mode: SequenceMode;
  // Flat map of every embedded content element across all entries.
  embeds: Record<string, any>;
  // The sequence — keyed by entry id.
  items: Record<string, SequenceItem>;
}

export type DataInitializer = common.DataInitializer<ElementData>;
export type Element = common.Element<ElementData>;
export type ElementManifest = common.ElementManifest<ElementData>;
