import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: 'Token não fornecido.' });
        }
        const [bearer, token] = authHeader.split(' ');

        if (bearer !== 'Bearer' || !token) {
            return res.status(401).json({ message: 'Token inválido.' });
        }
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(payload.sub).select('-passwordHash');

        if (!user) {
            return res.status(401).json({ message: 'Usuário não encontrado.' });
        }

        req.user = user;
        next();

    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: 'Não autorizado.' });
    }
};
