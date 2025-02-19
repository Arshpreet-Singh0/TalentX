import { NextFunction, Request, Response } from "express";
import prisma from "../config/prisma";

export const postproject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { images, title, description, skills, githuburl, liveurl } = req.body;
    const userid = req.userId;

    if (!title || !description || !skills || !userid || !images) {
      res.status(400).json({ message: "All fields required." });
      return;
    }

    if (!Array.isArray(skills) || !Array.isArray(images)) {
      res.status(400).json({ message: "Skills and images must be arrays." });
      return;
    }

    const newProject = await prisma.project.create({
      data: {
        title,
        description,
        skills,
        images,
        githuburl,
        liveurl,
        userid: Number(userid),
      },
    });

    res.status(201).json({
      message: "Project created successfully",
      project: newProject,
      success: true,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        User: {
          select: {
            name: true,
            linkedinurl: true,
            email: true,
            username: true,
          },
        },
      },
    });

    res.status(200).json({
      projects,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getProjectById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { projectId } = req.params;

    const project = await prisma.project.findUnique({
      where: {
        id: Number(projectId),
      },
      include: {
        User: {
          select: {
            name: true,
            linkedinurl: true,
            email: true,
            username: true,
          },
        },
        comment: {
          include: {
            User: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json({
      project,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
