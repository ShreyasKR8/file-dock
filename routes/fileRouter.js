import { Router } from "express";
import { ensureAuth } from "../middleware/authMiddleware.js"; 
import upload from "../config/multer.js";
import { uploadFile } from "../controllers/fileController.js";
import { getMyFiles } from "../controllers/fileController.js";

const fileRouter = Router();

fileRouter.get("/", ensureAuth, getMyFiles);

fileRouter.post('/upload', 
    ensureAuth,
    upload.single("file"),
    uploadFile
);

export default fileRouter;