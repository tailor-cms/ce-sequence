<template>
  <VSwitch
    :model-value="numbered"
    color="primary"
    density="compact"
    hint="Show each entry's position number on its node."
    label="Numbered"
    persistent-hint
    @update:model-value="onChange"
  />
</template>

<script setup lang="ts">
import { inject, ref } from 'vue';
import type { Element } from '@tailor-cms/ce-sequence-manifest';

const props = defineProps<{ element: Element }>();

const elementBus: any = inject('$elementBus');

const numbered = ref<boolean>(props.element.data.numbered ?? true);

const onChange = (value: boolean | null) => {
  numbered.value = !!value;
  elementBus.emit('numbered', numbered.value);
};
</script>
