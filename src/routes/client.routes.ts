import { Router } from 'express';
import { verifyToken } from '../controllers/auth.controller.js';
import { requireAdminOrAnalyst, requireAdmin } from '../middlewares/auth.middleware.js';
import {
  getAllClients,
  getClientByCedula,
  createClient,
  updateClient,
  deleteClient
} from '../controllers/client.controller.simple.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Rutas para ADMIN y ANALYST
router.get('/', requireAdminOrAnalyst, getAllClients);
router.post('/search', requireAdminOrAnalyst, getClientByCedula);

// Rutas solo para ADMIN
router.post('/', requireAdmin, createClient);
router.put('/:id', requireAdmin, updateClient);
router.delete('/:id', requireAdmin, deleteClient);

export default router;
