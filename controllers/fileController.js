import {
    getFolderById,
    getFoldersByUser
} from "../db/folderQueries.js";
import { createFile, getFilesInRoot } from "../db/fileQueries.js";

export const uploadFile = async (req, res) => {
    const folderId = req.body.folderId
        ? Number(req.body.folderId)
        : null;

    if (folderId !== null) {
        const folder = await getFolderById(folderId, req.user.id);
        if (!folder) {
            return res.status(400).send('Invalid folder');
        }
    }

    const fileData = {
        name: req.file.originalname,
        storageKey: req.file.filename,
        mimeType: req.file.mimetype,
        size: req.file.size,
        userId: req.user.id,
        folderId,
    };

    await createFile(fileData);

    res.redirect("/files");
};

export const getMyFiles = async (req, res) => {
    const folders = await getFoldersByUser(req.user.id);
    const rootFiles = await getFilesInRoot();

    res.render("my-files", {
        title: "My Files",
        folders: folders,
        files: rootFiles,
    });
}