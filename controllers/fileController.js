import { getFoldersByUser } from "../db/folderQueries.js";

export const uploadFile = async (req, res) => {
    console.log(req.file);

    res.redirect("/");
};

export const getMyFiles = async (req, res) => {
    const folders = await getFoldersByUser(req.user.id);
    // console.log(folders);
    res.render("my-files", {
        title: "My Files",
        folders: folders,
    });
}