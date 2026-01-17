export interface GetItemsParams {
  offset: number;
  limit: number;
  search?: number;
}

export interface IItemsStore {
  /* ========= Items ========= */

  hasItem(id: number): Promise<boolean>;
  addItem(id: number): Promise<void>;

  getAllItemsCount(): Promise<number>;

  /* ========= Left list ========= */

  getUnselectedItems(
    params: GetItemsParams
  ): Promise<number[]>;

  /* ========= Selected ========= */

  getSelectedItems(
    params: GetItemsParams
  ): Promise<number[]>;

  getSelectedItemsCount(): Promise<number>;

  selectItem(id: number): Promise<void>;
  unselectItem(id: number): Promise<void>;

  reorderSelectedItem(
    id: number,
    newIndex: number
  ): Promise<void>;
}
