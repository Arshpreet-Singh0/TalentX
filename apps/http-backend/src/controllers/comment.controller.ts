import { NextFunction, Request, Response } from "express";
import prisma from "../config/prisma";

export const postComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { comment, projectid } = req.body;
    const userId = Number(req.userId);

    const newComment = await prisma.comment.create({
      data: {
        comment,
        projectid: Number(projectid),
        userid: userId,
      },
      include : {
        User: {
            select: {
              username: true,
              id: true,
            },
          },
      }
    });

    res.status(200).json({
      success: true,
      message: "Comment posted successfully",
      comment : newComment
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await prisma.comment.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getComments = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        projectid: Number(req.params.projectid),
      },
      include: {
        User: {
          select: {
            username: true,
            id: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
