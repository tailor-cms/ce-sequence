<template>
  <div>
    <div class="text-label-large mb-2">Mode</div>
    <VBtnToggle
      :model-value="mode"
      density="comfortable"
      mandatory
      @update:model-value="onChange"
    >
      <VBtn
        prepend-icon="mdi-format-list-numbered"
        text="Steps"
        value="steps"
      />
      <VBtn
        prepend-icon="mdi-timeline-outline"
        text="Timeline"
        value="timeline"
      />
    </VBtnToggle>
  </div>
</template>

<script setup lang="ts">
import type { Element, SequenceMode } from '@tailor-cms/ce-sequence-manifest';
import { inject, ref } from 'vue';

const props = defineProps<{ element: Element }>();

const elementBus: any = inject('$elementBus');

const mode = ref<SequenceMode>(props.element.data.mode ?? 'steps');

const onChange = (value: SequenceMode) => {
  if (!value) return;
  mode.value = value;
  elementBus.emit('mode', value);
};
</script>
