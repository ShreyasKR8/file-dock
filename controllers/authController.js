import { body, validationResult } from "express-validator";
import { createUser, getUserByEmail } from "../db/userQueries.js";
import bcrypt from "bcryptjs";

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 50 characters.";

const validateUser = [
    body("firstname").trim()
        .notEmpty().withMessage("First name is required")
        .bail()
        .isAlpha().withMessage(`First name ${alphaErr}`)
        .isLength({ min: 1, max: 50 }).withMessage(`First name ${lengthErr}`),
    body("lastname").trim()
        .notEmpty().withMessage("Last name is required")
        .bail()
        .isAlpha().withMessage(`Last name ${alphaErr}`)
        .isLength({ min: 1, max: 50 }).withMessage(`Last name ${lengthErr}`),
    body("email").trim()
        .notEmpty().withMessage('Email is required')
        .bail()
        .isEmail().withMessage('Please enter a valid email address')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
        .bail()
        .isLength({ min: 5 })
        .withMessage(
            'Password must be at least 5 characters'
        ),
];

const passwordConfirmationValidator = body('confirmpassword')
    .custom((value, { req }) => {
        if (!value) {
            throw new Error('Please confirm your password');
        }

        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    });

export const registerGet = async (req, res) => {
    res.render('auth/register-form', {
        errors: [],
        formData: {},
    });
}

export const registerPost = [
    validateUser,
    passwordConfirmationValidator,

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log(errors.array());

            return res.render('auth/register-form', {
                errors: errors.array(),
                formData: req.body,
            });
        }

        next();
    },
    async (req, res, next) => {
        try {
            const existingUser = await getUserByEmail(req.body.email);
            if (existingUser) {
                return res.status(422).render("auth/register-form", {
                    errors: [{ msg: "E-mail already in use" }],
                    formData: {
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        email: req.body.email,
                    },
                });
            }

            const hashedPassword = await bcrypt.hash(
                req.body.password,
                10
            );

            const user = {
                firstName: req.body.firstname,
                lastName: req.body.lastname,
                email: req.body.email,
                passwordHash: hashedPassword,
            };

            await createUser(user);

            res.redirect("/auth/login");
        } catch (err) {
            console.error("Registration failed:", err);

            return res.status(500).render("auth/register-form", {
                errors: [{
                    msg: "We couldn't complete registration. Please try again later.",
                }],
                formData: {
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                },
            });
        }
    }
];

export const loginGet = (req, res) => {
    res.render("auth/login-form");
};

export const logoutGet = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        res.redirect("/");
    });
};
