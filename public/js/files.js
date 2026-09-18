const fileInput = document.querySelector("#file");
const maxFileSize = Number(fileInput.dataset.maxFileSize);

fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];

    if (file && file.size > maxFileSize) {
        alert("File must be 50 MB  or smaller.");
        fileInput.value = "";
    }
});