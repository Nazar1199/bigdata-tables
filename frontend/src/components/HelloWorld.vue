<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(false)
const error = ref('')
const data = ref(null)

const fetchData = async () => {
  loading.value = true
  error.value = ''
  data.value = null
  
  try {
    const response = await fetch(import.meta.env.VITE_API_URL + '/')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    data.value = await response.json()
    data.value = data.value.message
  } catch (err) {
    error.value = err.message
    console.error('Ошибка:', err)
  } finally {
    loading.value = false
  }
}
defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR

      
      <div>
        <button @click="fetchData">Получить данные</button>
        <div v-if="loading">Загрузка...</div>
        <div v-else-if="error">Ошибка: {{ error }}</div>
        <div v-else-if="data">
          <h3>Ответ сервера:</h3>
          <pre>{{ data }}</pre>
        </div>
      </div>
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Learn more about IDE Support for Vue in the
    <a
      href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support"
      target="_blank"
      >Vue Docs Scaling up Guide</a
    >.
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
