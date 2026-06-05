<template>
  <div>
    <p>Edit element side toolbar {{ element?.id }}</p>
  </div>
</template>

<script setup lang="ts">
import type { Element, ElementData } from '@tailor-cms/ce-timeline-manifest';

defineProps<{ element: Element }>();
defineEmits<{ save: [data: ElementData] }>();
</script>

<style scoped></style>
