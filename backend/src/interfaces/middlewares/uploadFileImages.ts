import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); 
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); 
    },
});

const fileFilter = (req: any, file: any, cb: any) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if ([".jpg", ".jpeg", ".png"].includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPG, JPEG, and PNG files are allowed"));
    }
};

export const upload = multer({ storage, fileFilter });

export const uploadCategoryImage = upload.single("image");

export const uploadProfileImages = upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "idFrontImage", maxCount: 1 },
    { name: "idBackImage", maxCount: 1 },
]);

export const uploadFreelancerImages = upload.fields([
    {name: 'profileImage', maxCount:1},
    {name: 'attachments', maxCount:10},
]);

export const uploadTaskFiles = upload.fields([
    {name:'attachments', maxCount:10}
])

export const uploadMultimedia = upload.fields([
    {name:'multimedia',maxCount:10}
])
