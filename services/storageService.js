import crypto from "node:crypto";
import supabase from "../config/supabase.js";

const BUCKET_NAME = process.env.SUPABASE_BUCKET;

export async function createSignedUpload(fileName, userId) {
    // Keep the original display name in the database; use safe characters in storage.
    const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storagePath =
        `${userId}/${crypto.randomUUID()}-${safeFileName}`;

    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .createSignedUploadUrl(storagePath);

    if (error) {
        throw error;
    }

    return {
        storagePath,
        token: data.token,
    };
}
