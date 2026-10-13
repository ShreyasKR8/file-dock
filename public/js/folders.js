const createDialog = document.querySelector("#create-folder-dialog");
const openButton = document.querySelector("#create-folder-btn");
const cancelButton = document.querySelector("#cancel-folder-btn");

const editDialogs = document.querySelectorAll(".edit-folder-dialog");
const openEditBtns = document.querySelectorAll(".edit-folder-btn");
const cancelEditBtns = document.querySelectorAll(".cancel-edit-folder-btn");

const openDeleteBtns = document.querySelectorAll(".delete-folder-btn");
const cancelDeleteBtns = document.querySelectorAll(".cancel-delete-folder-btn");

const shareBtns = document.querySelectorAll(".share-folder-btn");
const shareForm = document.querySelector(".share-folder-form");
const shareDialog = document.querySelector(".share-dialog");
const cancelShareBtn = document.querySelector(".cancel-share-folder-btn");
const closeShowLinkBtn = document.querySelector(".close-show-link-btn");


//-------------- Bind create folder events----------------//
if (createDialog?.dataset.hasErrors === "true") {
    createDialog.showModal();
}

openButton?.addEventListener("click", () => {
    createDialog.showModal();
});

cancelButton?.addEventListener("click", () => {
    createDialog.close();
});
//--------------xxxxxxxxxxxxxxxxxxxxxx----------------//

//---------------- Bind edit folder events -------------//
editDialogs?.forEach(dialog => {
    if (dialog?.dataset.hasErrors === "true") {
        dialog.showModal();
    }
});

openEditBtns?.forEach(btn => {
    btn.addEventListener("click", () => {
        const folder = btn.closest(".folder"); 
        const editDialog = folder.querySelector(".edit-folder-dialog");
        editDialog.showModal();
    });
});

cancelEditBtns?.forEach(btn => {
    btn.addEventListener("click", () => {
        const folder = btn.closest(".folder"); 
        const editDialog = folder.querySelector(".edit-folder-dialog");
        editDialog.close();
    });
});
//---------------- xxxxxxxxxxxxxxxxxx -------------//

//----------------- Bind delete folder events ---------------//
openDeleteBtns?.forEach(btn => {
    btn.addEventListener("click", () => {
        const folder = btn.closest(".folder"); 
        const deleteDialog = folder.querySelector(".delete-folder-dialog"); 
        deleteDialog.showModal();
    });
});

cancelDeleteBtns?.forEach(btn => {
    btn.addEventListener("click", () => {
        const folder = btn.closest(".folder"); 
        const deleteDialog = folder.querySelector(".delete-folder-dialog"); 
        deleteDialog.close();
    });
});
//---------------- xxxxxxxxxxxxxxxxxx -------------//

//----------------- Bind share folder events ---------------//
shareBtns?.forEach(btn => {
    btn.addEventListener("click", () => {
        const folderId = btn.dataset.folderId;

        shareForm.action = `/folders/${folderId}/share`;

        shareDialog.showModal();
    });
});

cancelShareBtn?.addEventListener("click", () => {
    shareDialog.close();
});

shareForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const response = await fetch(shareForm.action, {
        method: "POST",
        body: new URLSearchParams(new FormData(shareForm)),
    });

    if(!response.ok) {
        console.log(response.statusText);
        return;
    }

    const data = await response.json();
    // console.log(data.link, data.expiresAt);

    shareDialog.close();

    const showLinkDialog = document.querySelector(".show-link-dialog");
    showLinkDialog.showModal();

    const linkText = document.querySelector(".share-link");
    linkText.textContent = data.link;
});

closeShowLinkBtn?.addEventListener("click", () => {
    shareDialog.close();
});

//------------xxxxxxxxxxxxxx----------------//


