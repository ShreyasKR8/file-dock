import { getFileById, getFilesByFolderId } from "../db/fileQueries.js";
import path from "node:path";
import mime from "mime";
import supabase from "../config/supabase.js";

export const getSharedFolder = async (req, res) => {
    //res.locals passed down from shareLinkMiddlware
    const sharedFolder = res.locals.sharedFolder;

    const folder = sharedFolder.folder;
    if (!folder) {
        return res.status(404).send("Folder not found");
    }

    const files = await getFilesByFolderId(folder.id, folder.userId);

    const allFileDetails = files.map(file => {
        const parsedName = path.parse(file.name);
        const mimeType = mime.getType(parsedName.ext);

        return {
            name: parsedName.name,
            mimeType,
            size: formatFileSize(file.size),
            createdAt:
                file.createdAt.toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    weekday: "long",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                }) + " IST",
            downloadUrl: `/shared/${req.params.token}/files/${file.id}/download`,
        };
    });

    res.render("shared-folder", {
        title: folder.name? folder.name : "Shared folder",  
        folder,
        files: allFileDetails,
    });
};

export const downloadSharedFile = async(req, res, next) => {
    try {
        //res.locals passed down from shareLinkMiddlware
        const sharedFolder = res.locals.sharedFolder;
        const folder = sharedFolder.folder;

        const fileId = Number(req.params.fileId);
        if (!Number.isSafeInteger(fileId)) {
            return res.status(400).send('Invalid file ID');
        }

        const file = await getFileById(fileId, folder.userId);

        // verify folder ownership of file.
        if (!file || file.folderId !== folder.id) {
            return res.status(404).send("File not found");
        }

        const bucket = process.env.SUPABASE_BUCKET;

        if (!bucket) {
            throw new Error("SUPABASE_BUCKET is not configured");
        }

        const { data, error } = await supabase.storage
            .from(bucket)
            .createSignedUrl(file.storageKey, 60,
                {
                    download: file.name,
                }
            );
        
        if(error) {
            throw error;
        }

        return res.redirect(data.signedUrl);
    } catch (error) {
        next(error);
    }
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
