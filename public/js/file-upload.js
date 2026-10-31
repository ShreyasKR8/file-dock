import * as tus from "tus-js-client";

const uploadForm = document.querySelector("#upload-form");
const fileInput = document.querySelector("#file-input");
const folderSelectElement = document.querySelector(".folder-select");
const uploadError = document.querySelector("#upload-error");
const uploadButton = uploadForm.querySelector('[type="submit"]');
const uploadProgress = document.querySelector("#upload-progress");
const progressBar = document.querySelector("#upload-progress-bar");
const progressPercentage = document.querySelector("#upload-percentage");
const progressBytes = document.querySelector("#upload-bytes");
const uploadStatus = document.querySelector("#upload-status");
const uploadButtonLabel = uploadButton.textContent;

let folderId = null;
let uploading = false;

uploadForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (uploading) return;
    uploadError.textContent = "";
    uploadError.hidden = true;

    const file = fileInput.files[0];

    if (!file) {
        showUploadError("Choose a file to upload.");
        return;
    }

    setUploading(true);
    progressBar.value = 0;
    progressPercentage.textContent = "0%";
    progressBytes.textContent = `0.0 / ${formatMB(file.size)} MB`;
    uploadProgress.hidden = false;
    setUploadStatus("Preparing upload…");

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

        const bucketName = window.SUPABASE_BUCKET;

        if(!bucketName) {
            throw new Error("Upload storage is not configured.");
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
                bucketName: bucketName,
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

        setUploadStatus("Uploading…");
        upload.start();
    } catch (error) {
        console.error("Upload setup failed:", error);
        showUploadError(error.message || "Could not start the upload. Please try again.");
    }
});

async function handleUploadComplete(storagePath, file) {
    onUploadProgress(file.size, file.size);
    setUploadStatus("Saving file…");

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

    window.location.href = "/";
}

function onUploadProgress(bytesUploaded, bytesTotal) {
    const percentage = bytesTotal > 0
        ? Math.min(100, Math.max(0, bytesUploaded / bytesTotal * 100))
        : 0;
    progressBar.value = percentage;
    progressPercentage.textContent = `${Math.floor(percentage)}%`;
    progressBytes.textContent = `${formatMB(bytesUploaded)} / ${formatMB(bytesTotal)} MB`;
    setUploadStatus(percentage === 100 ? "Saving file…" : "Uploading…");
}

function formatMB(bytes) {
    return (bytes / (1024 * 1024)).toFixed(1);
}

function setUploadStatus(message) {
    if (uploadStatus.textContent !== message) uploadStatus.textContent = message;
}

function setUploading(active) {
    uploading = active;
    fileInput.disabled = active;
    if (folderSelectElement) folderSelectElement.disabled = active;
    uploadButton.disabled = active;
    uploadButton.textContent = active ? "Uploading…" : uploadButtonLabel;
}

function onUploadError(error) {
    console.error("Upload failed:", error);
    showUploadError("Upload failed. Please try again. If it keeps failing, choose another file.");
}

function showUploadError(message) {
    setUploading(false);
    uploadProgress.hidden = true;
    setUploadStatus("");
    uploadError.textContent = message;
    uploadError.hidden = false;
}
