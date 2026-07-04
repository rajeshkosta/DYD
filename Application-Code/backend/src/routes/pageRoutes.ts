import { Router } from "express";
import pageController from "../controller/pageController";
import authMiddleware from "../middlewares/authMiddleware";



const router = Router();

router
    .post("/create",  authMiddleware, pageController.createPage)
    .get("/", authMiddleware, pageController.getPages)
    .patch("/:id", authMiddleware, pageController.updatePage)
    .delete('/:id', authMiddleware, pageController.deletePage)


export default router;