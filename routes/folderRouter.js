import { Router } from "express";
import { createFolderGet, createFolderPost } from "../controllers/folderController.js";
import { renameFolder } from "../controllers/folderController.js";

const folderRouter = Router();

//created from a <dialog>
// folderRouter.get("/create", createFolderGet);
folderRouter.post("/create", createFolderPost);

folderRouter.patch("/:id", renameFolder)

export default folderRouter;
