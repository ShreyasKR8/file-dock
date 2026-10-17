import { getFileById, getFilesByFolderId } from "../db/fileQueries.js";
import { createHash } from "node:crypto";
import supabase from "../config/supabase.js";

export const getSharedFolder = async (req, res) => {
    //res.locals passed down from shareLinkMiddlware
    const sharedFolder = res.locals.sharedFolder;

    const folder = sharedFolder.folder;
    if (!folder) {
        return res.status(404).send("Folder not found");
    }

    const files = await getFilesByFolderId(folder.id, folder.userId);

    res.render("shared-folder", {
        title: folder.name? folder.name : "Shared folder",  
        folder,
        files,
        token,
    });
};

export const downloadSharedFile = async(req, res, next) => {
    try {
        //res.locals passed down from shareLinkMiddlware
        const sharedFolder = res.locals.sharedFolder;
        const folder = sharedFolder.folder;

        const fileId = Number(req.params.fileId);
        if (isNaN(fileId)) {
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
