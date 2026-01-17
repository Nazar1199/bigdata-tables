import { onUnmounted, watch, type Ref } from "vue"

export function useInfiniteScroll(
  el: Ref<HTMLElement | null>,
  callback: () => void,
  options?: {
    enabled?: () => boolean
    root?: Ref<HTMLElement | null>
  }
) {
  const enabled = options?.enabled ?? (() => true)
  const root = options?.root

  let observer: IntersectionObserver | null = null

  const setupObserver = () => {
    if (!el.value) return

    if (observer) {
      observer.disconnect()
      observer = null
    }

    observer = new IntersectionObserver(
      (entries) => {
        if (!enabled()) return

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            callback()
          }
        })
      },
      {
        root: root?.value ?? null,
        rootMargin: "100px",
        threshold: 0.01,
      }
    )

    observer.observe(el.value)
  }

  watch(
    () => ({ el: el.value, root: root?.value }),
    () => setupObserver(),
    { deep: false }
  )

  setupObserver()

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  })
}
