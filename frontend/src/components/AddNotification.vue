<script setup lang="ts">
import { computed } from "vue"
import { useItemsStore } from "../stores/items.store"

const store = useItemsStore()

const visible = computed(() => store.hasPendingAdd)
const progress = computed(() => store.addProgress)
</script>

<template>
  <transition name="fade">
    <div v-if="visible" class="notification">
      <div class="title">
        Adding {{ store.pendingAdds.length }} item(s)
      </div>

      <div class="progress">
        <div class="bar" :style="{ width: progress + '%' }" />
      </div>
    </div>
  </transition>
</template>

<style scoped>
.notification {
  position: fixed;
  top: 16px;
  right: 16px;

  width: 260px;
  padding: 12px;

  background: #111;
  border: 1px solid #444;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,.4);
}

.title {
  font-size: 14px;
  margin-bottom: 8px;
}

.progress {
  height: 6px;
  background: #333;
  border-radius: 3px;
  overflow: hidden;
}

.bar {
  height: 100%;
  background: #4ade80;
  transition: width 0.1s linear;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>