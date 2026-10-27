import {
    getFolderById,
    getFoldersByUser
} from "../db/folderQueries.js";
import {
    createFile, deleteFileById,
    getFileById, getFilesInRoot
} from "../db/fileQueries.js";
import path from "node:path";
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from "../config/constants.js";
import { createSignedUpload } from "../services/storageService.js";
import supabase from "../config/supabase.js";


export const getMyFiles = async (req, res) => {
    const folders = await getFoldersByUser(req.user.id);
    const rootFiles = await getFilesInRoot(req.user.id);

    const supabaseUrl = process.env.SUPABASE_URL;
    const projectId = new URL(supabaseUrl).hostname.split(".")[0];

    const flash = req.session.formError;
    delete req.session.formError;

    res.render("my-files", {
        title: "My Files",
        folders,
        files: rootFiles,
        maxFileSize: MAX_FILE_SIZE,
        supabaseProjectId: projectId,
        supabaseBucket: process.env.SUPABASE_BUCKET,
        errors: flash?.errors ?? [],
        errorAction: flash?.action ?? null,
        errorFolderId: flash?.folderId ?? null,
        formData: flash?.formData ?? {},
    });


};

export const getFile = async (req, res) => {
    const fileId = Number(req.params.id);
    if (isNaN(fileId)) {
        return res.status(400).send('Invalid file ID');
    }

    const file = await getFileById(fileId, req.user.id);

    if (!file) {
        return res.status(404).send("File not found");
    }

    const parsedName = path.parse(file.name);

    const fileDetails = {
        ...file,
        name: parsedName.name,
        extension: parsedName.ext,
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
    };

    res.render("file", { file: fileDetails });
};

export const downloadFile = async (req, res, next) => {
    try {
        const fileId = Number(req.params.id);
        if (isNaN(fileId)) {
            return res.status(400).send('Invalid file ID');
        }

        const file = await getFileById(fileId, req.user.id);

        if (!file) {
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

        if (error) {
            throw error;
        }

        return res.redirect(data.signedUrl);

    } catch (error) {
        next(error);
    }
};

export const createUploadRequest = async (req, res, next) => {
    try {
        const {
            name, size, mimeType, folderId,
        } = req.body;


        if (typeof name !== "string" || !name.trim() || !Number.isSafeInteger(size) || size <= 0) {
            return res.status(400).json({
                error: "Missing file metadata.",
            });
        }

        if (!ALLOWED_MIME_TYPES.has(mimeType)) {
            return res.status(400).json({ error: "This file type is not supported." });
        }

        if (size > MAX_FILE_SIZE) {
            return res.status(400).json({
                error: `File must be ${MAX_FILE_SIZE / (1024 * 1024)} MB or smaller.`,
            });
        }

        const {
            storagePath,
            token
        } = await createSignedUpload(name, req.user.id);

        res.json({
            storagePath,
            token,
        });
    } catch (error) {
        console.error("Failed to create signed upload:", error);
        return res.status(500).json({
            error: "Failed to create upload request. Check the server logs for details.",
        });
    }
};

export const completeUpload = async (req, res, next) => {
    try {
        // verify ownership of storage key
        const expectedPrefix = `${req.user.id}/`;
        if(typeof req.body.storageKey !== "string" ||
            !req.body.storageKey.startsWith(expectedPrefix)
        ) {
            return res.status(403).json({
                error: "Invalid upload path",
            });
        }

        const { storedObject, error: uploadError } = await validateUploadedObject(req.body.storageKey);
        if (uploadError) {
            return res.status(400).json({ error: uploadError });
        }

        const { folderId: normalizedFolderId, error: folderError } = await validateUploadFolder(
            req.body.folderId,
            req.user.id
        );
        if (folderError) {
            return res.status(400).json({ error: folderError });
        }

        const fileData = {
            name: req.body.name,
            storageKey: req.body.storageKey,
            mimeType: storedObject.contentType,
            size: storedObject.size,
            userId: req.user.id,
            folderId: normalizedFolderId,
        };

        const file = await createFile(fileData);

        // redirects to '/' home in file-upload.js file
        return res.status(201).json({ file });
    } catch (error) {
        next(error);
    }
};

const validateUploadedObject = async (storageKey) => {
    const { data: storedObject, error } = await supabase.storage
        .from(process.env.SUPABASE_BUCKET)
        .info(storageKey);

    if (error || !storedObject) {
        return { error: "Uploaded file could not be found" };
    }

    if (
        !storedObject.size ||
        storedObject.size > MAX_FILE_SIZE ||
        !ALLOWED_MIME_TYPES.has(storedObject.contentType)
    ) {
        return { error: "Uploaded file is invalid." };
    }

    return { storedObject };
};

const validateUploadFolder = async (folderId, userId) => {
    const normalizedFolderId =
        folderId === null || folderId === "" || folderId === undefined
            ? null
            : Number(folderId);

    if (normalizedFolderId !== null && !Number.isInteger(normalizedFolderId)) {
        console.error("failed to normalize folder id");
        return { error: "Invalid folder ID." };
    }

    if (normalizedFolderId !== null) {
        const folder = await getFolderById(normalizedFolderId, userId);
        if (!folder) {
            console.error("failed to find folder in db");
            return { error: "Invalid folder." };
        }
    }

    return { folderId: normalizedFolderId };
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

export const deleteFile = async (req, res, next) => {
    try {
        const fileId = Number(req.params.id);
        if (isNaN(fileId)) {
            return res.status(400).send('Invalid file ID');
        }

        const file = await getFileById(fileId, req.user.id);

        if (!file) {
            return res.status(404).send("File not found");
        }

        const storagePath = file.storageKey;

        const bucket = process.env.SUPABASE_BUCKET;

        if(!bucket) {
            return res.status(400).send("Supabase bucket name not specified");
        }

        const { error } = await supabase.storage
        .from(bucket)
        .remove([storagePath]);

        if(error) {
            console.error("Supabase delete error:", error);
            return res.status(500).send("Failed to delete file in storage");
        }

        await deleteFileById(fileId);

        res.redirect('/');
    } catch (error) {
        console.log("File Delete failed: ", error);
        next(error);
    }
};
