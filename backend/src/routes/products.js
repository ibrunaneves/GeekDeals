import express from 'express';
import {
    createProduct,
    listProducts,
    getProduct,
    updateProduct,
    deleteProduct
} from '../controllers/productController.js';

import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas as rotas de produto exigem usuário autenticado
router.use(authMiddleware);
router.get('/', listProducts);
router.post('/', createProduct);
router.get('/:id', getProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
