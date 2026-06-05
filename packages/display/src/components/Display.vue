<!-- eslint-disable vue/no-undef-components -->
<template>
  <div class="tce-sequence-root">
    <VTimeline
      align="start"
      density="comfortable"
      side="end"
      truncate-line="both"
    >
      <VTimelineItem
        v-for="(item, index) in items"
        :key="item.id"
        dot-color="primary"
        size="large"
      >
        <template v-if="numbered" #icon>
          <span class="sequence-item-index font-weight-bold">
            {{ index + 1 }}
          </span>
        </template>
        <div class="mt-2">
          <div v-if="item.title" class="sequence-item-title mb-2">
            {{ item.title }}
          </div>
          <TailorEmbeddedContainer :elements="embedsByItem[item.id]" />
        </div>
      </VTimelineItem>
    </VTimeline>
  </div>
</template>

<script setup lang="ts">
import { at, sortBy } from 'lodash-es';
import type { Element, SequenceItem } from '@tailor-cms/ce-sequence-manifest';
import { computed } from 'vue';

const props = defineProps<{ element: Element; userState: any }>();

const numbered = computed(() => props.element.data.numbered ?? true);

const items = computed<SequenceItem[]>(() =>
  sortBy(props.element.data.items, 'position'),
);

const embedsByItem = computed(() =>
  items.value.reduce(
    (acc, { id, body }) => {
      const { embeds } = props.element.data;
      acc[id] = sortBy(at(embeds, Object.keys(body)), 'position');
      return acc;
    },
    {} as Record<string, any[]>,
  ),
);
</script>

<style scoped>
.tce-sequence-root {
  text-align: left;
}

.sequence-item-title {
  font-size: 1.25rem;
  font-weight: bold;
}
</style>
