const createDialog = document.querySelector("#create-folder-dialog");
const openButton = document.querySelector("#create-folder-btn");
const cancelButton = document.querySelector("#cancel-folder-btn");

const openEditBtns = document.querySelectorAll(".edit-folder-btn");
const cancelEditBtns = document.querySelectorAll(".cancel-edit-folder-btn");

const openDeleteBtns = document.querySelectorAll(".delete-folder-btn");
const cancelDeleteBtns = document.querySelectorAll(".cancel-delete-folder-btn");

const shareBtns = document.querySelectorAll(".share-folder-btn");
const shareForm = document.querySelector(".share-folder-form");
const shareDialog = document.querySelector(".share-dialog");
const cancelShareBtn = document.querySelector(".cancel-share-folder-btn");
const showLinkDialog = document.querySelector('.show-link-dialog');
const closeShowLinkBtn = document.querySelector(".close-show-link-btn");
const shareError = document.querySelector('.share-error');


//-------------- Bind create folder events----------------//
const errorDialog = document.querySelector('dialog[data-has-errors="true"]');
if (errorDialog && !errorDialog.open) {
    errorDialog.showModal();
}

openButton?.addEventListener("click", () => {
    createDialog.showModal();
});

cancelButton?.addEventListener("click", () => {
    createDialog.close();
});
//--------------xxxxxxxxxxxxxxxxxxxxxx----------------//

//---------------- Bind edit folder events -------------//
document.querySelectorAll('dialog[id^="rename-folder-dialog-"]').forEach(dialog => {
    dialog.addEventListener("close", () => {
        const nameInput = dialog.querySelector('input[name="name"]');
        nameInput.value = dialog.dataset.currentName;
        dialog.querySelectorAll(".form-errors").forEach(error => error.remove());
        dialog.dataset.hasErrors = "false";
    });
});

openEditBtns?.forEach(btn => {
    btn.addEventListener("click", () => {
        const editDialog = document.getElementById(
            `rename-folder-dialog-${btn.dataset.folderId}`
        );
        if (editDialog && !editDialog.open) editDialog.showModal();
    });
});

cancelEditBtns?.forEach(btn => {
    btn.addEventListener("click", () => {
        btn.closest("dialog")?.close();
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
        shareError.textContent = "";

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
    shareError.textContent = "";

    try {
        const response = await fetch(shareForm.action, {
            method: "POST",
            body: new URLSearchParams(new FormData(shareForm)),
        });
    
        const data = await response.json();
        // if not ok, data === "Invalid link duration" set from controller.
        
        if(!response.ok) {
            throw new Error(data || "Could not create share link.");
        }

        shareDialog.close();
    
        showLinkDialog.showModal();
    
        const linkText = document.querySelector(".share-link");
        linkText.textContent = data.link;
    } catch (err) {
        shareError.textContent = err.message;
    }
});

closeShowLinkBtn?.addEventListener("click", () => {
    showLinkDialog.close();
});

//------------xxxxxxxxxxxxxx----------------//

