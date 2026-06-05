import { ai, initState, type } from '@tailor-cms/ce-sequence-manifest';
import type { HookMap, ServerModule } from '@tailor-cms/cek-common';
import type { Element } from '@tailor-cms/ce-sequence-manifest';

// Sequence is a presentational composite — no authoring or delivery hooks
// are needed. Child element hooks run on the embedded elements themselves.
export const hookMap: HookMap<Element> = new Map();

const serverModule: ServerModule<Element> = {
  type,
  initState,
  hookMap,
  ai,
};

export default serverModule;
export { type, initState, ai };
