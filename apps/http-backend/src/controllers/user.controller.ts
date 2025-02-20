import { NextFunction, Request, Response } from "express";
import prisma from "../config/prisma";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET as secretKey } from "@repo/backend-common/config";
import cloudinary from "../config/cloudinary";
import getDataUri from "../config/dataURI";
import multer from "multer";
import path from "path";

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
        OR: [{ username: username }, { email: email }],
      },
    });
    if (user) {
      res.status(400).json({
        message: "Username or email Already Exist.",
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
        httpOnly: false,
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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files temporarily before uploading to Cloudinary
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
}).single("profileImage"); // Ensure the field name matches

export const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
    try {
      const userId = req.userId;
      const { name, linkedinUrl, githubUrl, portfolio, skills } = req.body;
      //@ts-ignore
      const filesDataUri = req?.files?.map((file)=>{
        return getDataUri(file)
    })
//@ts-ignore
const uploadPromises = filesDataUri.map((dataUri) =>
    cloudinary.uploader.upload(dataUri.content, { folder: 'E-Commerce' })
  );

  // Wait for all uploads to complete
  const uploadedFiles = await Promise.all(uploadPromises);
  //@ts-ignore
  const images = uploadedFiles.map((data)=>{
    return {url:data.secure_url, public_id:data.public_id};
  })


      const userExists = await prisma.user.findUnique({
        where: { id: Number(userId) },
      });

      if (!userExists) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      const updateData: any = {};
      if (name?.trim()) updateData.name = name;
      if (linkedinUrl?.trim()) updateData.linkedinUrl = linkedinUrl;
      if (githubUrl?.trim()) updateData.githubUrl = githubUrl;
      if (portfolio?.trim()) updateData.portfolio = portfolio;
      if(images.length > 0) updateData.avatar = images?.[0]?.url;
      // if (imageUrl) updateData.profileImage = imageUrl;

      if (skills) {
        updateData.skills = Array.isArray(skills)
          ? skills
          : skills.split(",").map((skill: string) => skill.trim());
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


export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where : {
        username : req.params.username,
      },
      include : {
        Project : true,
      }
    });

    res.status(200).json({
      user,
      success : true,
    })

  } catch (error) {
    console.log(error);
    next(error);
  }
}