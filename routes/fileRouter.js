import { Router } from "express";
import { ensureAuth } from "../middleware/authMiddleware.js";
import {
    completeUpload, deleteFile,
    downloadFile, getFile,
} from "../controllers/fileController.js";
import { getMyFiles, createUploadRequest } from "../controllers/fileController.js";

const fileRouter = Router();

fileRouter.get("/", ensureAuth, getMyFiles);

fileRouter.get("/:id", ensureAuth, getFile);

fileRouter.post('/upload-request', 
    ensureAuth, createUploadRequest
);

fileRouter.post('/complete-upload', ensureAuth, completeUpload);

fileRouter.get("/:id/download", ensureAuth, downloadFile);

fileRouter.delete("/:id", ensureAuth, deleteFile)

export default fileRouter;