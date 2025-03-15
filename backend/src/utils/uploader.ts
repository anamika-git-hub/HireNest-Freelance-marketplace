import crypto from "crypto";
import { DeleteObjectCommand, S3Client,PutObjectCommand  } from "@aws-sdk/client-s3";
import multer from "multer";
import dotenv from "dotenv";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "ffmpeg-static"; 
import { Upload } from "@aws-sdk/lib-storage";
import { fileURLToPath } from "url";
dotenv.config({ path: ".env" });
import { CompleteMultipartUploadCommandOutput } from "@aws-sdk/client-s3";
import { Req,Res,Next } from "../infrastructure/types/serverPackageTypes";

// Set ffmpeg path
// ffmpeg.setFfmpegPath(ffmpegInstaller.path);

// ES6 way to get __dirname
// const __filename = fileURLToPath(import.meta.url);
// const _dirname = path.dirname(_filename);

// Ensure the temp directory exists
// const tempDir = path.join(__dirname, "temp");
// if (!fs.existsSync(tempDir)) {
//   fs.mkdirSync(tempDir);
// }


if (!process.env.S3_ACCESS_KEY_ID || !process.env.S3_SECRET_ACCESS_KEY) {
    throw new Error("Missing required AWS credentials in environment variables");
  }
  
export const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});

const storage = multer.memoryStorage(); 

export const uploader = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 8000000,
    },
    fileFilter: function (req, file, cb) {
      const ext = path.extname(file.originalname).toLowerCase();
      if ([".jpg", ".jpeg", ".png"].includes(ext)) {
          cb(null, true);
      } else {
          cb(new Error("Only JPG, JPEG, and PNG files are allowed"));
      }
    },
  }).fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'idFrontImage', maxCount: 1 },
    { name: 'idBackImage', maxCount: 1 }
  ]);

  export const milestoneUploader = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 8000000, 
    },
    fileFilter: function (req, file, cb) {
      const ext = path.extname(file.originalname).toLowerCase();
      if ([".jpg", ".jpeg", ".png", ".pdf", ".doc", ".docx", ".zip"].includes(ext)) {
        cb(null, true);
      } else {
        cb(new Error("Invalid file type for milestone submission"));
      }
    },
  }).single('file'); 

  export const messageFileUploader = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 8000000,
    },
    fileFilter: function (req, file, cb) {
      const ext = path.extname(file.originalname).toLowerCase();
      if ([".jpg", ".jpeg", ".png", ".pdf", ".doc", ".docx", ".mp3", ".mp4"].includes(ext)) {
        cb(null, true);
      } else {
        cb(new Error("Unsupported file type for chat"));
      }
    },
  }).single('file'); 

// Function to delete a file from S3
// export const deleteFromS3 = async (key) => {
//   try {
//     const deleteParams = {
//       Bucket: process.env.AWS_S3_BUCKET_NAME,
//       Key: key,
//     };
//     await s3Client.send(new DeleteObjectCommand(deleteParams));
//     return true;
//   } catch (err) {
//     console.error("Error deleting file from S3:", err);
//     return false;
//   }
// };

if (!process.env.S3_BUCKET_NAME) {
    throw new Error("Missing S3_BUCKET_NAME environment variable");
  }
  
  export const uploadToS3 = async (
    buffer: Buffer,
    fileName: string
  ): Promise<CompleteMultipartUploadCommandOutput> => {
    try {
      const uploadParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName, 
        Body: buffer,
      };
  
      const uploader = new Upload({
        client: s3Client,
        params: uploadParams,
      });
  
      return await uploader.done();
    } catch (error) {
      console.error("Error uploading to S3:", error);
      throw error;
    }
  };


 const compressFile = async (fileBuffer:Buffer) => {
  try {
    const compressedBuffer = await sharp(fileBuffer)
      .resize({ width: 600 })  
      .jpeg({ quality: 80 })   
      .toBuffer();

    const compressedSize = Buffer.byteLength(compressedBuffer);

    return { compressedBuffer, compressedSize };
  } catch (error) {
    console.error("Error compressing file:", error);
    throw error;
  }
};

export const compressionMiddleware = async (
    req: Req,
    res: Res,
    next: Next
) => {
    console.log('Compression middleware started');
    try {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        if (!files) {
            return next(new Error('No files uploaded'));
        }

        for (const fieldName in files) {
            const file = files[fieldName][0]; 
            const { compressedBuffer, compressedSize } = await compressFile(file.buffer);
            file.buffer = compressedBuffer;
            file.size = compressedSize;
        }

        next();
    } catch (error) {
        console.error('Compression error:', error);
        next(error);
    }
};