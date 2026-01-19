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

// ========== CORS Configuration ==========
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (process.env.NODE_ENV === "development") {
    const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:5173,http://localhost:3000").split(",");
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
    } else {
      callback(null, true);
      return;
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400, // 24 hours
};

app.use(cors(corsOptions));
app.use(express.json());

// ========== Services ==========
const store = new MemoryItemsStore();
const queueService = new QueueService(store);
const itemsService = new ItemsService(store, queueService);

queueService.start();

// ========== Routes ==========
app.use("/api/items", itemsController);
app.use("/api/sync", syncController);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    message: "Сервер работает!",
    timestamp: new Date().toISOString(),
    status: "success"
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not found",
    path: req.path
  });
});

export { store, queueService, itemsService };