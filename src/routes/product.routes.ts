import { Router } from 'express';
import { verifyToken } from '../controllers/auth.controller.js';
import { requireAdminOrAnalyst, requireAdmin } from '../middlewares/auth.middleware.js';
import {
  getProductBySku,
  getActiveProducts,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller.simple.js';

const router = Router();

// Ruta pública para consultar producto por SKU
router.get('/sku/:sku', getProductBySku);

// Todas las demás rutas requieren autenticación
router.use(verifyToken);

// Rutas para ADMIN y ANALYST
router.get('/active', requireAdminOrAnalyst, getActiveProducts);
router.get('/all', requireAdminOrAnalyst, getAllProducts);

// Rutas solo para ADMIN
router.post('/', requireAdmin, createProduct);
router.put('/:id', requireAdmin, updateProduct);
router.delete('/:id', requireAdmin, deleteProduct);

export default router;
