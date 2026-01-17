import { Router, Response } from "express";
import { itemsService } from "../app";

const router = Router();

/**
 * @swagger
 * /sync:
 *   get:
 *     tags: [Sync]
 *     summary: Sync selected items state
 *     description: >
 *       Returns full selected items list.
 *       Used to restore state after page reload.
 *     responses:
 *       200:
 *         description: Current selected items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 selectedItems:
 *                   type: array
 *                   items:
 *                     type: integer
 */

router.get("/", async (_, res: Response) => {
  const items = await itemsService.getRightItems({
    offset: 0,
    limit: Number.MAX_SAFE_INTEGER,
  });

  res.json({ selectedItems: items });
});

export default router;
