import { Router } from 'express'
import { 
    registerGet, 
    loginGet,
    logoutGet,
    registerPost,
} from '../controllers/authController.js'
import passport from 'passport';

const authRouter = Router();

authRouter.get('/register', registerGet);
authRouter.post('/register', registerPost);

authRouter.get('/login', loginGet);
authRouter.post('/login',
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/auth/login",
    })
);

authRouter.get('/logout', logoutGet);

export default authRouter;