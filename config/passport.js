import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { getUserById, getUserByEmail } from "../db/userQueries.js";

const localStrategy =
    new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
        try {
            // console.log('Attempting login:', email);
            const user = await getUserByEmail(email);

            if (!user) {
                return done(null, false, {
                    message: "Incorrect email",
                });
            }

            const match = await bcrypt.compare(
                password,
                user.passwordHash
            );

            if (!match) {
                return done(null, false, {
                    message: "Incorrect password",
                });
            }

            return done(null, user);
        }
        catch (err) {
            return done(err);
        }
    });

passport.use(localStrategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await getUserById(id);

        done(null, user);
    }
    catch (err) {
        done(err);
    }
});
