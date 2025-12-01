import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// No futuro, Íthalo vai criar aqui:
// router.post('/2fa', verify2fa);

export default router;
