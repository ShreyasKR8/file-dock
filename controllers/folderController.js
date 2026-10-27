import { MAX_FILE_SIZE } from "../config/constants.js";
import supabase from "../config/supabase.js";
import { getFilesByFolderId } from "../db/fileQueries.js";
import {
    createFolder,
    deleteFolderWithFiles,
    getFolderById,
    updateFolderName,
    createShareLink,
} from "../db/folderQueries.js";
import { body, validationResult } from "express-validator";
import { randomBytes, createHash } from "node:crypto";

const allowedDurations = [1, 7, 30];

export const validateFolder = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Folder name is required.")
        .isLength({ max: 100 })
        .withMessage("Folder name must be 100 characters or fewer.")
        .custom((name) => {
            if (name === "." || name === "..") {
                throw new Error("Folder name cannot be '.' or '..'.");
            }

            if (/[\/\\]/.test(name)) {
                throw new Error("Folder name cannot contain '/' or '\\'.");
            }

            if (/[\x00-\x1F\x7F]/.test(name)) {
                throw new Error("Folder name contains invalid characters.");
            }

            return true;
        }),
];

export const createFolderPost = [
    validateFolder,
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.session.formError = {
                action: "create-folder",
                errors: errors.array(),
                formData: { name: req.body.name },
            };

            return req.session.save((err) => {
                if (err) return next(err);
                return res.redirect(303, "/files");
            });
        }

        next();
    },
    async (req, res, next) => {
        try {
            const folderData = {
                name: req.body.name,
                userId: req.user.id,
            }

            await createFolder(folderData);

            res.redirect(303, "/files");
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
];

export const createFolderGet = async (req, res) => {
    res.render("folder-form", {
        errors: [],
        formData: {},
    });
};

export const getFolder = async (req, res) => {
    const folderId = Number(req.params.id);
    if(isNaN(folderId)) {
        return res.status(400).send('Invalid folder ID');
    }

    const folder = await getFolderById(folderId, req.user.id);
    if (!folder) {
        return res.status(404).send("Folder not found");
    }

    const files = await getFilesByFolderId(folderId, req.user.id);
    // Get folders once nested folder support is added

    res.render("folder", {
        title: folder.name? folder.name : "Folder",  
        folder,
        files,
        folders: [],
        maxFileSize: MAX_FILE_SIZE,
        supabaseProjectId: new URL(process.env.SUPABASE_URL).hostname.split(".")[0],
        supabaseBucket: process.env.SUPABASE_BUCKET
    });
};

export const renameFolder = [
    validateFolder,
    async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            req.session.formError = {
                action: "rename-folder",
                folderId: String(req.params.id),
                errors: errors.array(),
                formData: { name: req.body.name },
            };

            return req.session.save((err) => {
                if (err) return next(err);
                return res.redirect(303, "/files");
            });
        }

        next();
    },
    async (req, res) => {
        const folderId = Number(req.params.id);
        if (isNaN(folderId)) {
            return res.status(400).send('Invalid folder ID');
        }

        const folder = await updateFolderName(
            folderId, req.user.id, req.body.name);

        res.redirect(303, "/files");
    }
];

export const deleteFolder = async (req, res, next) => {
    const folderId = Number(req.params.id);
    if (isNaN(folderId)) {
        return res.status(400).send('Invalid folder ID');
    }

    const files = await getFilesByFolderId(folderId, req.user.id);
    
    const storagePaths = files.map(file => file.storageKey);
    if(storagePaths.length > 0) {
        const { error } = await supabase.storage
        .from(process.env.SUPABASE_BUCKET)
        .remove(storagePaths);

        if(error) {
            return res.status(500).send(`Failed to delete folder contents: ${error}`);
        }
    }
    
    try {
        await deleteFolderWithFiles(folderId, req.user.id);

        return res.redirect("/");
    } catch (error) {
        next(error);
    }

    res.redirect("/files");
};

export const createFolderShareLink = async (req, res) => {
    const folderId = Number(req.params.id);
    if (isNaN(folderId)) {
        console.log("NAN folder")
        return res.status(400).json('Invalid folder ID');
    }

    // folder ownership check
    const folder = await getFolderById(folderId, req.user.id);
    if (!folder) {
        console.log("folder ownership check")
        return res.status(404).json("Folder not found");
    }

    // Generate a secure random token
    const token = randomBytes(32).toString("base64url");

    // Hash the token before storing it
    const tokenHash = createHash("sha256")
        .update(token)
        .digest("hex");


    const validDuration = Number(req.body.validDuration);
    if (!allowedDurations.includes(validDuration)) {
        console.log("allowed durartion")
        return res.status(400).json("Invalid link duration");
    }
    
    const expiresAt = new Date(
        Date.now() + validDuration * 24 * 60 * 60 * 1000
    );

    const linkRecord = await createShareLink(folderId, tokenHash, expiresAt);
    if(!linkRecord) {
        console.log("link create failed")
        return res.status(400).json('Link creation failed, try again later');
    }

    const shareLink = new URL(`/shared/${token}`, process.env.APP_URL).toString();

    return res.status(201).json({
        link: shareLink,
        expiresAt
    });
}
