<script setup lang="ts">
import { ref, watch } from "vue"
import { useItemsStore } from "../stores/items.store"
import ItemsList from "./ItemsList.vue"

const store = useItemsStore()
const search = ref<string>("")

watch(search, (value) => {
  const num = value === "" ? undefined : Number(value)
  if (value !== "" && Number.isNaN(num)) return

  store.setRightSearch(num)
})
</script>

<template>
  <div class="panel">
    <h2>Selected items</h2>

    <input
      v-model="search"
      type="text"
      inputmode="numeric"
      placeholder="Search by id"
      class="search"
    />

    <ItemsList
      list="right"
      :items="store.rightItems"
      :reorderEnabled="true"
      :onLoadMore="() => store.loadRight()"
      :onReorder="(id, index) => store.reorderItem(id, index)"
      :onItemClick="id => store.unselectItem(id)"
      :loading="store.loadingRight"
    />
  </div>
</template>

<style scoped>
.search {
  margin-top: 8px;
  margin-bottom: 8px;
  padding: 4px 8px;
  border: 1px solid #777;
  border-radius: 16px;
}
h2 {
  margin: 0;
  margin-top: 16px;
  margin-bottom: 8px;
}

.panel {
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  border: 1px solid #777;
  padding: 8px;
  height: 90vh;
}
</style>
