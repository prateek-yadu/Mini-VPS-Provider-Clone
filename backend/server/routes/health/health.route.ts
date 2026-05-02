import { Router } from "express";
import {
  shallowHealth,
} from "../../controller/health.controller.js";

const router = Router();

router.get("/", shallowHealth);

export default router;
