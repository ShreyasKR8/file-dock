import { Router } from "express";
import {
    createFolderGet,
    createFolderPost,
    renameFolder, deleteFolder
} from "../controllers/folderController.js";
import { ensureAuth } from "../middleware/authMiddleware.js";

const folderRouter = Router();

//created from a <dialog>
// folderRouter.get("/create", createFolderGet);
folderRouter.post("/create", ensureAuth, createFolderPost);

folderRouter.patch("/:id", ensureAuth, renameFolder);
folderRouter.delete("/:id", ensureAuth, deleteFolder);

export default folderRouter;
