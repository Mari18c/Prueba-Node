import { Router } from 'express';
import { register, login } from '../controllers/auth.controller.js';

const router = Router();

// Rutas de autenticación (públicas)
router.post('/register', register);
router.post('/login', login);

export default router;
