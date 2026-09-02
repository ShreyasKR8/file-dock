import { Router } from "express";
import { createFolderGet, createFolderPost } from "../controllers/folderController.js";

const folderRouter = Router();

folderRouter.get("/create", createFolderGet)
folderRouter.post("/create", createFolderPost);

export default folderRouter;
