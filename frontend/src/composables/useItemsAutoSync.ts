import { onMounted, onUnmounted } from "vue"
import { useItemsStore } from "../stores/items.store"

export function useItemsAutoSync(options?: {
  intervalMs?: number
  enabled?: boolean
}) {
  const {
    intervalMs = 10000,
    enabled = true,
  } = options ?? {}

  const store = useItemsStore()
  let timer: number | null = null

  function tick() {
    if (!store.dirty) {
      console.log("[AUTO SYNC] skip — not dirty")
      return
    }

    if (store.syncing) {
      console.log("[AUTO SYNC] skip — syncing")
      return
    }

    console.log("[AUTO SYNC] syncing…")
    store.sync()
  }

  onMounted(() => {
    if (!enabled) return

    timer = window.setInterval(tick, intervalMs)
  })

  onUnmounted(() => {
    if (timer !== null) {
      clearInterval(timer)
      timer = null
    }
  })
}
