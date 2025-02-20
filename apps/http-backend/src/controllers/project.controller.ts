import { NextFunction, Request, Response } from "express";
import prisma from "../config/prisma";
import cloudinary from "../config/cloudinary";
import getDataUri from "../config/dataURI";

export const postproject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, description, skills, githuburl, liveurl } = req.body;
    const userid = req.userId;

    if (!title || !description || !skills || !userid) {
      res.status(400).json({ message: "All fields required." });
      return;
    }
    //@ts-ignore
    const filesDataUri = req?.files?.map((file) => {
      return getDataUri(file);
    });
    //@ts-ignore
    const uploadPromises = filesDataUri.map((dataUri) =>
      cloudinary.uploader.upload(dataUri.content, { folder: "E-Commerce" })
    );

    // Wait for all uploads to complete
    const uploadedFiles = await Promise.all(uploadPromises);
    //@ts-ignore
    const images = uploadedFiles.map((data) => {
      return data.secure_url;
    });
    console.log(images);
    

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
            username: true,
            avatar: true,
            id: true,
          },
        },
      },
      orderBy : {
        createdAt : "desc"
      }
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
