import { IItemsStore, GetItemsParams } from "./IItemsStore";

export class MemoryItemsStore implements IItemsStore {
  private allItems = new Set<number>();
  private selectedItems: number[] = [];
  private selectedSet = new Set<number>();

  constructor(initialCount = 1_000_000) {
    for (let i = 1; i <= initialCount; i++) {
      this.allItems.add(i);
    }
  }

  async hasItem(id: number): Promise<boolean> {
    return this.allItems.has(id);
  }

  async addItem(id: number): Promise<void> {
    this.allItems.add(id);
  }

  async getAllItemsCount(): Promise<number> {
    return this.allItems.size;
  }

  /* ========= Left list ========= */

  async getUnselectedItems({
    offset,
    limit,
    search,
  }: GetItemsParams): Promise<number[]> {
    let result: number[] = [];

    for (const id of this.allItems) {
      if (this.selectedSet.has(id)) continue;
      if (search !== undefined && id !== search) continue;

      if (result.length >= offset + limit) break;
      result.push(id);
    }

    return result.slice(offset, offset + limit);
  }

  /* ========= Selected ========= */

  async getSelectedItems({
    offset,
    limit,
    search,
  }: GetItemsParams): Promise<number[]> {
    let list = this.selectedItems;

    if (search !== undefined) {
      list = list.filter((id) => id === search);
    }

    return list.slice(offset, offset + limit);
  }

  async getSelectedItemsCount(): Promise<number> {
    return this.selectedItems.length;
  }

  async selectItem(id: number): Promise<void> {
    if (this.selectedSet.has(id)) return;
    if (!this.allItems.has(id)) return;

    this.selectedItems.unshift(id);
    this.selectedSet.add(id);
  }

  async unselectItem(id: number): Promise<void> {
    if (!this.selectedSet.has(id)) return;

    this.selectedSet.delete(id);
    this.selectedItems = this.selectedItems.filter(
      (itemId) => itemId !== id
    );
  }

  async reorderSelectedItem(
    id: number,
    newIndex: number
  ): Promise<void> {
    const currentIndex = this.selectedItems.indexOf(id);
    if (currentIndex === -1) return;

    this.selectedItems.splice(currentIndex, 1);
    this.selectedItems.splice(newIndex, 0, id);
  }
}
