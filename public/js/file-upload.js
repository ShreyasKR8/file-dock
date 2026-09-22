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
        // 1. Ask Express for permission to upload this file
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
            const errorData = await response.json();

            throw new Error(
                errorData.error ?? "Failed to create upload request."
            );
        }

        const { storagePath, token } = await response.json();

        console.log("Storage path:", storagePath);

        // Actual TUS upload comes next.
        console.log("Signed token received:", Boolean(token));
    } catch (error) {
        console.error("Upload setup failed:", error);
    }
});