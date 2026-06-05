<!-- eslint-disable vue/no-undef-components -->
<template>
  <VExpansionPanel :value="item.id">
    <VHover v-slot="{ isHovering, props: hoverProps }">
      <VExpansionPanelTitle
        v-bind="hoverProps"
        class="pa-2 pr-4"
        color="primary-lighten-5"
        min-height="56"
      >
        <div class="d-flex align-center w-100 ga-2">
          <span
            v-if="!isReadonly"
            class="sequence-drag-handle"
            @drag.stop.prevent
          >
            <VIcon icon="mdi-drag-vertical" />
          </span>
          <VAvatar v-if="numbered" color="primary" size="24" start>
            <span class="text-caption">{{ position }}</span>
          </VAvatar>
          <VTextField
            v-model="draft.title"
            :readonly="isReadonly"
            autocomplete="off"
            bg-color="transparent"
            class="sequence-item-title"
            density="compact"
            placeholder="Title"
            variant="plain"
            flat
            hide-details
            @click.stop
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
        color="primary-darken-1"
        icon="mdi-information-outline"
        variant="tonal"
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
import type { SequenceItem } from '@tailor-cms/ce-sequence-manifest';

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
  numbered: boolean;
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
}>();

const eventBus = inject('$eventBus') as any;

// Local draft of the title so an in-flight debounced save doesn't clobber
// what the author is typing.
const draft = reactive({
  title: props.item.title,
});

const hasElements = computed(() => !isEmpty(props.embeds));

const currentItem = (): SequenceItem => ({
  ...cloneDeep(props.item),
  ...draft,
});

const save = debounce(() => {
  emit('save', { item: currentItem(), embeds: props.embeds });
}, 500);

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
.v-expansion-panel {
  border: thin solid rgba(0, 0, 0, 0.12);
}

.sequence-drag-handle {
  cursor: pointer;
}

.sequence-item-title:deep(.v-field) {
  --v-field-input-padding-top: 0;
}
</style>
