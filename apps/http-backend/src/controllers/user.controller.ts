// import { NextFunction, Request, Response } from "express";
// import prisma from "../config/prisma"
// import bcryptjs from "bcryptjs";
// import jwt from "jsonwebtoken";
// import {JWT_SECRET as  secretKey} from "@repo/backend-common/config";



// export const signup = async (req: Request, res: Response, next : NextFunction): Promise<void> => {
//   try {
//     const { name, email, password, accountType } = req.body;
//     if (!name || !email || !password) {
//       res.status(400).json({ message: "Please fill all fields" });
//       return;
//     }

//     let user = await prisma.user.findFirst({
//       where: {
//         email: email,
//       },
//     });

//     if (user) {
//       res.status(400).json({
//         message: "User already exist with provided email.",
//         success: true,
//       });
//       return;
//     }

//     const hashedPassword = await bcryptjs.hash(password, 5);

//     user = await prisma.user.create({
//       data: {
//         name,
//         email,
//         password: hashedPassword,
//         accountType,
//       },
//     });

//     const token = jwt.sign({ userId: user.id }, secretKey, {
//       expiresIn: "7d",
//     });

//     const constructedUser = {
//       id: user.id,
//       name: user.name,
//       email: user.email,
//       accountType : user.accountType,
//     }


//     res.status(200)
//     .cookie("token", token, {
//       maxAge: 1 * 24 * 60 * 60 * 1000,
//       httpOnly: false,
//       sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
//       secure: process.env.NODE_ENV === "production", 
//     }).json({
//       message: "Account created successfully.",
//       user : constructedUser,
//       success: true,
//     });
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// };

// export const signin = async (req: Request, res: Response, next : NextFunction): Promise<void> => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       res.status(400).json({ message: "Please fill all fields" });
//       return;
//     }

//     let user = await prisma.user.findFirst({
//       where: {
//         email: email,
//       },
//     });

//     if (!user) {
//       res.status(400).json({
//         message: "Incorrect email or password",
//         success: false,
//       });
//       return;
//     }

//     const isPasswordMatched = await bcryptjs.compare(password, user.password);

//     if (!isPasswordMatched) {
//       res.status(400).json({
//         message: "Incorrect email or password",
//         success: false,
//       });
//       return;
//     }

//     const token = jwt.sign({ userId: user.id }, secretKey, {
//       expiresIn: "7d",
//     });

//     const constructedUser = {
//       id: user.id,
//       name: user.name,
//       email: user.email,
//       accountType : user.accountType,
//     }

//     res
//       .status(200)
//       .cookie("token", token, {
//         maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
//         httpOnly: false,
//         sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
//         secure: process.env.NODE_ENV === "production", 
//       })
//       .json({
//         message: `Welcome back ${user.name}`,
//         success: true,
//         user : constructedUser,
//       });
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// };


// export const updateUserProfile = async (req: Request, res: Response, next : NextFunction): Promise<void> => {
//   const userId = req.userId;
//   const {
//     name,
//     about,
//     location,
//     responseTime,
//     profilePicture,
//     hourlyRate,
//     availability,
//     role,
//     education,
//     skills
//   } = req.body;

//   try {
//     const userExists = await prisma.user.findUnique({
//       where: { id: Number(userId) },
//     });

//     if (!userExists) {
//       res.status(404).json({ message: "User not found" });
//       return;
//     }

//     const updateData: any = {};

//     if (name !== undefined) updateData.name = name;
//     if (about !== undefined) updateData.about = about;
//     if (location !== undefined) updateData.location = location;
//     if (responseTime !== undefined) updateData.responseTime = responseTime;
//     if (profilePicture !== undefined) updateData.profilePicture = profilePicture;
//     if (hourlyRate !== undefined) updateData.HourlyRate = hourlyRate;
//     if (availability !== undefined) updateData.availability = availability;
//     if (role !== undefined) updateData.role = role;

//     if (skills !== undefined) {
//       updateData.skills = Array.isArray(skills) ? skills : skills.split(",");
//     }

//     if (education !== undefined && Array.isArray(education)) {
//       const updatedEducation = education.map(({ id, userId, ...rest }: { id?: number; userId?: number } & EducationInput) => rest);
      
//       updateData.education = {
//         deleteMany: {}, 
//         create: updatedEducation,
//       };
//     }

//     await prisma.user.update({
//       where: { id: Number(userId) },
//       data: updateData,
//     });

//     res.status(200).json({
//       message: "Profile Updated Successfully.",
//       success: true,
//     });
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// };

// export const updateClientProfile = async (req: Request, res: Response, next : NextFunction): Promise<void> => {
//   const userId = req.userId;
//   const {
//     name,
//     companyName,
//     position,
//     location,
//     industry,
//     website,
//     profilePicture
//   } = req.body;

//   try {
//     const userExists = await prisma.user.findUnique({
//       where: { id: Number(userId) },
//     });

//     if (!userExists) {
//       res.status(404).send({ message: "User not found" });
//       return;
//     }

//     const user = await prisma.user.update({
//       where: { id: Number(userId) },
//       data: {
//         name,
//         location,
//         companyName,
//         position,
//         industry,
//         website,
//         profilePicture,
//       }
//     });
//     res.status(200).json({
//       message : 'Profile Updated Successfully.',
//       success : true
//     });
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// };

// export const getUserProfilebyId = async (req:Request, res:Response, next : NextFunction)=>{
//   const userId = req.params.id;

//   try {
//     const user = await prisma.user.findUnique({
//       where: { id: Number(userId) },
//       select: {
//         id: true,
//         name: true,
//         about: true,
//         location: true,
//         role: true,
//         email : true,
//         responseTime: true,
//         projectsCompleted : true,
//         rating : true,
//         ratingCount : true,
//         profilePicture : true,
//         education: true,
//         skills: true
//     },
//   });

//   res.status(200).json({
//     user,
//     success : true
//   });
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }

// }
// export const getUserProfile = async (req:Request, res:Response, next : NextFunction)=>{
//   const userId = req.userId;

//   try {
//     const user = await prisma.user.findUnique({
//       where: { id: Number(userId) },
//       select: {
//         id: true,
//         name: true,
//         about: true,
//         location: true,
//         role: true,
//         email : true,
//         companyName : true,
//         position : true,
//         website : true,
//         industry : true,
//         education: true,
//         skills: true,
//         yearOfExperience : true,
//         HourlyRate : true,
//     },
//   });

//   res.status(200).json({
//     user,
//     success : true
//   });
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }

// }

// interface EducationInput {
//   institution: string;
//   degree: string;
//   startYear: string;
//   endYear: string;
// }