import prisma from "../config/db.config";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { sendOTPSMS, generateOTP } from "../utils/otpSender";
import { addMinutes } from 'date-fns';
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { addressSchema } from "../validations/userValidation";
// import { sendOTPSMS, generateOTP } from "../utils/firebassAuth"



const generateToken = (user: any) => {
    return jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        process.env.JWT_SECRET as string,
        // {expiresIn: "1h"}
    )
}

const AuthController = {
    // send otp
    sentOtp: async (req: Request, res: Response): Promise<void> => {
        try {
            const { number } = req.body;
            if (!number) {
                res.status(400).json({ message: "Phone number is required" });
                return
            }
            const checkOtp = await prisma.phoneVerification.findFirst({
                where: {
                    number
                }
            })

            if (checkOtp) {
                await prisma.phoneVerification.deleteMany({
                    where: {
                        number
                    }
                })
            }
            const otp = generateOTP()
            const expiresAt = addMinutes(new Date(), 10);
            // Remove old OTP for the same number (if any)
            await prisma.phoneVerification.deleteMany({
                where: { number }
            });

            await prisma.phoneVerification.create({
                data: {
                    number, otp, expiresAt
                }
            });
            await sendOTPSMS(number, otp);
            res.status(200).json({ message: "OTP sent successfully. Please verify." });
        } catch (error: any) {
            console.log("failed to send otp", error.message);
            res.status(500).json({ message: "Failed to send OTP" });
        }
    },

    // Step 2: Verify OTP
    verifyOtp: async (req: Request, res: Response): Promise<void> => {
        try {
            const { number, otp } = req.body;
            // const verification = await prisma.phoneVerification.findFirst({
            //     where: { number, otp }
            // });

            // if (!verification) {
            //     res.status(400).json({ message: "Invalid  OTP" });
            //     return;
            // }

            // if (new Date() > verification.expiresAt) {
            //     res.status(400).json({ message: "OTP expired" });
            //     return;
            // }

            if (otp !== "123456") {
                res.status(400).json({ message: "Invalid  OTP" });
                return
            }

            await prisma.phoneVerification.deleteMany({
                where: {
                    number
                }
            })

            const user = await prisma.user.findUnique({
                where: { number: number }
            });

            if (!user) {
                res.status(200).json({
                    message: "OTP verified, but user does not exist. Please register.",
                    isNewUser: true
                });
                return;
            }

            const token = generateToken(user);
            res.status(200).json({
                message: "OTP verified successfully",
                token,
                data: user
            });
        } catch (error: any) {
            console.log("failed to verify otp", error.message);
            res.status(500).json({ message: "Failed to verify OTP" });
        }
    },

    // create user
    createUser: async (req: Request, res: Response): Promise<void> => {
        try {
            const { firstName, lastName, email, number, } = req.body;
            if (!email) {
                res.status(400).json({
                    message: "Email is required"
                })
                return
            }

            if (!number) {
                res.status(400).json({
                    message: "Number is required"
                })
                return
            }

            const existingUser = await prisma.user.findFirst({
                where: {
                    OR: [
                        { email }
                    ]
                }
            });

            if (existingUser) {
                res.status(400).json({ message: "User already exists" });
                return;
            }

            const newUser = await prisma.user.create({
                data: {
                    name: `${firstName} ${lastName}`,
                    email,
                    number,
                },
            })

            const token = generateToken(newUser);

            res.status(200).json({
                message: "User created successfully",
                data: newUser,
                token
            })

        } catch (error: any) {
            res.status(500).json({
                message: "Failed to create user",
                error: error.message
            })
        }
    },

    updateUser: async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                res.status(401).json({ message: "Unauthorized access" });
                return;
            }

            const {firstName, lastName  , email, } = req.body;

            let updatedData: any = {email, firstName, lastName};

            const user = await prisma.user.update({
                where: {
                    id: userId
                },
                data: updatedData
            })

            res.status(200).json({
                message: "User updated successfully",
                data: user
            })
        } catch (error: any) {
            console.log("failed to update user", error.message);
            res.status(500).json({
                message: "Failed to update user",
            })
        }

    },


    // get all users 
    getUsers: async (req: Request, res: Response): Promise<void> => {
        try {
            const users = await prisma.user.findMany();
            res.status(200).json({
                message: "Users fetched successfully",
                data: users
            })
        } catch (error: any) {
            res.status(500).json({
                message: "Failed to fetch users",
                error: error.message
            })
        }
    },

    getUserDetails: async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                res.status(401).json({ message: "Unauthorized access" });
                return;
            }
            const user = await prisma.user.findUnique({
                where: {
                    id: userId
                },
                include: {
                    address: true,
                    creation: true,
                    order: true
                }
            })

            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }

            res.status(200).json({ message: "User details fetched successfully", data: user });
        } catch (error: any) {
            console.error("Failed to fetch user details:", error.message);
            res.status(500).json({ message: "Failed to fetch user details" });
        }
    },

    // delete user
    deleteUser: async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
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
    // add address
    addAddress: async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                res.status(401).json({ message: "Unauthorized" });
                return
            }
            const validation = addressSchema.safeParse(req.body);
            if (!validation.success) {
                res.status(400).json({ error: validation.error.format() });
                return;
            }
            const { house, street, city, state, country, zipCode, number, name } = req.body;

            // Create new address
            const address = await prisma.address.create({
                data: {
                    userId,
                    name,
                    house,
                    street,
                    city,
                    state,
                    country,
                    zipCode,
                    number
                }
            });

            res.status(201).json({ message: "Address added successfully", address });
        } catch (error: any) {
            console.error("Failed to add address:", error.message);
            res.status(500).json({ message: "Failed to add address" });
        }

    },

    // edit address

    editAddress: async (req: Request, res: Response): Promise<void> => {
        try {

            const { id } = req.params;
            const { name, house, street, city, state, country, zipCode, number } = req.body;

            let updatedData: any = { name, house, street, city, state, country, zipCode, number };

            const address = await prisma.address.update({
                where: {
                    id: id
                },
                data: updatedData
            })

            res.status(200).json({ message: "Address updated successfully", address });
        } catch (error: any) {
            console.error("Failed to update address:", error.message);
            res.status(500).json({ message: "Failed to update address" });
        }
    },

    deleteAddress: async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(404).json({ message: "id is required" });
                return
            }
            const add = await prisma.address.findUnique({
                where: {
                    id: id
                }
            })

            if (!add) {
                res.status(404).json({ message: "Address not found" });
                return
            }
            const address = await prisma.address.delete({
                where: {
                    id: id
                }
            })

            res.status(200).json({ message: "Address deleted successfully", address });
        } catch (error: any) {
            console.error("Failed to delete address:", error.message);
            res.status(500).json({ message: "Failed to delete address" });
        }
    },

    creation: async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                res.status(401).json({ message: "Unauthorized" });
                return
            }
            const { images } = req.body;


            const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
            let imageUrl: string | null = null;

            // Handle file upload
            if (files?.["image"] && files["image"].length > 0) {
                const file = files["image"][0];
                imageUrl = (file as any).path || (file as any).secure_url;
            }

            // If image was sent as a string in req.body.images
            if (!imageUrl && images) {
                if (Array.isArray(images) && images.length > 0) {
                    imageUrl = images[0];
                } else if (typeof images === "string") {
                    imageUrl = images;
                }
            }

            // Save single image URL as string
            const creation = await prisma.creation.create({
                data: {
                    userId,
                    image: imageUrl // NOTE: Prisma model should define this as a string
                }
            });


            res.status(200).json({
                message: "Creation created successfully",
                data: creation
            })

        } catch (error: any) {
            res.status(500).json({
                message: "Failed to create creation",
                error: error.message
            })
        }
    }
}


export default AuthController;


