import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
         res.status(401).json({ success: false, error: "Unauthorized: No token provided" })
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload; // Replace with your secret key
        req.user = decoded; // Attach user info (e.g., user ID) to the request
        next();
    } catch (error : any) {
        
         res.status(401).json({ success: false, error: "Unauthorized: Invalid token" });
    }
};

export default authMiddleware ;
