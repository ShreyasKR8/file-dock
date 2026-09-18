import multer from "multer";
import storage from "../config/multer.js";
import { MAX_FILE_SIZE } from "../config/constants.js";

const allowedMimeTypes = new Set([
    "image/jpeg",
    "image/png",
    "video/mp4",
    "image/webp",
    "application/pdf",
    "text/plain",
    "application/zip",
]);

const upload = multer({
    storage,
    limits: {
        fileSize: MAX_FILE_SIZE, //bytes, 
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