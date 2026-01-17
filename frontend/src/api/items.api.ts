import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL,
});

export const ItemsApi = {
  getItems(params: {
    side: "left" | "right";
    offset: number;
    limit: number;
    search?: number;
  }) {
    return api.get("/items", { params });
  },

  addItem(id: number) {
    return api.post("/items/add", { id });
  },

  selectItem(id: number) {
    return api.post("/items/select", { id });
  },

  unselectItem(id: number) {
    return api.post("/items/unselect", { id });
  },

  reorderItem(id: number, newIndex: number) {
    return api.post("/items/reorder", { id, newIndex });
  },

  sync() {
    return api.get("/sync");
  },
};
