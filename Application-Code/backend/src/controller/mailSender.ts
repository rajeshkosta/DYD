import { Request, Response } from "express";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});



export const sendEmail = async (req: Request, res: Response): Promise<void> => {
    // console.log("req.body", req.body);
    
    try {
        const { recipients, subject, content } = req.body;

        if (!recipients || !Array.isArray(recipients)) {
            res.status(400).json({ error: "Recipients should be a non-empty array of email addresses." });
            return;
        }

        if (!subject) {
            res.status(400).json({ error: "Subject is required." });
            return;
        }

        if (!content) {
            res.status(400).json({ error: "Content is required." });
            return;
        }

        const results = {
            success: [] as string[],
            failed: [] as { email: string; error: string }[],
            successCount: 0,
            failedCount: 0
        };

        for (const email of recipients) {
            if (!email || typeof email !== "string") {
                results.failed.push({ email: "Unknown", error: "Invalid email address" });
                continue;
            }

            const htmlContent = `
            <!DOCTYPE html>
            <html>
              <head><meta charset="utf-8"></head>
              <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                ${content.split("\n").join("<br>")}
              </body>
            </html>
            `;

            try {
                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject,
                    html: htmlContent,
                    text: content,
                });

                results.success.push(email);
                results.successCount++;
            } catch (error) {
                results.failed.push({
                    email,
                    error: (error as Error).message || "Failed to send email",
                });
                results.failedCount++;
            }
        }

        res.json(results);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message || "Internal server error" });
    }
};
