import { Request, Response } from "express";
import axios from "axios";
import FormData from "form-data";

const FREEPIK_API_KEY = process.env.FREEPIK_API_KEY;
const FREEPIK_API_URL = "https://api.freepik.com"; // Replace with actual logo endpoint


const freepikController = {
    generateLogo: async (req: Request, res: Response): Promise<void> => {
        try {
            const { prompt } = req.body;
            if (!prompt) {
                res.status(400).json({ error: "Prompt is required" });
                return
            }


            if (!FREEPIK_API_KEY) {
                res.status(500).json({ error: "API key is missing" });
                return
            }

            const response = await axios.post(`${FREEPIK_API_URL}/v1/ai/text-to-image`,
                { prompt },
                {
                    headers: {
                        'x-freepik-api-key': FREEPIK_API_KEY
                    }
                }
            );
            // console.log("response", response.data);

            // const base64Image = response.data?.data?.[0]?.base64;

            // if (!base64Image) {
            //     res.status(500).json({ error: "Failed to generate logo" });
            //     return
            // }

            // const imageBuffer = Buffer.from(base64Image, 'base64');
            // const form = new FormData();
            // form.append("fieldName", "image");
            // form.append("file", imageBuffer, {
            //     filename: "logo.png",
            //     contentType: "image/png",
            // });
            

            // const uploadRes = await axios.post(
            //     "http://localhost:5000/api/media/upload-media",
            //     form,

            // );
            // const imageUrl = uploadRes.data.data.url;
            // console.log("imageUrl", imageUrl);
            
            res.json(response.data);
            return
        } catch (error: any) {
            console.error("Error generating logo:", error.response?.data || error.message);
            res.status(500).json({ error: "Failed to generate logo" });
            return
        }
    },

    removeBackground: async (req: Request, res: Response): Promise<void> => {
        try {
            const { base64Image } = req.body; // Get Base64 image from frontend

            // console.log("base64Image", base64Image);


            if (!base64Image) {
                res.status(400).json({ error: "Base64 image is required" });
                return;
            }

            if (!FREEPIK_API_KEY) {
                res.status(500).json({ error: "API key is missing" });
                return;
            }

            const response = await axios.post(
                `${FREEPIK_API_URL}/v1/ai/beta/remove-background`,
                new URLSearchParams({ image_url: base64Image }),
                {
                    headers: {
                        "x-freepik-api-key": FREEPIK_API_KEY,
                        // "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
            );

            res.json(response.data); // Send processed image to frontend
        } catch (error: any) {
            console.error("Error removing background:", error.response?.data || error.message);
            res.status(500).json({ error: "Failed to remove background" });
        }
    }

}


export default freepikController