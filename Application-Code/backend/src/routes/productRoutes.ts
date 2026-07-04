import { Router } from "express";
import productController from "../controller/productController";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

router
    .post('/add-product', authMiddleware, productController.addProduct)
    .get('/get-product', productController.getAllProducts)
    .patch('/update-product/:id', authMiddleware, productController.updateProduct)
    .delete('/delete-product/:id', authMiddleware, productController.deleteProduct)
    .patch('/update-status/:id', authMiddleware, productController.updateStatus)

export default router