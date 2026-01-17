import { defineStore } from "pinia";
import { ItemsApi } from "../api/items.api";

const ADD_BATCH_DELAY = 10000;

export const useItemsStore = defineStore("items", {
  state: () => ({
    leftItems: [] as number[],
    rightItems: [] as number[],
    leftOffset: 0,
    rightOffset: 0,
    leftSearch: undefined as number | undefined,
    rightSearch: undefined as number | undefined,
    loadingLeft: false,
    loadingRight: false,
    syncing: false,
    dirty: false,
    isDragging: false,
    
    pendingAdds: [] as number[],
    addBatchStartedAt: 0,
    addBatchDeadline: 0,
    addBatchTimer: null as number | null,
  }),

    getters: {
      hasPendingAdd(state) {
        return state.pendingAdds.length > 0;
      },

      addProgress(state) {
        if (!state.addBatchDeadline) return 0;

        const now = Date.now();
        const total = state.addBatchDeadline - state.addBatchStartedAt;
        const passed = now - state.addBatchStartedAt;

        return Math.min(100, Math.max(0, (passed / total) * 100));
      },
    },


  actions: {
    async loadLeft(reset = false) {
      if (this.loadingLeft) return

      this.loadingLeft = true

      if (reset) {
        this.leftItems = [];
        this.leftOffset = 0;
      }

      const { data } = await ItemsApi.getItems({
        side: "left",
        offset: this.leftOffset,
        limit: 20,
        search: this.leftSearch,
      });

      this.leftItems.push(...data.items);
      this.leftOffset += 20;

      this.loadingLeft = false
    },

    
    async setLeftSearch(value?: number) {
      if (this.leftSearch === value) return

      this.leftSearch = value
      await this.loadLeft(true)
    },

    async setRightSearch(value?: number) {
      if (this.rightSearch === value) return

      this.rightSearch = value
      await this.loadRight(true)
    },

    async sync() {
      if (this.syncing || this.dragging) return

      this.syncing = true
      this.dirty = false

      this.leftItems = []
      this.rightItems = []
      this.leftOffset = 0
      this.rightOffset = 0

      await Promise.all([
        this.loadLeft(true),
        this.loadRight(true),
      ])

      this.syncing = false
    },


    async selectItem(id: number) {
      await ItemsApi.selectItem(id)
      this.dirty = true

      this.leftItems = this.leftItems.filter(i => i !== id)
      this.rightItems.unshift(id)
    },

    async unselectItem(id: number) {
      await ItemsApi.unselectItem(id)
      this.dirty = true

      this.rightItems = this.rightItems.filter(i => i !== id)
      this.leftItems.unshift(id)
    },

    async reorderItem(id: number, newIndex: number) {
      await ItemsApi.reorderItem(id, newIndex)
      this.dirty = true

      const oldIndex = this.rightItems.indexOf(id)
      if (oldIndex === -1) return

      this.rightItems.splice(oldIndex, 1)
      this.rightItems.splice(newIndex, 0, id)
    },
    async addLeftItem(id: number) {
  if (this.leftItems.includes(id)) return
  if (this.pendingAdds.includes(id)) return

  this.pendingAdds.push(id)

  if (!this.addBatchTimer) {
    const now = Date.now()

    this.addBatchStartedAt = now
    this.addBatchDeadline = now + ADD_BATCH_DELAY

    this.addBatchTimer = window.setTimeout(() => {
      this.flushAddBatch()
    }, ADD_BATCH_DELAY)
  }
    },

    async flushAddBatch() {
      const ids = [...this.pendingAdds]

      this.pendingAdds = []

      if (this.addBatchTimer) {
        clearTimeout(this.addBatchTimer)
        this.addBatchTimer = null
      }

      this.addBatchStartedAt = 0
      this.addBatchDeadline = 0

      try {
        await Promise.all(ids.map(id => ItemsApi.addItem(id)))

        this.leftItems.unshift(...ids.reverse())
        this.leftOffset += ids.length
      } catch (e) {
        console.error("Failed to add items", e)
      }
    },

    async loadRight(reset = false) {
      if (this.loadingRight) return

      this.loadingRight = true

      if (reset) {
        this.rightItems = [];
        this.rightOffset = 0;
      }

      const { data } = await ItemsApi.getItems({
        side: "right",
        offset: this.rightOffset,
        limit: 20,
        search: this.rightSearch,
      });

      this.rightItems.push(...data.items);
      this.rightOffset += 20;

      this.loadingRight = false
    },

    setDragging(value: boolean) {
      this.isDragging = value
    },
  },
});
