import prisma from "../config/db.config";
import e, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
// import nodemailer from "nodemailer";




const generateToken = (user: any) => {
    return jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        process.env.JWT_SECRET as string,
        // {expiresIn: "1h"}
    )
}


const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


const adminController = {
    // create admin user
    creatAdminUser: async (req: Request, res: Response): Promise<void> => {

        try {
            const { name, email, password } = req.body;


            if (!name) {
                res.status(400).json({
                    message: "Name is required"
                })
                return
            }

            if (!email) {
                res.status(400).json({
                    message: "Email is required"
                })
                return
            }

            if (!password) {
                res.status(400).json({
                    message: "Password is required"
                })
                return
            }

            const finduser = await prisma.adminUser.findUnique({
                where: {
                    email: email
                }
            })

            if (finduser) {
                res.status(400).json({
                    message: "User already exists"
                })
                return
            }

            const hashedPassword = await bcrypt.hash(password, 10)

            const newUser = await prisma.adminUser.create({
                data: {
                    name: name,
                    email: email,
                    password: hashedPassword
                }
            })

            // genrate token 
            const token = generateToken(newUser)


            res.status(200).json({
                message: "User created successfully",
                data: {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                },
                token
            })


        } catch (error: any) {
            res.status(500).json({
                message: "Failed to create user",
                error: error.message
            })
        }
    },

    // login admin user 
    loginUser: async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;

            // console.log("email", email, "password", password);

            if (!email) {
                res.status(400).json({
                    message: "Email is required"
                })
                return
            }

            if (!password) {
                res.status(400).json({
                    message: "Password is required"
                })
                return
            }

            const user = await prisma.adminUser.findUnique({
                where: {
                    email: email
                }
            })

            if (!user) {
                res.status(404).json({
                    message: "User not found"
                })
                return
            }

            const isPasswordValid = await bcrypt.compare(password, user.password)
            if (!isPasswordValid) {
                res.status(400).json({
                    message: "Invalid password"
                })
                return
            }

            // genrate token 
            const token = generateToken(user)

            res.status(200).json({
                message: "User logged in successfully",
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                },
                token
            })
        } catch (error: any) {
            res.status(500).json({
                message: "Failed to login user",
                error: error.message
            })
        }
    },

    // create user
    createUser: async (req: Request, res: Response): Promise<void> => {
        const { name, email, number, address, password, provider } = req.body;
        try {
            const finduser = await prisma.user.findUnique({
                where: {
                    email: email
                }
            })

            if (finduser) {
                res.status(400).json({
                    message: "User already exists"
                })
                return
            }

            // const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

            const newUser = await prisma.user.create({
                data: {
                    name,
                    email,
                    number,

                },
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Welcome to Our Platform",
                html: `
                <h2>Thanks for choosing us, ${name}!</h2>
                <p>Your account has been created successfully. Here are your details:</p>
                <ul>
                    <li><strong>Name:</strong> ${name}</li>
                    <li><strong>Email:</strong> ${email}</li>
                    <li><strong>Phone Number:</strong> ${number}</li>
                    <li><strong>Address:</strong> ${address}</li>
                    <li><strong>Password:</strong> ${password}</li>
                </ul>
                <p>You can now log in using your email and password.</p>
                <p>Best regards, <br> The Team</p>
            `
            }

            try {
                await transporter.sendMail(mailOptions);
                // console.log("Email sent successfully to", email);
            } catch (emailError) {
                console.error("Failed to send email:", (emailError as Error).message);
            }

            res.status(200).json({
                message: "User created successfully",
                data: {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                    number: newUser.number,
                }

            })
        } catch (err) {
            res.status(400).json({ error: 'User creation failed', details: err });
        }

    },

    // update user
    editUser: async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const { name, email, number, address, password } = req.body;

        try {
            const updateData: any = { name, email, number };
            if (password) updateData.password = await bcrypt.hash(password, 10);

            const updatedUser = await prisma.user.update({
                where: { id },
                data: updateData,
            });

            res.status(200).json({
                updatedUser
            })
        } catch (error: any) {
            res.status(400).json({ error: 'User update failed', details: error });
        }
    },

    deleteUser: async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { reason } = req.body

            if (!reason) {
                res.status(400).json({ message: "Reason for deletion is required." });
                return;
            }

            const userExist = await prisma.user.findUnique({
                where: {
                    id: id
                }
            })

            if (!userExist) {
                res.status(404).json({
                    message: "User not found"
                })
                return
            }
            const deletedUser = await prisma.user.delete({
                where: {
                    id: id
                }
            })


            if(!userExist.email) {
                res.status(500).json({
                    message: "Failed to delete user"
                })
                return
            }
            // Send email notification to the user
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: userExist.email,
                subject: "Account Deletion Notice",
                html: `
                <h2>Hello ${userExist.name},</h2>
                <p>Your account has been deleted by the administrator.</p>
                <p><strong>Reason:</strong> ${reason}</p>
                <p>If you believe this was a mistake or have any questions, please contact support.</p>
                <p>Best regards,<br> The Team</p>
            `,
            };

            try {
                await transporter.sendMail(mailOptions);
                console.log("Deletion email sent to", userExist.email);
            } catch (emailError) {
                console.error("Failed to send deletion email:", (emailError as Error).message);
            }

            res.status(200).json({
                message: "User deleted successfully",
                data: deletedUser
            })

        } catch (error: any) {
            res.status(500).json({
                message: "Failed to delete user",
                error: error.message
            })
        }
    },
   


}

export default adminController;