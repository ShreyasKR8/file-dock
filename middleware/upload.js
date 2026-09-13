import multer from "multer";
import storage from "../config/multer.js";

const MAX_SIZE = 50 * 1024 * 1024; // 50 MB
const allowedMimeTypes = new Set([
    "image/jpeg",
    // "image/png",
    "video/mp4",
    "image/webp",
    "application/pdf",
    "text/plain",
    "application/zip",
]);

const upload = multer({
    storage,
    limits: {
        fileSize: MAX_SIZE, //bytes, 
    },
    fileFilter,
});

function fileFilter(req, file, cb) {
    if (!allowedMimeTypes.has(file.mimetype)) {
        const error = new Error("Unsupported file type.");
        error.code = "INVALID_FILE_TYPE";
        return cb(error);
    }

    cb(null, true);
}

export const handleFileUpload = (req, res, next) => {
    upload.single("file")(req, res, (err) => {
        if (err) {
            return next(err);
        }

        next();
    });
};

export default upload;