import { Router } from 'express';
import AuthController from '../controllers/authController';
import { validateRegistration } from '../middleware/validateRegistration';
import pool from '../../config/database';

const router = Router();

const authController = new AuthController(pool);

router.post('/register', validateRegistration, authController.registerUser.bind(authController));

export default router;
