const createDialog = document.querySelector("#create-folder-dialog");
const openButton = document.querySelector("#create-folder-btn");
const cancelButton = document.querySelector("#cancel-folder-btn");

const editDialogs = document.querySelectorAll(".edit-folder-dialog");
const openEditBtns = document.querySelectorAll(".edit-folder-btn");
const cancelEditBtns = document.querySelectorAll(".cancel-edit-folder-btn");

const openDeleteBtns = document.querySelectorAll(".delete-folder-btn");
const cancelDeleteBtns = document.querySelectorAll(".cancel-delete-folder-btn");

//-------------- Bind create folder events----------------//
if (createDialog?.dataset.hasErrors === "true") {
    createDialog.showModal();
}

openButton.addEventListener("click", () => {
    createDialog.showModal();
});

cancelButton.addEventListener("click", () => {
    createDialog.close();
});
//--------------xxxxxxxxxxxxxxxxxxxxxx----------------//

//---------------- Bind edit folder events -------------//
editDialogs.forEach(dialog => {
    if (dialog?.dataset.hasErrors === "true") {
        dialog.showModal();
    }
});

openEditBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        const folder = btn.closest(".folder"); 
        const editDialog = folder.querySelector(".edit-folder-dialog");
        editDialog.showModal();
    });
});

cancelEditBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        const folder = btn.closest(".folder"); 
        const editDialog = folder.querySelector(".edit-folder-dialog");
        editDialog.close();
    });
});
//---------------- xxxxxxxxxxxxxxxxxx -------------//

//----------------- Bind delete folder events ---------------//
openDeleteBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        const folder = btn.closest(".folder"); 
        const deleteDialog = folder.querySelector(".delete-folder-dialog"); 
        deleteDialog.showModal();
    });
});

cancelDeleteBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        const folder = btn.closest(".folder"); 
        const deleteDialog = folder.querySelector(".delete-folder-dialog"); 
        deleteDialog.close();
    });
});
//---------------- xxxxxxxxxxxxxxxxxx -------------//
