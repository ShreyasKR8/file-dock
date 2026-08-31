import { createFolder } from "../db/folderQueries.js";
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

export const createFolder = [
    validateFolder,
    async (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            console.log(errors.array());

            //Todo: add a route
            // return res.render('auth/register-form', {
            //     errors: errors.array(),
            //     formData: req.body,
            // });
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

            res.redirect('/');
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
];
