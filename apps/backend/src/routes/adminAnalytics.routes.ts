import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth";
import * as adminAnalyticsController from "../controllers/adminAnalyticsController";

const router = Router();

router.use(requireAuth);
router.use(requireAdmin);


router.get("/overview", adminAnalyticsController.getOverview);
router.get("/url/:shortCode", adminAnalyticsController.getUrlAnalytics);
router.get("/top-urls", adminAnalyticsController.getTopUrls);
router.get("/realtime", adminAnalyticsController.getRealtime);

export default router;
