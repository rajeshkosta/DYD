import prisma from "../config/db.config";
import { Request, Response } from "express";
import cloudinary from "../utils/cloudinary";


const mediaController = {
    uploadMedia: async (req: Request, res: Response): Promise<void> => {
        const { fieldName } = req.body;
        // console.log("fieldName", req.files);

        if (!fieldName) {
            res.status(400).json({
                message: "Fieldname is required"
            })
            return
        }

        if (!req.file) {
            res.status(400).json({
                message: "File is required"
            })
            return
        }


        try {
            const newMedia = await prisma.temporaryMedia.create({
                data: {
                    fieldName,
                    url: req.file.path,
                    timestamp: new Date()
                }
            })

            res.status(200).json({
                message: "Media uploaded successfully",
                data: newMedia
            })
        } catch (error: any) {
            res.status(500).json({
                message: "Failed to upload media",
                error: error.message
            })
        }
    },

    deleteMedia: async (req: Request, res: Response): Promise<void> => {
        console.log("start delete media");
        
        try {
            const { id } = req.params;

            console.log("id", id);
            
    
            if (!id) {
                res.status(400).json({
                    message: "Id is required"
                });
                return;
            }
    
            const media = await prisma.temporaryMedia.findUnique({
                where: { id: id }
            });
    
            if (!media) {
                res.status(404).json({
                    message: "Media not found"
                });
                return;
            }
    
            // Extract public ID from Cloudinary URL
            const extractPublicId = (url: string): string | null => {
                try {
                    const parts = url.split('/');
                    const filename = parts.pop()?.split('.')[0] ?? null;  // file name without extension
                    const folderPath = parts.slice(7).join('/');  // folder path after 'upload'
                    return folderPath ? `${folderPath}/${filename}` : filename;
                } catch (error) {
                    console.error("Invalid URL:", url, error);
                    return null;
                }
            };
    
            // Delete file from Cloudinary
            const deleteCloudinaryFile = async (url: string, resourceType: "image" | "video") => {
                const publicId = extractPublicId(url);
                if (!publicId) {
                    console.error("Failed to extract public ID from URL:", url);
                    return;
                }
                try {
                    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
                    if (result.result === "ok") {
                        console.log(`Successfully deleted ${resourceType}: ${publicId}`);
                    } else {
                        console.log(`Failed to delete ${resourceType}: ${publicId}`, result);
                    }
                } catch (err) {
                    console.error(`Error deleting ${resourceType}:`, err);
                }
            };
    
            // Determine resource type and handle deletion
            const urls = Array.isArray(media.url) ? media.url : [media.url];  // Support array or single URL
    
            for (const url of urls) {
                if (media.fieldName === "image") {
                    await deleteCloudinaryFile(url, "image");
                } else if (media.fieldName === "video") {
                    await deleteCloudinaryFile(url, "video");
                }
            }
    
            // Delete record from DB
            await prisma.temporaryMedia.delete({ where: { id: id } });
    
            res.status(200).json({
                message: "Media deleted successfully",
                data: media
            });
    
        } catch (error: any) {
            res.status(500).json({
                message: "Failed to delete media",
                error: error.message
            });
        }
    },
    

}

export default mediaController;