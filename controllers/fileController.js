import {
    getFolderById,
    getFoldersByUser
} from "../db/folderQueries.js";
import { createFile, getFileById, getFilesInRoot } from "../db/fileQueries.js";
import path from "node:path";

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
};

export const getFile = async (req, res) => {
    const fileId = Number(req.params.id);
    if(isNaN(fileId)) {
        return res.status(400).send('Invalid file ID');
    }

    const file = await getFileById(fileId, req.user.id);

    const parsedName = path.parse(file.name);

    const fileDetails = {
        ...file,
        name: parsedName.name,
        extension: parsedName.ext,
        size: formatFileSize(file.size),
        createdAt: file.createdAt.toLocaleString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
        }),
    };

    res.render("file", { file: fileDetails });
};

const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(2)} KB`;
    }

    if (bytes < 1024 * 1024 * 1024) {
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }

    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};