import * as tus from "tus-js-client";

const uploadForm = document.querySelector("#upload-form");
const fileInput = document.querySelector("#file-input");
const folderSelectElement = document.querySelector(".folder-select");
const uploadError = document.querySelector("#upload-error");

let folderId = null;

uploadForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    uploadError.textContent = "";
    uploadError.hidden = true;

    const file = fileInput.files[0];

    if (!file) {
        showUploadError("Choose a file to upload.");
        return;
    }

    try {
        const response = await fetch("/files/upload-request", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: file.name,
                size: file.size,
                mimeType: file.type,
                folderId: null,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(
                errorData?.error ?? `Failed to create upload request (${response.status}).`
            );
        }

        const { storagePath, token } = await response.json();

        const upload = new tus.Upload(file, {
            endpoint:
                `https://${window.SUPABASE_PROJECT_ID}.storage.supabase.co/storage/v1/upload/resumable/sign`,

            retryDelays: [0, 3000, 5000, 10000, 20000],

            headers: {
                "x-signature": token,
            },

            metadata: {
                bucketName: "files",
                objectName: storagePath,
                contentType: file.type,
                cacheControl: "3600",
            },

            chunkSize: 6 * 1024 * 1024,

            uploadDataDuringCreation: true,

            removeFingerprintOnSuccess: true,

            onError: onUploadError,
            onProgress: onUploadProgress,
            onSuccess: () => handleUploadComplete(
                storagePath, file
            ).catch((error) => {
                console.error("Failed to save uploaded file:", error);
                showUploadError("The file uploaded, but its details could not be saved. Please try again.");
            }),

        });

        const previousUploads =
            await upload.findPreviousUploads();

        if (previousUploads.length > 0) {
            upload.resumeFromPreviousUpload(
                previousUploads[0]
            );
        }

        upload.start();
    } catch (error) {
        console.error("Upload setup failed:", error);
        showUploadError(error.message || "Could not start the upload. Please try again.");
    }
});

async function handleUploadComplete(storagePath, file) {
    console.log("Upload successful.");
    // console.log("Storage path:", storagePath);
    // console.log("TUS URL:", upload.url);

    if (folderSelectElement) {
        folderId = folderSelectElement.value
            ? Number(folderSelectElement.value)
            : null;
    } else if (uploadForm.dataset.folderId) {
        folderId = Number(uploadForm.dataset.folderId);
    }
    const response = await fetch("/files/complete-upload", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: file.name,
            storageKey: storagePath,
            mimeType: file.type,
            size: file.size,
            folderId,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
            errorData?.error ?? `Failed to save file metadata (${response.status}).`
        );
    }
}

function onUploadProgress(bytesUploaded, bytesTotal) {
    const percentage =
        ((bytesUploaded / bytesTotal) * 100).toFixed(1);

    console.log(`${percentage}%`);
}

function onUploadError(error) {
    console.error("Upload failed:", error);
    showUploadError("Upload failed. Please try again. If it keeps failing, choose another file.");
}

function showUploadError(message) {
    uploadError.textContent = message;
    uploadError.hidden = false;
}
