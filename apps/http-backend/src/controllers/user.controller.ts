import { NextFunction, Request, Response } from "express";
import prisma from "../config/prisma";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET as secretKey } from "@repo/backend-common/config";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, username, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ message: "Please fill all fields" });
      return;
    }

    let user = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });

    if (user) {
      res.status(400).json({
        message: "Username Already Exist.",
        success: true,
      });
      return;
    }

    const hashedPassword = await bcryptjs.hash(password, 5);

    user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        username,
      },
    });

    const token = jwt.sign({ userId: user.id }, secretKey, {
      expiresIn: "7d",
    });

    const constructedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
    };

    res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: false,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
      })
      .json({
        message: "Account created successfully.",
        user: constructedUser,
        success: true,
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Please fill all fields" });
      return;
    }

    let user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
      return;
    }

    const isPasswordMatched = await bcryptjs.compare(password, user.password);

    if (!isPasswordMatched) {
      res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
      return;
    }

    const token = jwt.sign({ userId: user.id }, secretKey, {
      expiresIn: "7d",
    });

    const constructedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
    };

    res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
      })
      .json({
        message: `Welcome back ${user.name}`,
        success: true,
        user: constructedUser,
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.userId;
  const { name, linkedinurl, githuburl, portfolio, skills } = req.body;

  try {
    const userExists = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!userExists) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (linkedinurl !== undefined) updateData.linkedinurl = linkedinurl;
    if (githuburl !== undefined) updateData.githuburl = githuburl;
    if (portfolio !== undefined) updateData.portfolio = portfolio;

    if (skills !== undefined) {
      updateData.skills = Array.isArray(skills)
        ? skills
        : skills.split(",").map((skill: String) => skill.trim());
    }

    await prisma.user.update({
      where: { id: Number(userId) },
      data: updateData,
    });

    res.status(200).json({
      message: "Profile Updated Successfully.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
