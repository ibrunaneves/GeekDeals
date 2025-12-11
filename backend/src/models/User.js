/**
 * Modelo de Usuário
 * Campos básicos + hash da senha
 * O twoFaSecret não tá sendo usado ainda, deixamos pra caso queira TOTP depois
 */

import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    cpf: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    twoFaSecret: { type: String, default: null }, // reservado pra TOTP
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', UserSchema);
