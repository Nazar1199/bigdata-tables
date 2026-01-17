<script setup lang="ts">
defineProps<{
  id: number;
}>();
</script>

<template>
  <div class="item-row">
    Item #{{ id }}
  </div>
</template>

<style scoped>
.item-row {
  padding: 8px 12px;
  border-bottom: 1px solid #eee;
  background: transparent;
}
</style>
