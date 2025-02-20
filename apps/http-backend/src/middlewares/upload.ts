import { RequestHandler } from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "uploads",
    format: async () => "png",
    //@ts-ignore
    public_id: (req, file) => file.originalname.split(".")[0],
  },
});

const upload = multer({ storage });

// ✅ Explicitly define types using RequestHandler
export const uploadSingle: RequestHandler = upload.single("image");
export const uploadMultiple: RequestHandler = upload.array("images", 5);
