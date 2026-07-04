import { Request, Response } from "express";
import prisma from "../config/db.config";
import cloudinary from "../utils/cloudinary";

const productController = {
    addProduct: async (req: Request, res: Response): Promise<void> => {
        try {
            const { name, category, price, size, quantity, images, videos, status } = req.body

            if (!name) {
                res.status(400).json({
                    message: "Name is required"
                })
                return
            }


            if (!price) {
                res.status(400).json({
                    message: "Price is required"
                })
                return
            }



            const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

            let imageUrls: string[] = Array.isArray(images) ? images : [];
            let videoUrls: string[] = Array.isArray(videos) ? videos : [];

            if (files?.["image"] && files["image"].length > 0) {
                const uploadedImages = files["image"].map((file) => (file as any).path || (file as any).secure_url);
                imageUrls = [...imageUrls, ...uploadedImages]; // Merge with existing URLs
            }

            if (files?.["video"] && files["video"].length > 0) {
                const uploadedVideos = files["video"].map((file) => (file as any).path || (file as any).secure_url);
                videoUrls = [...videoUrls, ...uploadedVideos]; // Merge with existing URLs
            }

            const newProduct = await prisma.products.create({
                data: {
                    name,
                    category,
                    price,
                    status,
                    size,
                    quantity,
                    images: imageUrls,
                    videos: videoUrls
                }
            })

            res.status(200).json({
                message: "Product added successfully",
                data: newProduct
            })
        } catch (error: any) {
            console.error("Error creating product:", error);
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    },
    updateProduct: async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { name, category, price, size, quantity, images, videos } = req.body

            const existProduct = await prisma.products.findUnique({
                where: {
                    id: id
                }
            })

            if (!existProduct) {
                res.status(404).json({
                    message: "Product not found"
                })
                return
            }

            let updatedData: any = { name, category, price, size, quantity };

            if (images) {
                updatedData.images = images
            }
            if (videos) {
                updatedData.videos = videos
            }

            const updatedProduct = await prisma.products.update({
                where: {
                    id: id
                },
                data: updatedData
            })

            res.status(200).json({
                message: "Product updated successfully",
                data: updatedProduct
            })
        } catch (error: any) {
            console.error("Error updating product:", error);
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    },

    updateStatus: async (req: Request, res: Response): Promise<void> => {

        try {
            const { id } = req.params;
            const { status } = req.body;

            // Ensure status is a boolean
            if (typeof status !== "boolean") {
                res.status(400).json({
                    message: "Status must be a boolean value (true/false)"
                });
                return;
            }

            const existingProduct = await prisma.products.findUnique({
                where: {
                    id: id
                }
            })

            if (!existingProduct) {
                res.status(404).json({
                    message: "Product not found"

                })
                return
            }

            const updatedStatus = await prisma.products.update({
                where: { id: id },
                data: { status }
            })

            res.status(200).json({
                message: "Product status updated successfully",
                data: updatedStatus
            })
        } catch (error: any) {
            res.status(500).json({
                message: "Failed to update product status",
                error: error.message
            })
        }
    },

    getAllProducts: async (req: Request, res: Response): Promise<void> => {
        try {
            const products = await prisma.products.findMany()
            res.status(200).json({
                message: "Products fetched successfully",
                data: products
            })
        } catch (error: any) {
            console.error("Error fetching products:", error);
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    },

    deleteProduct: async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const product = await prisma.products.findUnique({
                where: {
                    id: id
                }
            })

            if (!product) {
                res.status(400).json({
                    message: "Product not found"
                })
                return
            }

            const extractPublicId = (url: string) => {
                try {
                    const parts = url.split('/');
                    const filename = parts.pop()?.split('.')[0]; // Get filename without extension
                    const folderPath = parts.slice(7).join('/'); // Get folder path after the domain part
                    return folderPath ? `${folderPath}/${filename}` : filename;
                } catch (error) {
                    console.error("Invalid URL:", url, error);
                    return null;
                }
            };

            // Function to delete file from Cloudinary
            const deleteCloudinaryFile = async (url: string, resourceType: "image" | "video") => {
                try {
                    const publicId = extractPublicId(url);
                    if (!publicId) {
                        console.error("Invalid public ID for URL:", url);
                        return;
                    }

                    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
                    if (result.result === "ok") {
                        console.log(`Successfully deleted ${resourceType}: ${publicId}`);
                    } else {
                        console.log(`Failed to delete ${resourceType}: ${publicId}. Result: ${JSON.stringify(result)}`);
                    }
                } catch (err) {
                    console.error(`Failed to delete ${resourceType}:`, err);
                }
            };


            // Delete images
            if (product.images && product.images.length > 0) {
                for (const imageUrl of product.images) {
                    await deleteCloudinaryFile(imageUrl, "image");
                }
            }

            // Delete videos
            if (product.videos && product.videos.length > 0) {
                for (const videoUrl of product.videos) {
                    await deleteCloudinaryFile(videoUrl, "video");
                }
            }

            const deletedProduct = await prisma.products.delete({
                where: {
                    id: id
                }
            })

            res.status(200).json({
                message: "Product deleted successfully",
                data: deletedProduct
            })


        } catch (error: any) {
            res.status(500).json({
                message: "Failed to delete product",
                error: error.message
            })
        }
    }

}

export default productController