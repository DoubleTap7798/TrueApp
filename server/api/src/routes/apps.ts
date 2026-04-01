import { Router, Request, Response } from "express";
import {
  getAllApps,
  getAppBySlug,
  getAppsByIds,
  getFeaturedApps,
} from "../db/queries";

export const appsRouter = Router();

// GET /apps
// Query params: featured=true | trending=true | editorsPick=true
appsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const { featured, trending, editorspick, ids } = req.query as Record<string, string | undefined>;

    // If specific IDs requested
    if (ids) {
      const idList = ids.split(",").map((s) => s.trim()).filter(Boolean);
      const apps = await getAppsByIds(idList);
      return res.json({ data: apps, meta: { total: apps.length } });
    }

    let apps = await getAllApps();

    // Quick server-side flag filters (supplements client-side filtering)
    if (featured === "true") apps = apps.filter((a) => a.isFeatured);
    if (trending === "true") apps = apps.filter((a) => a.isTrending);
    if (editorspick === "true") apps = apps.filter((a) => a.isEditorsPick);

    res.json({ data: apps, meta: { total: apps.length } });
  } catch (err) {
    console.error("[GET /apps]", err);
    res.status(500).json({ error: "Failed to fetch apps" });
  }
});

// GET /apps/featured
appsRouter.get("/featured", async (_req: Request, res: Response) => {
  try {
    const apps = await getFeaturedApps();
    res.json({ data: apps, meta: { total: apps.length } });
  } catch (err) {
    console.error("[GET /apps/featured]", err);
    res.status(500).json({ error: "Failed to fetch featured apps" });
  }
});

// GET /apps/:slug
appsRouter.get("/:slug", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const app = await getAppBySlug(slug);
    if (!app) {
      return res.status(404).json({ error: `App "${slug}" not found` });
    }
    res.json({ data: app });
  } catch (err) {
    console.error(`[GET /apps/${req.params.slug}]`, err);
    res.status(500).json({ error: "Failed to fetch app" });
  }
});
