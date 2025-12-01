import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';
dotenv.config();

const signJwt = (userId) => {
    return jwt.sign(
        { sub: userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION || '1h' }
    );
};

export const register = async (req, res) => {
    try {
        const { name, cpf, email, password } = req.body;

        if (!name || !cpf || !email || !password) {
            return res.status(400).json({ message: 'Campos obrigatórios ausentes.' });
        }

        const existing = await User.findOne({ $or: [{ email }, { cpf }] });
        if (existing) {
            return res.status(409).json({ message: 'Email ou CPF já registrados.' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = new User({ name, cpf, email, passwordHash });
        await user.save();

        return res.status(201).json({
            id: user._id,
            name: user.name,
            email: user.email
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro no servidor.' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Credenciais inválidas.' });

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(401).json({ message: 'Credenciais inválidas.' });

        // POR ENQUANTO: retorno JWT direto
        // Depois Ithalo vai transformar isso em 2FA
        const token = signJwt(user._id);

        return res.json({ accessToken: token });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro no servidor.' });
    }
};
