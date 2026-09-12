import { Router } from "express";
import {
    createFolderPost,
    renameFolder, deleteFolder,
    getFolder
} from "../controllers/folderController.js";
import { ensureAuth } from "../middleware/authMiddleware.js";

const folderRouter = Router();

//created from a <dialog>
// folderRouter.get("/create", createFolderGet);
folderRouter.post("/create", ensureAuth, createFolderPost);

folderRouter.get("/:id", ensureAuth, getFolder);
folderRouter.patch("/:id", ensureAuth, renameFolder);
folderRouter.delete("/:id", ensureAuth, deleteFolder);

export default folderRouter;
