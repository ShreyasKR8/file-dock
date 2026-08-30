export const uploadFile = async (req, res) => {
    console.log(req.file);

    res.redirect("/");
};