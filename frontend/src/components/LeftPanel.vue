<script setup lang="ts">
import { ref, watch } from "vue"
import { useItemsStore } from "../stores/items.store"
import ItemsList from "./ItemsList.vue"

const store = useItemsStore()
const search = ref<string>("")

watch(search, (value) => {
  const num = value === "" ? undefined : Number(value)
  if (value !== "" && Number.isNaN(num)) return

  store.setLeftSearch(num)
})

function addItem() {
  if (search.value === "") return

  const id = Number(search.value)
  if (Number.isNaN(id)) return

  store.addLeftItem(id)
  search.value = ""
}
</script>

<template>
  <div class="panel">
    <h2>Available items</h2>

    <input
      v-model="search"
      type="text"
      inputmode="numeric"
      placeholder="Search by ID OR add (Enter)"
      class="search"
      @keydown.enter="addItem"
    />

    <ItemsList
      list="left"
      :items="store.leftItems"
      :reorderEnabled="false"
      :onLoadMore="() => store.loadLeft()"
      :onItemClick="id => store.selectItem(id)"
      :loading="store.loadingLeft"
    />
  </div>
</template>



<style scoped>
.search {
  margin-bottom: 8px;
  margin-top: 8px;
  padding: 4px 8px;
  border: 1px solid #777;
  border-radius: 16px;
}
.panel {
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  border: 1px solid #777;
  padding: 8px;
  height: 90vh;
}
h2 {
  margin: 0;
  margin-top: 16px;
  margin-bottom: 8px;
}
.items-list {
  flex-grow: 1;
  margin: 0;
}
</style>
