import type * as common from '@tailor-cms/cek-common';

// A single sequence entry. `body` is an embed container — it maps the ids of
// the content elements embedded under this entry.
export interface SequenceItem {
  id: string;
  title: string;
  body: Record<string, any>;
  position: number;
}

export interface ElementData extends common.ElementConfig {
  // When true, each entry's node shows its position number.
  numbered: boolean;
  // Flat map of every embedded content element across all entries.
  embeds: Record<string, any>;
  // The sequence — keyed by entry id.
  items: Record<string, SequenceItem>;
}

export type DataInitializer = common.DataInitializer<ElementData>;
export type Element = common.Element<ElementData>;
export type ElementManifest = common.ElementManifest<ElementData>;
