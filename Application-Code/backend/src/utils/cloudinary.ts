import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

// Load environment variables from a .env file
dotenv.config();

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME as string,  // Ensure environment variables are properly typed
    api_key: process.env.API_KEY as string,        // Type assertion for string
    api_secret: process.env.API_SECRET as string,  // Type assertion for string
});

export default cloudinary;
