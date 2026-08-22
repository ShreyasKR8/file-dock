import { Router } from 'express'
import { 
    registerGet, 
    loginGet
} from '../controllers/authController.js'

const authRouter = Router();

authRouter.get('/register', registerGet);
// authRouter.post('/register', registerPost);

authRouter.get('/login', loginGet);

export default authRouter;