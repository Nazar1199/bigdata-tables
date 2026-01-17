import express from "express";
import cors from "cors";
import { MemoryItemsStore } from "./storage/MemoryItemsStore";
import { QueueService } from "./queues/QueueService";
import { ItemsService } from "./services/ItemsService";
import itemsController from "./api/items.controller";
import syncController from "./api/sync.controller";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";

export const app = express();

app.use(cors());
app.use(express.json());

const store = new MemoryItemsStore();
const queueService = new QueueService(store);
const itemsService = new ItemsService(store, queueService);

queueService.start();

app.use("/items", itemsController);
app.use("/sync", syncController);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check endpoint
app.get("/api/", (req, res) => {
  res.status(200).json({
    message: "Сервер работает!",
    timestamp: new Date().toISOString(),
    status: "success"
  });
});

export { store, queueService, itemsService };