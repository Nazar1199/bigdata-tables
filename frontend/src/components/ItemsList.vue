<script setup lang="ts">
import { ref, computed } from "vue"
import { useDroppable } from "@vue-dnd-kit/core"
import DraggableItem from "./DraggableItem.vue"
import { useInfiniteScroll } from "../composables/useInfiniteScroll"

const props = defineProps<{
  items: number[]
  list: "left" | "right"
  reorderEnabled?: boolean
  onLoadMore: () => void
  onReorder?: (id: number, newIndex: number) => void
  onItemClick?: (id: number) => void
  loading: boolean
}>()  

const sentinel = ref<HTMLElement | null>(null)
const hoveredItem = ref<any>(null)

// provide для DraggableItem компонентов
import { provide } from "vue"
provide("hoveredItem", hoveredItem)

const { elementRef: listRef } = useDroppable({
  groups: ["items"],
  data: computed(() => ({
    list: props.list,
  })),
})

useInfiniteScroll(
  sentinel,
  props.onLoadMore,
  {
    enabled: () => !props.loading,
    root: listRef,
  }
)

function handleDrop(hovered: any, payload: any) {
  if (!props.reorderEnabled || !props.onReorder) return

  const dragged = payload?.items?.[0]?.data

  if (!dragged || !hovered) {
    console.warn("[DROP] missing dragged or hovered", { dragged, hovered })
    return
  }

  const from = dragged
  const to = hovered

  if (
    from.list !== "right" ||
    to.list !== "right" ||
    from.index === to.index
  ) {
    return
  }

  console.log("[REORDER]", from.id, "→", to.index)
  props.onReorder(from.id, to.index)
}
</script>

<template>
  <div ref="listRef" class="items-list">
    <DraggableItem
      v-for="(item, index) in items"
      :key="item"
      :item="item"
      :index="index"
      :list="list"
      :disabled="!reorderEnabled"
      @drop="handleDrop"
      @click="onItemClick?.(item)"
    />

    <div ref="sentinel" class="load-more-trigger" />
  </div>
</template>

<style scoped>
.items-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: calc(90vh - 60px);
  min-height: 0; 
  
  scrollbar-width: thin;
  scrollbar-color: #3a3a3aff #030303ff;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #3a3a3aff;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #3a3a3aff;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #3a3a3aff;
  }
}

.load-more-trigger {
  height: 1px;
}
</style>
