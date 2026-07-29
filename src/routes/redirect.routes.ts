import { Router } from "express";
import * as redirectController from "../controllers/redirectControllers";

const router = Router();

router.get("/:shortCode", redirectController.redirect)

export default router