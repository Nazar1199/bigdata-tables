import { IQueueService } from "./IQueueService";
import { IItemsStore } from "../storage/IItemsStore";

export class QueueService implements IQueueService {
  /* ========= Queues ========= */

  private addQueue = new Set<number>();
  private selectQueue = new Set<number>();
  private unselectQueue = new Set<number>();
  private reorderQueue = new Map<number, number>();

  /* ========= Timers ========= */

  private addTimer?: NodeJS.Timeout;
  private changeTimer?: NodeJS.Timeout;

  constructor(private store: IItemsStore) {}

  enqueueAdd(id: number): void {
    this.addQueue.add(id);
  }

  enqueueSelect(id: number): void {
    this.selectQueue.add(id);
    this.unselectQueue.delete(id);
  }

  enqueueUnselect(id: number): void {
    this.unselectQueue.add(id);
    this.selectQueue.delete(id);
  }

  enqueueReorder(id: number, newIndex: number): void {
    this.reorderQueue.set(id, newIndex);
  }

  start(): void {
    this.addTimer = setInterval(
      () => this.processAddQueue(),
      10_000
    );

    this.changeTimer = setInterval(
      () => this.processChangeQueue(),
      1_000
    );
  }

  stop(): void {
    if (this.addTimer) clearInterval(this.addTimer);
    if (this.changeTimer) clearInterval(this.changeTimer);
  }

    private async processAddQueue(): Promise<void> {
    if (this.addQueue.size === 0) return;

    for (const id of this.addQueue) {
      const exists = await this.store.hasItem(id);
      if (!exists) {
        await this.store.addItem(id);
      }
    }

    this.addQueue.clear();
  }

    private async processChangeQueue(): Promise<void> {
    // Select
    for (const id of this.selectQueue) {
      await this.store.selectItem(id);
    }

    // Unselect
    for (const id of this.unselectQueue) {
      await this.store.unselectItem(id);
    }

    // Reorder
    for (const [id, newIndex] of this.reorderQueue.entries()) {
      await this.store.reorderSelectedItem(id, newIndex);
    }

    this.selectQueue.clear();
    this.unselectQueue.clear();
    this.reorderQueue.clear();
  }
}
