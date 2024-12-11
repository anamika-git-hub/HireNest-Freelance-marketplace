import multer from "multer";
import path from "path";

// Storage configuration for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Temporary upload directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Correctly format the filename
    },
});

// File filter to allow only specific image formats
const fileFilter = (req: any, file: any, cb: any) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if ([".jpg", ".jpeg", ".png"].includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPG, JPEG, and PNG files are allowed"));
    }
};

// Multer configuration
export const upload = multer({ storage, fileFilter });

// Middleware to handle multiple file uploads
export const uploadProfileImages = upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "idFrontImage", maxCount: 1 },
    { name: "idBackImage", maxCount: 1 },
]);
