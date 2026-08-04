import { Router } from "express";
import * as redirectController from "../controllers/redirectControllers";
import { rateLimit } from "../middleware/rateLimiter";

const router = Router();

router.get("/:shortCode", rateLimit("read"), redirectController.redirect)

export default router