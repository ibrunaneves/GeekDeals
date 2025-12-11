import express from 'express';
import { register, login, verify2FA, resend2FA } from '../controllers/authController.js';

const router = express.Router();

// Registro de usuário
router.post('/register', register);

// Login - Etapa 1 (retorna tempToken)
router.post('/login', login);

// 2FA - Etapa 2 (valida código e retorna accessToken)
router.post('/2fa/verify', verify2FA);

// Reenviar código 2FA
router.post('/2fa/resend', resend2FA);

export default router;
