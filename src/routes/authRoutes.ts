import { Router } from 'express';
import AuthController from '../controllers/authController';
import { validateRegistration } from '../middleware/validateRegistration';

const router = Router();

const authController = new AuthController();

router.post('/register', validateRegistration, authController.registerUser.bind(authController));

export default router;
