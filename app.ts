import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, sequelize } from './src/config/db.js';
import routes from './src/routes/index.js';

dotenv.config();

const PORT = process.env.PORT || 3005;
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas de la API
app.use('/api', routes);

// Ruta raíz
app.get('/', (_req, res) => {
    res.json({ 
        message: 'API de Gestión de Órdenes',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            clients: '/api/clients',
            warehouses: '/api/warehouses',
            products: '/api/products',
            orders: '/api/orders'
        }
    });
});

// Inicializar base de datos
const initializeDatabase = async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
  }
};

initializeDatabase();

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});

export default app;