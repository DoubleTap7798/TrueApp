import { Router, Request, Response } from "express";
import {
  getAllCategories,
} from "../db/queries";

export const categoriesRouter: Router = Router();

// GET /categories
categoriesRouter.get("/", async (_req: Request, res: Response) => {
  try {
    const categories = await getAllCategories();
    res.json({ data: categories, meta: { total: categories.length } });
  } catch (err) {
    console.error("[GET /categories]", err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});
