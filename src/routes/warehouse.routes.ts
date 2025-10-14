import { Router } from 'express';
import { verifyToken } from '../controllers/auth.controller.js';
import { requireAdminOrAnalyst, requireAdmin } from '../middlewares/auth.middleware.js';
import {
  getActiveWarehouses,
  getAllWarehouses,
  toggleWarehouseStatus,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse
} from '../controllers/warehouse.controller.simple.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Rutas para ADMIN y ANALYST
router.get('/active', requireAdminOrAnalyst, getActiveWarehouses);
router.get('/all', requireAdminOrAnalyst, getAllWarehouses);

// Rutas solo para ADMIN
router.post('/', requireAdmin, createWarehouse);
router.put('/:id', requireAdmin, updateWarehouse);
router.patch('/:id/status', requireAdmin, toggleWarehouseStatus);
router.delete('/:id', requireAdmin, deleteWarehouse);

export default router;