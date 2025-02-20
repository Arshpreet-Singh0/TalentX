import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config({path:"../../.env"});

console.log(process.env.CLOUDINARY_CLOUD_NAME);


cloudinary.config({
  cloud_name: "djusmuols",
  api_key: "845295375246337",
  api_secret: "cutxPnuSrJl2ZTMvTApsdwu4yCU",
});

export default cloudinary;
