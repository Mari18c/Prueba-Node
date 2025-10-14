import { Router } from 'express';
import { verifyToken } from '../controllers/auth.controller.js';
import { requireAdminOrAnalyst, requireAnalyst } from '../middlewares/auth.middleware.js';
import {
  createOrder,
  updateOrderStatus,
  getOrderHistory,
  getOrdersByClient,
  getActiveOrders
} from '../controllers/order.controller.simple.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Rutas para ADMIN y ANALYST
router.post('/', requireAdminOrAnalyst, createOrder);
router.get('/history', requireAdminOrAnalyst, getOrderHistory);
router.get('/active', requireAdminOrAnalyst, getActiveOrders);
router.get('/client/:client_id', requireAdminOrAnalyst, getOrdersByClient);

// Ruta para cambiar estado (ANALYST puede cambiar estado de órdenes)
router.patch('/:id/status', requireAnalyst, updateOrderStatus);

export default router;
