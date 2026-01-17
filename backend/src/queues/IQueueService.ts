export interface IQueueService {
  enqueueAdd(id: number): void;
  enqueueSelect(id: number): void;
  enqueueUnselect(id: number): void;
  enqueueReorder(id: number, newIndex: number): void;

  start(): void;
  stop(): void;
}
