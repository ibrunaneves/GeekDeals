/**
 * Modelo de Produto/Oferta
 * type pode ser: game, hardware, collectible, accessory
 * expiryDate é quando a oferta expira
 */

import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    expiryDate: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Product', ProductSchema);
