import { Router } from 'express';
import authRoutes from './auth.routes.js';
import clientRoutes from './client.routes.js';
import warehouseRoutes from './warehouse.routes.js';
import productRoutes from './product.routes.js';
import orderRoutes from './order.routes.js';

const router = Router();

// Rutas principales
router.use('/auth', authRoutes);
router.use('/clients', clientRoutes);
router.use('/warehouses', warehouseRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);

// Ruta de salud
router.get('/health', (req, res) => {
  res.status(200).json({ message: 'API funcionando correctamente' });
});

export default router;
