import {
    getSharedFolderByTokenHash,
} from "../db/folderLinkQueries.js";
import { getFilesByFolderId } from "../db/fileQueries.js";
import { createHash } from "node:crypto";

export const getSharedFolder = async (req, res) => {
    const token = req.params.token;
    if(!token) {
        return res.status(400).send('Token not authorized');
    }

    const tokenHash = createHash("sha256")
        .update(token)
        .digest("hex");

    const sharedFolder = await getSharedFolderByTokenHash(tokenHash);

    if(!sharedFolder) {
        return res.status(404).send("Shared folder not found");
    }

    const folder = sharedFolder.folder;
    if (!folder) {
        return res.status(404).send("Folder not found");
    }

    const files = await getFilesByFolderId(folder.id, folder.userId);

    res.render("shared-folder", {
        title: folder.name? folder.name : "Shared folder",  
        folder,
        files,
    });
};
