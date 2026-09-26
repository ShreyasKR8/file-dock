import { Router } from "express";
import { ensureAuth } from "../middleware/authMiddleware.js"; 
import { completeUpload, downloadFile, getFile, uploadFile } from "../controllers/fileController.js";
import { getMyFiles, createUploadRequest } from "../controllers/fileController.js";
import { handleFileUpload } from "../middleware/upload.js";

const fileRouter = Router();

fileRouter.get("/", ensureAuth, getMyFiles);

fileRouter.get("/:id", ensureAuth, getFile);

// not used anymore as we moved from multer to supabase
fileRouter.post('/upload', 
    ensureAuth,
    handleFileUpload,
    uploadFile
);

fileRouter.post('/upload-request', 
    ensureAuth, createUploadRequest
);

fileRouter.post('/complete-upload', ensureAuth, completeUpload);

fileRouter.get("/:id/download", ensureAuth, downloadFile);

export default fileRouter;