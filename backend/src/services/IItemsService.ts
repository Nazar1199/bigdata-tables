import { GetItemsParams } from "../storage/IItemsStore";

export interface IItemsService {
  getLeftItems(params: GetItemsParams): Promise<number[]>;
  getRightItems(params: GetItemsParams): Promise<number[]>;

  getRightItemsCount(): Promise<number>;

  addItem(id: number): void;
  selectItem(id: number): void;
  unselectItem(id: number): void;
  reorderItem(id: number, newIndex: number): void;
}
