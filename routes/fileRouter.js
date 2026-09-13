import { Router } from "express";
import { ensureAuth } from "../middleware/authMiddleware.js"; 
import { downloadFile, getFile, uploadFile } from "../controllers/fileController.js";
import { getMyFiles } from "../controllers/fileController.js";
import { handleFileUpload } from "../middleware/upload.js";

const fileRouter = Router();

fileRouter.get("/", ensureAuth, getMyFiles);

fileRouter.get("/:id", ensureAuth, getFile);

fileRouter.post('/upload', 
    ensureAuth,
    handleFileUpload,
    uploadFile
);

fileRouter.get("/:id/download", ensureAuth, downloadFile);

export default fileRouter;