import { Request, Response } from "express";
import prisma from "../config/db.config";
import sanitizeHtml from "sanitize-html";

const pageController = {
    createPage: async (req: Request, res: Response): Promise<void> => {
        try {
            const { title, content } = req.body;
            if (!title) {
                res.status(400).json({
                    message: "Title is required"
                })
                return
            }

            if (!content) {
                res.status(400).json({
                    message: "Content is required"
                })
                return
            }

            const santizedContent = sanitizeHtml(content, {
                allowedTags: sanitizeHtml.defaults.allowedTags.concat(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'b', 'i', 'u', 'strong', 'em', 'p']),
                allowedAttributes: {
                    a: ['href', 'target'],
                    img: ['src', 'alt'],
                    '*': ['style'], 
                },
            })
            const page = await prisma.page.create({
                data: {
                    title,
                    content: santizedContent,
                }
            })

            res.status(200).json({
                message: "Page created successfully",
                data: page
            })
        } catch (error: any) {
            res.status(500).json({
                message: "Failed to create page",
                error: error.message
            })
        }
    },

    updatePage: async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { title, content } = req.body;

            const existPage = await prisma.page.findUnique({
                where: {
                    id: id
                }
            })

            if (!existPage) {
                res.status(404).json({
                    message: "Page not found"
                })
                return
            }

            let updatedData: any = { title, content };

            const updatedPage = await prisma.page.update({
                where: {
                    id: id
                },
                data: updatedData
            })

            res.status(200).json({
                message: "Page updated successfully",
                data: updatedPage
            })

        } catch (error: any) {
            res.status(500).json({
                message: "Failed to update page",
                error: error.message
            })
        }
    },

    getPages: async (req: Request, res: Response): Promise<void> => {
        try {
            const pages = await prisma.page.findMany();
            res.status(200).json({
                message: "Pages fetched successfully",
                data: pages
            })
        } catch (error: any) {
            res.status(500).json({
                message: "Failed to fetch pages",
                error: error.message
            })
        }
    },

    deletePage: async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const page = await prisma.page.delete({
                where: {
                    id: id
                }
            })
            res.status(200).json({
                message: "Page deleted successfully",
                data: page
            })
        } catch (error: any) {
            res.status(500).json({
                message: "Failed to delete page",
                error: error.message
            })
        }
    }

}

export default pageController
