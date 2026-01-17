<script setup lang="ts">
import LeftPanel from "../components/LeftPanel.vue";
import RightPanel from "../components/RightPanel.vue";
import { useItemsAutoSync } from "../composables/useItemsAutoSync"
useItemsAutoSync({ intervalMs: 2000 })
</script>

<template>
  <div class="page">
    <LeftPanel />
    <RightPanel />
  </div>
</template>

<style scoped>
.page {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  box-sizing: border-box;
}
</style>
