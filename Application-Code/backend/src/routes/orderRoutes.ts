import { Router } from "express";
import orderController from "../controller/orderController";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

router
    .post('/create-order', authMiddleware, orderController.createOrder)
    .get('/get-orders',  orderController.getOrders)
    .patch('/update-order/:id', authMiddleware, orderController.updateOrder)
    .delete('/delete-order/:id', authMiddleware, orderController.deleteOrder)

export default router