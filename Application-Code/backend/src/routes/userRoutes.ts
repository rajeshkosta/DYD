import { Router } from "express";
import AuthController from "../controller/userController";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

router
    .post('/sent-otp', AuthController.sentOtp)
    .post('/verify-otp', AuthController.verifyOtp)
    .post('/create-user', AuthController.createUser)
    .get("/get-Users", authMiddleware, AuthController.getUsers)
    .get("/user-details", authMiddleware, AuthController.getUserDetails)
    .post("/add-address", authMiddleware, AuthController.addAddress)
    .delete("/delete/:id", authMiddleware, AuthController.deleteUser)
    .patch('/update-address/:id', authMiddleware, AuthController.editAddress)
    .delete('/delete-address/:id', authMiddleware, AuthController.deleteAddress)
    .post('/add-creation', authMiddleware, AuthController.creation)

export default router;