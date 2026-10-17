import { createHash } from "node:crypto"
import {
    getSharedFolderByTokenHash,
} from "../db/folderLinkQueries.js";

export const validateShareLink = async (req, res, next) => {
    try {
        const { token } = req.params;

        const tokenHash = createHash("sha256")
            .update(token)
            .digest("hex");

        const sharedFolder = await getSharedFolderByTokenHash(tokenHash);

        if (!sharedFolder) {
            return res.status(404).send("Shared link not found");
        }

        if (new Date() >= sharedFolder.expiresAt) {
            return res.status(410).send(
                "This shared link has expired. Please request a new link from the folder owner."
            );
        }

        if (!sharedFolder.folder) {
            return res.status(404).send("Folder not found");
        }

        // Make the validated data available to subsequent handlers
        // Express provides res.locals to store request-scoped data that subsequent middleware, 
        // controllers, and EJS templates can access.
        res.locals.sharedFolder = sharedFolder;

        next();
    } catch (error) {
        next(error);
    }
};