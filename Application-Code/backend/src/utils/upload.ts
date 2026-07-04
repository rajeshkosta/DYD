import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary';  // Import your Cloudinary configuration
import { Request, Response, NextFunction } from 'express';

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = 'content-images'; // Default folder

    let resourceType: 'image' | 'raw' | 'video' = 'image';

    // Check file type and set appropriate folder
    if (file.mimetype === 'application/pdf') {
      folder = 'content-files'; // Store PDFs in a different folder
      resourceType = 'raw';
    } else if (file.mimetype.startsWith('video/')) {
      folder = 'content-videos';
      resourceType = 'video';
    }

    return {
      folder,
      allowed_formats: ['jpeg', 'png', 'jpg', 'pdf', 'mp4', 'mov', 'avi'], // Allowed file types
      resource_type: resourceType, // PDFs need 'raw' type
    };
  }
});


// Set up multer with Cloudinary storage and file size limit
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },  // 5MB file size limit
}).single('file');

export default upload;
