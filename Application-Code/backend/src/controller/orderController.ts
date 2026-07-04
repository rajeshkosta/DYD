import { Request, Response } from "express";
import prisma from "../config/db.config";

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const orderController = {
    createOrder: async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                res.status(401).json({ message: "Unauthorized" });
                return
            }
            const { addressId, price, designImage, logo, size, quantity, modeOfPayment, productName } = req.body;
            const randomNum = Math.floor(100000000 + Math.random() * 900000000); // 9-digit number
            const orderId = `OD${randomNum}`;

            const order = await prisma.order.create({
                data: {
                    userId,
                    orderId,
                    addressId,
                    price,
                    designImage,
                    logo,
                    size,
                    quantity,
                    modeOfPayment,
                    productName
                }
            })

            res.status(200).json({ message: "Order placed successfully", data: order })
        } catch (error: any) {
            console.error("Failed to create order:", error.message);
            res.status(500).json({ message: "Failed to create order" })
        }
    },

    // status dispatched or cancelled
    updateOrder: async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { status, reason } = req.body;

            if (!["dispatched", "cancelled", "delivered"].includes(status)) {
                res.status(400).json({ message: "Invalid status" });
                return;
            }

            if (status === "cancelled" && !reason) {
                res.status(400).json({ message: "Reason is required" });
                return;
            }

            const updatedOrder = await prisma.order.update({
                where: {
                    id: id
                },
                data: {
                    status: status
                },
                include: {
                    user: true
                }
            })

            // Prepare email content dynamically
            let subject = "";
            let htmlContent = "";

            // Send email notification to the user
            if (status === "dispatched") {
                subject = "Your order is Confirmed 🎉";
                htmlContent = `
                    <h2>Hello ${updatedOrder.user.name},</h2>
                    <h2>Thank you for choosing DYD</h2>
                    <p>We’re excited to host you. your product has been dispatched. Here are your delivery details:</p>
                    
                    <p>Need to modify or cancel? Click <a href="[Modification Link]">here</a> or call us at <strong>[company Contact Number]</strong>.</p>
                    <p>We look forward to serving you!</p>
                    <p>Best regards,<br> DYD Team</p>            
                `;
            } else if (status === "cancelled") {
                subject = "Your Order has been canceled ❌";
                htmlContent = `
                    <h2>Hello ${updatedOrder.user.name},</h2>
                    <p>We regret to inform you that your delivery request has been cancelled.</p>
                    <p>📝 <strong>Reason:</strong> ${reason}</p>
                    <p>If you have any questions, feel free to contact us.</p>
                    <p>Best regards,<br> DYD Team</p>            
                `;
            }

            if (!updatedOrder.user?.email) {
                res.status(400).json({ message: "User email not found. Cannot send email." });
                return
              }
              
            // Send email notification
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: updatedOrder.user.email,
                subject,
                html: htmlContent,
            };

            try {
                transporter.sendMail(mailOptions);
                console.log("order email sent to", updatedOrder.user.email);
            } catch (emailError) {
                console.error("Failed to send email:", (emailError as Error).message);
            }

            res.status(200).json({ message: "Order updated successfully", data: updatedOrder });
        } catch (error: any) {
            console.error("Failed to update order:", error.message);
            res.status(500).json({ message: "Failed to update order" });
        }
    },

    getOrders: async (req: Request, res: Response): Promise<void> => {
        try {

            const orders = await prisma.order.findMany({
                include: {
                    user: true,
                    address: true
                }
            });
            res.status(200).json({ message: "Orders fetched successfully", data: orders });
        } catch (error: any) {
            console.error("Failed to fetch orders:", error.message);
            res.status(500).json({ message: "Failed to fetch orders" });
        }
    },

    deleteOrder: async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const deletedOrder = await prisma.order.delete({
                where: {
                    id: id
                }
            });
            res.status(200).json({ message: "Order deleted successfully", data: deletedOrder });
        } catch (error: any) {
            console.error("Failed to delete order:", error.message);
            res.status(500).json({ message: "Failed to delete order" });
        }
    }
}

export default orderController