import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import freepikController from "../controller/freepikController";

const router = Router();

router
    .post('/generate-logo', authMiddleware, freepikController.generateLogo)
    .post('/remove-bg', authMiddleware, freepikController.removeBackground)

export default router