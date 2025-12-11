/**
 * AuthController - Controle de autenticação
 * Projeto GeekDeals - Unifacisa 2025
 * 
 * Implementamos 2FA por email pra deixar mais seguro.
 * A ideia era usar Redis mas Map funciona bem pra escala do projeto.
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import dotenv from 'dotenv';
import User from '../models/User.js';
import { send2FACode } from '../services/emailService.js';

dotenv.config();

// Guarda os códigos 2FA temporariamente na memória
// Pesquisamos bastante e Map é mais eficiente que objeto comum pra isso
const twoFACodes = new Map();

// Limpa códigos expirados a cada 5 min pra não acumular lixo
setInterval(() => {
    const now = Date.now();
    for (const [key, data] of twoFACodes.entries()) {
        if (now > data.expiresAt) {
            twoFACodes.delete(key);
        }
    }
}, 5 * 60 * 1000);

// Gera código de 6 dígitos - crypto é mais seguro que Math.random
const generate2FACode = () => {
    return crypto.randomInt(100000, 999999).toString();
};

// Token temporário pra identificar a sessão durante o 2FA
const generateTempToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

// Assina o JWT final depois que passar pelo 2FA
const signJwt = (userId) => {
    return jwt.sign(
        { sub: userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION || '1h' }
    );
};

/**
 * Registro de novo usuário
 */
export const register = async (req, res) => {
    try {
        const { name, cpf, email, password } = req.body;

        // Validação básica
        if (!name || !cpf || !email || !password) {
            return res.status(400).json({ message: 'Campos obrigatórios ausentes.' });
        }

        // Verifica se já existe
        const existing = await User.findOne({ $or: [{ email }, { cpf }] });
        if (existing) {
            return res.status(409).json({ message: 'Email ou CPF já registrados.' });
        }

        // Hash da senha - salt 10 é o recomendado pela doc do bcrypt
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = new User({ name, cpf, email, passwordHash });
        await user.save();

        return res.status(201).json({
            id: user._id,
            name: user.name,
            email: user.email,
            message: 'Conta criada com sucesso!'
        });

    } catch (err) {
        console.error('[Register] Erro:', err);
        return res.status(500).json({ message: 'Erro no servidor.' });
    }
};

/**
 * Login - Primeira etapa
 * Valida email/senha e manda o código 2FA pro email
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        // Compara a senha com o hash
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        // Gera código e token pra essa sessão
        const code = generate2FACode();
        const tempToken = generateTempToken();

        // Salva no Map com expiração de 10 min
        twoFACodes.set(tempToken, {
            userId: user._id.toString(),
            code: code,
            email: user.email,
            attempts: 0, // limita tentativas erradas
            expiresAt: Date.now() + (10 * 60 * 1000)
        });

        // Tenta mandar o email
        try {
            await send2FACode(user.email, code, user.name);
        } catch (emailError) {
            console.error('[Login] Falha ao enviar email:', emailError.message);
            // Em dev mostra no console pra facilitar o teste
            if (process.env.NODE_ENV !== 'production') {
                console.log(`[2FA] Código para ${user.email}: ${code}`);
            }
        }

        return res.json({
            tempToken: tempToken,
            message: 'Código enviado para seu email.',
            expiresIn: 600 // 10 min em segundos
        });

    } catch (err) {
        console.error('[Login] Erro:', err);
        return res.status(500).json({ message: 'Erro no servidor.' });
    }
};

/**
 * Verificação 2FA - Segunda etapa
 * Confere o código e libera o JWT
 */
export const verify2FA = async (req, res) => {
    try {
        const { token, code } = req.body;

        if (!token || !code) {
            return res.status(400).json({ message: 'Token e código são obrigatórios.' });
        }

        const sessionData = twoFACodes.get(token);

        if (!sessionData) {
            return res.status(401).json({ message: 'Sessão expirada. Faça login novamente.' });
        }

        // Checa se expirou
        if (Date.now() > sessionData.expiresAt) {
            twoFACodes.delete(token);
            return res.status(401).json({ message: 'Código expirado. Faça login novamente.' });
        }

        // Max 5 tentativas pra evitar brute force
        if (sessionData.attempts >= 5) {
            twoFACodes.delete(token);
            return res.status(429).json({ message: 'Muitas tentativas. Faça login novamente.' });
        }

        sessionData.attempts++;

        // Compara o código
        if (sessionData.code !== code.toString()) {
            const remaining = 5 - sessionData.attempts;
            return res.status(401).json({
                message: `Código inválido. ${remaining} tentativa(s) restante(s).`
            });
        }

        // Deu certo, limpa a sessão e gera o token final
        twoFACodes.delete(token);
        const accessToken = signJwt(sessionData.userId);

        console.log(`[2FA] Login bem-sucedido: ${sessionData.email}`);

        return res.json({
            accessToken: accessToken,
            token: accessToken, // compatibilidade com o mobile
            message: 'Login realizado com sucesso!'
        });

    } catch (err) {
        console.error('[Verify2FA] Erro:', err);
        return res.status(500).json({ message: 'Erro no servidor.' });
    }
};

/**
 * Reenviar código 2FA
 * Caso o usuário não receba ou expire
 */
export const resend2FA = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ message: 'Token é obrigatório.' });
        }

        const sessionData = twoFACodes.get(token);

        if (!sessionData) {
            return res.status(401).json({ message: 'Sessão expirada. Faça login novamente.' });
        }

        // Gera novo código e reseta contador
        const newCode = generate2FACode();
        sessionData.code = newCode;
        sessionData.attempts = 0;
        sessionData.expiresAt = Date.now() + (10 * 60 * 1000);

        try {
            const user = await User.findById(sessionData.userId);
            await send2FACode(sessionData.email, newCode, user?.name || 'Usuário');
        } catch (emailError) {
            console.error('[Resend] Falha ao reenviar:', emailError.message);
            if (process.env.NODE_ENV !== 'production') {
                console.log(`[2FA] Novo código: ${newCode}`);
            }
        }

        return res.json({
            message: 'Novo código enviado.',
            expiresIn: 600
        });

    } catch (err) {
        console.error('[Resend2FA] Erro:', err);
        return res.status(500).json({ message: 'Erro no servidor.' });
    }
};
