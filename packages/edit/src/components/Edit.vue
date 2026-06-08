<template>
  <VCard class="tce-sequence" color="grey-lighten-5">
    <VToolbar class="px-4" color="primary-darken-2" height="36">
      <VIcon
        :icon="manifest.ui.icon"
        color="secondary-lighten-2"
        size="18"
        start
      />
      <span class="text-title-small">{{ manifest.name }}</span>
    </VToolbar>
    <div class="pa-6 text-center">
      <VExpansionPanels
        ref="panels"
        v-model="expanded"
        rounded="lg"
        flat
        multiple
      >
        <VExpandTransition v-if="!!itemCount" group>
          <SequenceItem
            v-for="(item, index) in items"
            :key="item.id"
            :allow-deletion="itemCount > 1"
            :embed-element-config="embedElementConfig"
            :embeds="embedsByItem[item.id]"
            :is-expanded="expanded.includes(item.id)"
            :is-readonly="isReadonly"
            :item="item"
            :mode="elementData.mode"
            :position="index + 1"
            @delete="deleteItem(item.id)"
            @save="saveItem($event)"
          />
        </VExpandTransition>
      </VExpansionPanels>
      <VBtn
        v-if="!isReadonly"
        class="mt-6"
        color="primary-darken-4"
        prepend-icon="mdi-plus"
        text="Add Entry"
        variant="text"
        @click="addItem"
      />
    </div>
  </VCard>
</template>

<script lang="ts" setup>
import { cloneDeep, isNumber, pick, pull, reduce, sortBy } from 'lodash-es';
import { computed, inject, reactive, ref } from 'vue';
import type {
  Element,
  ElementData,
  SequenceMode,
} from '@tailor-cms/ce-sequence-manifest';
import manifest from '@tailor-cms/ce-sequence-manifest';
import { useDraggable } from 'vue-draggable-plus';
import { v4 as uuid } from 'uuid';

import SequenceItem from './SequenceItem.vue';

const props = defineProps<{
  element: Element;
  embedElementConfig: any[];
  isDragged: boolean;
  isFocused: boolean;
  isReadonly: boolean;
}>();
const emit = defineEmits<{
  save: [data: ElementData];
}>();

const elementBus: any = inject('$elementBus');

const expanded = ref<string[]>([]);
const elementData = reactive<ElementData>(cloneDeep(props.element.data));
const panels = ref();

elementBus.on('mode', (mode: SequenceMode) => {
  elementData.mode = mode;
  emit('save', elementData);
});

const items = computed(() => sortBy(elementData.items, 'position'));
const itemCount = computed(() => items.value.length);
const embedsByItem = computed(() =>
  reduce(
    elementData.items,
    (acc, item) => {
      acc[item.id] = pick(elementData.embeds, Object.keys(item.body));
      return acc;
    },
    {} as any,
  ),
);

const saveItem = ({ item, embeds = {} }: any) => {
  elementData.items[item.id] = item;
  Object.assign(elementData.embeds, embeds);
  emit('save', elementData);
};

const deleteItem = (id: string) => {
  const { body } = elementData.items[id];
  Object.keys(body).forEach((embedId) => delete elementData.embeds[embedId]);
  delete elementData.items[id];
  if (expanded.value.includes(id)) pull(expanded.value, id);
  emit('save', elementData);
};

const addItem = () => {
  const id = uuid();
  elementData.items[id] = {
    id,
    marker: '',
    title: '',
    body: {},
    position: itemCount.value + 1,
  };
  expanded.value.push(id);
  emit('save', elementData);
};

const calculateNewPosition = (oldIndex: number, newIndex: number) => {
  if (!newIndex) return items.value[newIndex].position / 2;
  if (newIndex + 1 === itemCount.value) {
    return items.value[newIndex].position + 1;
  }
  const direction = oldIndex > newIndex ? -1 : 1;
  const prevPos = items.value[newIndex].position;
  const nextPos = items.value[newIndex + direction].position;
  return (nextPos + prevPos) / 2;
};

// useDraggable binds Sortable to the panels root element, lifecycle handled
// for us. Reorder math mirrors the carousel/accordion elements.
useDraggable(panels, {
  animation: 150,
  handle: '.sequence-drag-handle',
  onUpdate: ({ oldIndex, newIndex }) => {
    if (!isNumber(newIndex) || !isNumber(oldIndex)) return;
    const position = calculateNewPosition(oldIndex, newIndex);
    const currentItem = items.value[oldIndex];
    Object.assign(elementData.items[currentItem.id], { position });
    emit('save', elementData);
  },
});
</script>

<style lang="scss" scoped>
.tce-sequence {
  text-align: left;
}

:deep(.sortable-ghost) > * {
  visibility: hidden;
}
</style>
