import { Router } from "express";
import * as urlsController from "../controllers/urlsController"
import { rateLimit } from "../middleware/rateLimiter";
import { requireAuth } from "../middleware/auth";

const router  = Router();

router.post("/urls", rateLimit("create"), urlsController.createUrl);
router.get("/urls", rateLimit("read"), requireAuth, urlsController.listUrls);
router.get("/urls/:shortCode", urlsController.getUrl);
router.delete("/urls/:shortCode", requireAuth, urlsController.deleteUrl);
router.get("/urls/:shortCode/stats", urlsController.getStats);

export default router;
