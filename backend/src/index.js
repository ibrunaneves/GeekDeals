import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.get('/', (req, res) => {
    res.send('Geek Deals Platform API funcionando!');
});

app.use((err, req, res, next) => {
    console.error('Erro não tratado:', err);
    res.status(500).json({ message: 'Erro interno no servidor.' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
