<script setup lang="ts">
import { computed, inject, ref } from "vue"
import { useDraggable, useDroppable } from "@vue-dnd-kit/core"
import { useItemsStore } from "../stores/items.store"

const store = useItemsStore()
const props = defineProps<{
  item: number
  index: number
  list: "left" | "right"
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: "drop", hovered: any, payload: any): void
  (e: "click", id: number): void
}>()

const hoveredItem = inject<{ value: any }>("hoveredItem", { value: null })
const isHoveredLocally = ref(false)

/* ---------- DROPPABLE ---------- */
// const { elementRef: dropRef } = useDroppable({
//   groups: ["items"],
//   data: computed(() => ({
//     id: props.item,
//     index: props.index,
//     list: props.list,
//   })),
// })

/* ---------- DRAGGABLE ---------- */
const {
  elementRef: dragRef,
  isDragging,
  handleDragStart,
} = useDraggable({
  groups: ["items"],
  disabled: computed(() => props.disabled),
  data: computed(() => ({
    id: props.item,
    index: props.index,
    list: props.list,
  })),
  events: {
    onStart: () => {
      store.setDragging(true)
    },
    onEnd: (_store, payload) => {
      store.setDragging(false)
      const hovered = hoveredItem?.value
      emit("drop", hovered, payload)
      if (hoveredItem) {
        hoveredItem.value = null
      }
    },
  },
})

const handleMouseEnter = () => {
  if (!store.isDragging) return
  
  isHoveredLocally.value = true
  if (hoveredItem) {
    hoveredItem.value = {
      id: props.item,
      index: props.index,
      list: props.list,
    }
  }
}

const handleMouseLeave = () => {
  isHoveredLocally.value = false
  if (hoveredItem?.value?.id === props.item) {
    hoveredItem.value = null
  }
}
</script>

<template>
  <div 
    ref="dropRef" 
    class="row" 
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div
      ref="dragRef"
      class="draggable"
      :style="{ marginTop: (isHoveredLocally && store.isDragging) ? '30px' : '0' }"
      :class="{ dragging: isDragging }"
      @pointerdown.self="handleDragStart"
      @click="emit('click', item)"
    >
      Item #{{ item }}
    </div>
  </div>
</template>

<style scoped>
.row {
  position: relative;
  transition: margin-top 0.2s ease;
}

.draggable {
  border-radius: 8px;
  height: 30px;
  align-content: center;
  transition: all 0.25s ease;
  cursor: grab;
}

.draggable:hover {
  background: #222;
  transform: translateY(-2px);
}

.dragging {
  opacity: 0.6;
  cursor: grabbing;
}
</style>