import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    cpf: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    twoFaSecret: { type: String, default: null },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', UserSchema);
