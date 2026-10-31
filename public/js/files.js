const fileInput = document.querySelector("#file-input");
const maxFileSize = Number(fileInput.dataset.maxFileSize);

const openDeleteBtns = document.querySelectorAll(".delete-file-btn");
const cancelDeleteBtns = document.querySelectorAll(".cancel-delete-file-btn");

fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];

    if (file && file.size > maxFileSize) {
        alert("File must be 50 MB  or smaller.");
        fileInput.value = "";
    }
});

openDeleteBtns?.forEach(btn => {
    btn.addEventListener("click", () => {
        const file = btn.closest(".file"); 
        const deleteDialog = file.querySelector(".delete-file-dialog"); 
        deleteDialog.showModal();
    });
});

cancelDeleteBtns?.forEach(btn => {
    btn.addEventListener("click", () => {
        const file = btn.closest(".file"); 
        const deleteDialog = file.querySelector(".delete-file-dialog"); 
        deleteDialog.close();
    });
});
