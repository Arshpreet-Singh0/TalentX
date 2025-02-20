import { RequestHandler } from 'express';
import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();
//@ts-ignore
const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);
  
    if (extname && mimeType) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  };
  //@ts-ignore
  export const upload : RequestHandler = multer({
    storage: storage,
    fileFilter: fileFilter,
  }).array('images', 10); // Maximum of 10 images at a time