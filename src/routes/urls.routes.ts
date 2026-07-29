import { Router } from "express";
import * as urlsController from "../controllers/urlsController"

const router  = Router();

router.post("/urls", urlsController.createUrl);
router.get("/urls", urlsController.listUrls);
router.get("/urls/:shortCode", urlsController.getUrl);
router.delete("/urls/:shortCode", urlsController.deleteUrl);
router.get("/urls/:shortCode/stats", urlsController.getStats);

export default router;
