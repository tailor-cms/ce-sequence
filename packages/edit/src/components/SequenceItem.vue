<!-- eslint-disable vue/no-undef-components -->
<template>
  <VExpansionPanel :value="item.id" class="border sm">
    <VHover v-slot="{ isHovering, props: hoverProps }">
      <VExpansionPanelTitle
        v-bind="hoverProps"
        class="pa-2 pr-4"
        min-height="56"
        readonly
        @click="onTitleClick"
      >
        <div class="d-flex align-center w-100 ga-2">
          <span
            v-if="!isReadonly"
            class="sequence-drag-handle"
            @drag.stop.prevent
          >
            <VIcon icon="mdi-drag-vertical" />
          </span>
          <VAvatar
            v-if="mode === 'steps'"
            color="surface-container-highest"
            size="26"
            start
          >
            <span class="text-label-large">{{ position }}</span>
          </VAvatar>
          <template v-else>
            <VTextField
              v-model="draft.marker"
              :readonly="isReadonly"
              bg-color="transparent"
              class="sequence-item-marker flex-grow-0"
              density="compact"
              placeholder="Date"
              variant="plain"
              width="120"
              hide-details
              @blur="save.flush()"
              @keyup.space.prevent
              @update:model-value="save"
            />
            <VDivider class="mx-2 my-1" opacity="0.5" vertical />
          </template>
          <VTextField
            v-model="draft.title"
            :readonly="isReadonly"
            bg-color="transparent"
            class="sequence-item-title"
            density="compact"
            placeholder="Title"
            variant="plain"
            hide-details
            @blur="save.flush()"
            @keyup.space.prevent
            @update:model-value="save"
          />
          <VFadeTransition>
            <VBtn
              v-if="(isHovering || isExpanded) && !isReadonly && allowDeletion"
              v-tooltip:bottom="{ text: 'Delete entry', openDelay: 300 }"
              aria-label="Delete entry"
              class="mr-2"
              color="error"
              density="comfortable"
              icon="mdi-trash-can-outline"
              size="small"
              variant="tonal"
              @click.stop="deleteEntry"
            />
          </VFadeTransition>
        </div>
      </VExpansionPanelTitle>
    </VHover>
    <VExpansionPanelText>
      <VAlert
        v-if="!hasElements"
        class="mx-6 mt-4"
        icon="mdi-information-outline"
        variant="tonal"
        prominent
      >
        <template v-if="isReadonly">
          No content elements added to this entry.
        </template>
        <template v-else>
          Click the button below to add a content element.
        </template>
      </VAlert>
      <TailorEmbeddedContainer
        :allowed-element-config="embedElementConfig"
        :container="{ embeds }"
        :is-readonly="isReadonly"
        class="text-center"
        @delete="deleteEmbed"
        @save="saveEmbed($event.embeds)"
      />
    </VExpansionPanelText>
  </VExpansionPanel>
</template>

<script lang="ts" setup>
import { cloneDeep, debounce, forEach, isEmpty } from 'lodash-es';
import { computed, inject, reactive } from 'vue';
import type {
  SequenceItem,
  SequenceMode,
} from '@tailor-cms/ce-sequence-manifest';

const SAVE_DEBOUNCE = 3000;

interface Embed {
  id: string;
  data: Record<string, any>;
  embedded: boolean;
  position: number;
  type: string;
}

interface Props {
  allowDeletion: boolean;
  item: SequenceItem;
  position: number;
  mode: SequenceMode;
  embedElementConfig: any[];
  embeds?: Record<string, Embed>;
  isReadonly?: boolean;
  isExpanded?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  embeds: () => ({}),
  isReadonly: false,
  isExpanded: false,
});
const emit = defineEmits<{
  save: [payload: { item: SequenceItem; embeds?: Record<string, Embed> }];
  delete: [];
  toggle: [];
}>();

const eventBus = inject('$eventBus') as any;

const draft = reactive({
  marker: props.item.marker,
  title: props.item.title,
});

const hasElements = computed(() => !isEmpty(props.embeds));

// Header toggle is off (`readonly`) so field clicks don't collapse the panel;
// toggling here instead of stopping propagation keeps the click bubbling up to
// the host, which is what focuses the element.
const onTitleClick = ({ target }: MouseEvent) => {
  if ((target as HTMLElement).closest('.v-input, .v-btn')) return;
  emit('toggle');
};

const currentItem = (): SequenceItem => ({
  ...cloneDeep(props.item),
  ...draft,
});

const save = debounce(() => {
  emit('save', { item: currentItem(), embeds: props.embeds });
}, SAVE_DEBOUNCE);

const saveEmbed = (embeds: Record<string, Embed>) => {
  const item = currentItem();
  forEach(embeds, (it) => (item.body[it.id] = true));
  emit('save', { item, embeds });
};

const deleteEmbed = (embed: { id: string }) => {
  const item = currentItem();
  const embeds = cloneDeep(props.embeds);
  delete embeds[embed.id];
  delete item.body[embed.id];
  emit('save', { item, embeds });
};

const deleteEntry = () => {
  return eventBus.channel('app').emit('showConfirmationModal', {
    title: 'Delete entry',
    message: 'Are you sure you want to delete this entry?',
    action: () => emit('delete'),
  });
};
</script>

<style lang="scss" scoped>
.sequence-drag-handle {
  cursor: pointer;
}

.sequence-item-title,
.sequence-item-marker {
  :deep(.v-field) {
    --v-field-input-padding-top: 0;
  }
}
</style>
