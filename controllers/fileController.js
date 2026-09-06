import { getFoldersByUser } from "../db/folderQueries.js";
import { createFile } from "../db/fileQueries.js";

export const uploadFile = async (req, res) => {
    console.log(req.file);
    console.log(req.body.folderId);

    const folderId = req.body.folderId
        ? Number(req.body.folderId) 
        : null;

    //Todo: 
    // verify folder id belongs to current user to avoid malicious requests

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
    // console.log(folders);
    res.render("my-files", {
        title: "My Files",
        folders: folders,
    });
}