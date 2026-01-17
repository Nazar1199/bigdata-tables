import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Batched Items API",
      version: "1.0.0",
      description:
        "API for managing large item lists with batching, deduplication and eventual consistency",
    },
    tags: [
      {
        name: "Items",
        description: "Operations with items lists",
      },
      {
        name: "Sync",
        description: "State synchronization",
      },
    ],
  },
  apis: ["./src/api/*.ts"],
});
