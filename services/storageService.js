import crypto from "node:crypto";
import supabase from "../config/supabase.js";

const BUCKET_NAME = process.env.SUPABASE_BUCKET;

export async function createSignedUpload(fileName, userId) {
    const storagePath =
        `${userId}/${crypto.randomUUID()}-${fileName}`;

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