import { NextFunction, Request, Response } from "express";
import prisma from "../config/prisma";

export const postComment = async (req:Request, res:Response, next:NextFunction) : Promise<void> =>{
    try {
        const {comment, projectId} = req.body;
        const userId = Number(req.userId);

        await prisma.comment.create({
            data : {
                comment,
                projectid : Number(projectId),
                userid : userId,
            }
        })

        res.status(200).json({
            success : true,
            message : "Comment posted successfully",
        })
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export const deleteComment = async (req:Request, res:Response, next:NextFunction) : Promise<void> => {
    try {
        await prisma.comment.delete({
            where : {
                id : Number(req.params.id),
            }
        })

        res.status(200).json({
            success : true,
            message : "Comment deleted successfully",
        })
    } catch (error) {
        console.log(error);
        next(error);
    }
}