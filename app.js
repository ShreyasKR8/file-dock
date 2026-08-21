import express from "express";
import { fileURLToPath } from "node:url";
import path from "node:path";

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index", {
        title: "FileDock",
    });
});

app.listen(PORT, () => {
    console.log(`server listening at ${PORT}`);
});
