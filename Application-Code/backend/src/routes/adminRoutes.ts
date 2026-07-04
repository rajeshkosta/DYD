import { Router } from "express";
import adminController from "../controller/adminController";
import authMiddleware from "../middlewares/authMiddleware";
import { sendEmail } from "../controller/mailSender";



const router = Router();

router
    .post("/register", adminController.creatAdminUser)
    .post("/login", adminController.loginUser)
    .post('/create-user', authMiddleware, adminController.createUser)
    .patch('/update-user/:id', authMiddleware, adminController.editUser)
    .delete('/delete-user/:id', authMiddleware, adminController.deleteUser)
    .post('/send-email', authMiddleware, sendEmail)



export default router;