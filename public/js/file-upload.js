import * as tus from "tus-js-client";

const uploadForm = document.querySelector("#upload-form");
const fileInput = document.querySelector("#file-input");

uploadForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const file = fileInput.files[0];

    if (!file) {
        console.error("No file selected.");
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

            onError(error) {
                console.error("Upload failed:", error);
            },

            onProgress(bytesUploaded, bytesTotal) {
                const percentage =
                    ((bytesUploaded / bytesTotal) * 100).toFixed(1);

                console.log(`${percentage}%`);
            },

            onSuccess() {
                console.log("Upload successful.");
                console.log("Storage path:", storagePath);
                console.log("TUS URL:", upload.url);
            },
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
    }
});
