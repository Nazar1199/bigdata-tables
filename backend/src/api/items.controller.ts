import { Router, Request, Response } from "express";
import { itemsService } from "../app";

const router = Router();

/**
 * @swagger
 * /items:
 *   get:
 *     tags: [Items]
 *     summary: Get items list
 *     description: >
 *       Returns paginated list of items.
 *       Left side contains unselected items,
 *       right side contains selected items.
 *     parameters:
 *       - in: query
 *         name: side
 *         required: true
 *         schema:
 *           type: string
 *           enum: [left, right]
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: search
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Items list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: integer
 */

router.get("/", async (req: Request, res: Response) => {
  const { side, offset, limit, search } = req.query;
  console.log("Received /items request with query:", req.query);
  if (side !== "left" && side !== "right") {
    return res.status(400).json({ error: "Invalid side" });
  }

  const parsedOffset = Number(offset ?? 0);
  const parsedLimit = Number(limit ?? 20);

  if (Number.isNaN(parsedOffset) || Number.isNaN(parsedLimit)) {
    return res.status(400).json({ error: "Invalid pagination params" });
  }

  const searchId =
    search !== undefined ? Number(search) : undefined;

  if (search !== undefined && Number.isNaN(searchId)) {
    return res.status(400).json({ error: "Invalid search param" });
  }

  const params = {
    offset: parsedOffset,
    limit: parsedLimit,
    search: searchId,
  };

  const items =
    side === "left"
      ? await itemsService.getLeftItems(params)
      : await itemsService.getRightItems(params);

  res.json({ items });
});

/**
 * @swagger
 * /items/add:
 *   post:
 *     tags: [Items]
 *     summary: Add new item
 *     description: >
 *       Enqueues item creation.
 *       Operation is batched and applied asynchronously.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *     responses:
 *       202:
 *         description: Accepted for processing
 */

router.post("/add", (req: Request, res: Response) => {
  const { id } = req.body;

  if (typeof id !== "number") {
    return res.status(400).json({ error: "Invalid id" });
  }

  itemsService.addItem(id);
  res.status(202).end(); // accepted, not applied yet
});

/**
 * @swagger
 * /items/select:
 *   post:
 *     tags: [Items]
 *     summary: Select item
 *     description: Enqueues item selection (batched).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *     responses:
 *       202:
 *         description: Accepted
 */

router.post("/select", (req: Request, res: Response) => {
  const { id } = req.body;

  if (typeof id !== "number") {
    return res.status(400).json({ error: "Invalid id" });
  }

  itemsService.selectItem(id);
  res.status(202).end();
});

/**
 * @swagger
 * /items/unselect:
 *   post:
 *     tags: [Items]
 *     summary: Unselect item
 *     description: Enqueues item unselection (batched).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *     responses:
 *       202:
 *         description: Accepted
 */

router.post("/unselect", (req: Request, res: Response) => {
  const { id } = req.body;

  if (typeof id !== "number") {
    return res.status(400).json({ error: "Invalid id" });
  }

  itemsService.unselectItem(id);
  res.status(202).end();
});

/**
 * @swagger
 * /items/reorder:
 *   post:
 *     tags: [Items]
 *     summary: Reorder selected item
 *     description: >
 *       Updates position of selected item.
 *       Applied asynchronously in batch.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               newIndex:
 *                 type: integer
 *     responses:
 *       202:
 *         description: Accepted
 */

router.post("/reorder", (req: Request, res: Response) => {
  const { id, newIndex } = req.body;

  if (
    typeof id !== "number" ||
    typeof newIndex !== "number"
  ) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  itemsService.reorderItem(id, newIndex);
  res.status(202).end();
});

export default router;
