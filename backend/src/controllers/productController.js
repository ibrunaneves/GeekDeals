import Product from '../models/Product.js';

export const createProduct = async (req, res) => {
    try {
        const { name, price, type, description, expiryDate } = req.body;

        if (!name || price == null || !type || !description || !expiryDate) {
            return res.status(400).json({ message: 'Campos obrigatórios faltando.' });
        }

        const product = new Product({
            name,
            price,
            type,
            description,
            expiryDate
        });

        await product.save();

        return res.status(201).json(product);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro interno no servidor.' });
    }
};

export const listProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        return res.json(products);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro interno no servidor.' });
    }
};

export const getProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado.' });
        }

        return res.json(product);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro interno no servidor.' });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const updated = await Product.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: 'Produto não encontrado.' });
        }

        return res.json(updated);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro interno no servidor.' });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await Product.findByIdAndDelete(id);
        return res.status(204).send(); // Sem conteúdo
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro interno no servidor.' });
    }
};
