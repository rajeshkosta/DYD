import { Router } from "express";
import mediaController from "../controller/mediaController";
import upload from "../utils/upload";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

router
    .post('/upload-media',    upload, mediaController.uploadMedia)
    .delete('/delete-media/:id',  mediaController.deleteMedia)


export default router