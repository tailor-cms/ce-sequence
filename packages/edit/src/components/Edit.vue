<template>
  <div class="tce-sequence text-center">
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
          class="text-left"
          @delete="deleteItem(item.id)"
          @save="saveItem($event)"
          @toggle="toggleItem(item.id)"
        />
      </VExpandTransition>
    </VExpansionPanels>
    <VBtn
      v-if="!isReadonly"
      class="mt-4"
      prepend-icon="mdi-plus"
      text="Add Entry"
      variant="text"
      @click="addItem"
    />
  </div>
</template>

<script lang="ts" setup>
import { cloneDeep, isEqual, pick, pull, reduce, sortBy } from 'lodash-es';
import { computed, inject, reactive, ref, watch } from 'vue';
import type {
  Element,
  ElementData,
  SequenceMode,
} from '@tailor-cms/ce-sequence-manifest';
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

const items = computed({
  get: () => sortBy(elementData.items, 'position'),
  set: (reordered) => {
    reordered.forEach(({ id }, i) => (elementData.items[id].position = i + 1));
    emit('save', elementData);
  },
});
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

const toggleItem = (id: string) => {
  if (expanded.value.includes(id)) pull(expanded.value, id);
  else expanded.value.push(id);
};

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

useDraggable(panels, items, {
  animation: 150,
  handle: '.sequence-drag-handle',
});

watch(
  () => props.element.data,
  (data) => {
    if (isEqual(data, elementData)) return;
    Object.assign(elementData, cloneDeep(data));
  },
);
</script>

<style lang="scss" scoped>
:deep(.sortable-ghost) > * {
  visibility: hidden;
}
</style>
