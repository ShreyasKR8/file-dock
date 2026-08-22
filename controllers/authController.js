import { body, validationResult } from "express-validator"

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 50 characters.";

export const registerGet = async (req, res) => {
    res.render('auth/register-form', {
        errors: [],
        formData: {},
    });
}

export const loginGet = (req, res) => {
    res.render("auth/login-form");
};

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
    body("username")
        .trim()
        .notEmpty().withMessage("Username is required")
        .bail()
        .isLength({ min: 1, max: 50 })
        .withMessage("Username must be between 1 and 50 characters")
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username may only contain letters, numbers and underscores'),
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

const validateEmailNotInUse = body('email').custom(async value => {
    const user = await db.getUserByEmail(value);
    if (user) {
        throw new Error('E-mail already in use');
    }
});

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
