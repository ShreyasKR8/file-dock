const dialog = document.querySelector("#create-folder-dialog");
const openButton = document.querySelector("#create-folder-btn");
const cancelButton = document.querySelector("#cancel-folder-btn");

if (dialog?.dataset.hasErrors === "true") {
    dialog.showModal();
}

openButton.addEventListener("click", () => {
    dialog.showModal();
});

cancelButton.addEventListener("click", () => {
    dialog.close();
});