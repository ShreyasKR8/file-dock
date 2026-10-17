import { Router } from "express";
import { downloadSharedFile, getSharedFolder } from "../controllers/sharedController.js";
import { validateShareLink } from "../middleware/shareLinkMiddleware.js";

const sharedRouter = Router();

sharedRouter.get('/:token', 
    validateShareLink, 
    getSharedFolder);

sharedRouter.get('/:token/files/:fileId/download', 
    validateShareLink, 
    downloadSharedFile);

export default sharedRouter;