import {
    createFolder,
    deleteFolderByUser,
    updateFolderName
} from "../db/folderQueries.js";
import { body, validationResult } from "express-validator";

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
            const folders = await getFoldersByUser(req.user.id);

            return res.status(400).render("my-files", {
                title: "My Files",
                folders,
                errors: errors.array(),
                formData: req.body,
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

            res.redirect('/files');
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

export const renameFolder = [
    validateFolder,
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const folders = await getFoldersByUser(req.user.id);

            return res.status(400).render("my-files", {
                title: "My Files",
                folders,
                errors: errors.array(),
                formData: req.body,
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

        res.redirect("/files");
    }
];

export const deleteFolder = async (req, res) => {
    const folderId = Number(req.params.id);
    if (isNaN(folderId)) {
        return res.status(400).send('Invalid folder ID');
    }

    await deleteFolderByUser(folderId, req.user.id);

    res.redirect("/files");
};
