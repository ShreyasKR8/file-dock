import { Router } from 'express'
import { 
    registerGet, 
    loginGet,
    logoutGet,
    registerPost,
    loginPost,
} from '../controllers/authController.js'

const authRouter = Router();

authRouter.get('/register', registerGet);
authRouter.post('/register', registerPost);

authRouter.get('/login', loginGet);
authRouter.post('/login', loginPost);

authRouter.get('/logout', logoutGet);

export default authRouter;