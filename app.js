import express from "express";
import { fileURLToPath } from "node:url";
import path from "node:path";
import authRouter from "./routes/authRouter.js";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import passport from "passport";

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- passport init--- //
const FOUR_HOURS = 1000 * 60 * 60 * 4;
const FIFTEEN_MINUTES = 1000 * 60 * 15;
const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// PrismaSessionStore uses the Session(default) model exposed by PrismaClient
const sessionStore = new PrismaSessionStore(
    prisma,
    {
        checkPeriod: FIFTEEN_MINUTES,  //ms
        dbRecordIdIsSessionId: true,
    }
);

const sessionConfig = {
    store: sessionStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: FOUR_HOURS, //4 hours
    },
}

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// --- set up ejs view engine and path --- //
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// --- set up passport middlewares --- //
app.use(session(sessionConfig));
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

// --- set up router middlewares --- //
app.get("/", (req, res) => {
    res.render("index", {
        title: "FileDock",
    });
});

app.use('/auth', authRouter);

app.listen(PORT, () => {
    console.log(`server listening at ${PORT}`);
});
