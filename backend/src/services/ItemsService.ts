import { IItemsService } from "./IItemsService";
import { IItemsStore, GetItemsParams } from "../storage/IItemsStore";
import { IQueueService } from "../queues/IQueueService";

export class ItemsService implements IItemsService {
  constructor(
    private store: IItemsStore,
    private queue: IQueueService
  ) {}

  /* ========= Read ========= */

  async getLeftItems(
    params: GetItemsParams
  ): Promise<number[]> {
    return this.store.getUnselectedItems(params);
  }

  async getRightItems(
    params: GetItemsParams
  ): Promise<number[]> {
    return this.store.getSelectedItems(params);
  }

  async getRightItemsCount(): Promise<number> {
    return this.store.getSelectedItemsCount();
  }

  /* ========= Write ========= */

  addItem(id: number): void {
    this.queue.enqueueAdd(id);
  }

  selectItem(id: number): void {
    this.queue.enqueueSelect(id);
  }

  unselectItem(id: number): void {
    this.queue.enqueueUnselect(id);
  }

  reorderItem(id: number, newIndex: number): void {
    this.queue.enqueueReorder(id, newIndex);
  }
}
