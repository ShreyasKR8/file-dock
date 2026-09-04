import { Router } from "express";
import { ensureAuth } from "../middleware/authMiddleware.js"; 
import upload from "../config/multer.js";
import { uploadFile } from "../controllers/fileController.js";
import { getFolders } from "../db/folderQueries.js";

const fileRouter = Router();

fileRouter.get("/", async (req, res, next) => {
    try {
        const folders = await getFolders(req.user.id);

        res.render("my-files", {
            title: "My Files",
            folders: folders,
        });
    } catch (err) {
        next(err);
    }
});

fileRouter.post('/upload', 
    ensureAuth,
    upload.single("file"),
    uploadFile
);

export default fileRouter;