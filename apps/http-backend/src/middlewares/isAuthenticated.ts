import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import {JWT_SECRET as  secretKey} from "@repo/backend-common/config";

export const isAuthenticated = (req:Request , res:Response, next:NextFunction)=>{
    try {
        const token = req.cookies?.token;
        
        if (!token) {
            res.status(401).json({ message: 'Authentication token is required.' });
            return;
        }
        
        const decode = jwt.verify(token, secretKey) as JwtPayload;

        if(!decode){
            res.status(401).json({
                message : "You are not authenticated",
                success : false
            });
            return;
        }
        req.userId = decode.userId;

        next();
    } catch (error) {
        console.log(error);
        res.status(403).json({
            message: "You are not logged in"
        })
    }
}