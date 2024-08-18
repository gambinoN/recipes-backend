import { Router } from 'express';
import AuthController from '../controllers/authController';
import { asyncController } from '../util/asyncHandler';
import { validateRegistration } from '../middleware/validateRegistration';

const router = Router();

const authController = new AuthController();
const controller = asyncController(authController);

router.post('/register', validateRegistration, controller('registerUser'));

export default router;
