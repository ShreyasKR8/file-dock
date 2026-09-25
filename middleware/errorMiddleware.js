import { getFoldersByUser } from "../db/folderQueries.js";
import { getFilesInRoot } from "../db/fileQueries.js";
import { MAX_FILE_SIZE } from "../config/constants.js";

export const handleUploadError = async (err, req, res, next) => {
    let message = "File upload failed.";

    if (err.code === "LIMIT_FILE_SIZE") {
        message = "File must be 1 GB or smaller.";
    }

    if (err.code === "INVALID_FILE_TYPE") {
        message = "This file type is not supported.";
    }

    // load whatever my-files.ejs needs
    const folders = await getFoldersByUser(req.user.id);
    const files = await getFilesInRoot();
    const supabaseProjectId = new URL(process.env.SUPABASE_URL)
    .hostname
    .split(".")[0];

    return res.status(400).render("my-files", {
        title: "My Files",
        folders,
        files,
        uploadErrors: [{ msg: message }],
        maxFileSize: MAX_FILE_SIZE,
        supabaseProjectId
    });
};
