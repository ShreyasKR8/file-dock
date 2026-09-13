const fileInput = document.querySelector("#file");

fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];

    if (file && file.size > 1024 * 1024 * 1024) {
        alert("File must be 1 GB or smaller.");
        fileInput.value = "";
    }
});