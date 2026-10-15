import { Router } from "express";
    
import { getSharedFolder } from "../controllers/sharedController.js";

const sharedRouter = Router();

sharedRouter.get('/:token', getSharedFolder);

export default sharedRouter;