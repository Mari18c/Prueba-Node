import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { UserSimple } from '../models/UserSimple.js';
import { ClientSimple } from '../models/ClientSimple.js';
import { ProductSimple } from '../models/ProductSimple.js';
import { WarehouseSimple } from '../models/WarehouseSimple.js';
import { WarehouseStockSimple } from '../models/WarehouseStockSimple.js';
import { OrderSimple } from '../models/OrderSimple.js';
import { OrderItemSimple } from '../models/OrderItemSimple.js';

dotenv.config();

export const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
});

//Connect DataBase
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    
    // Inicializar modelos
    UserSimple.initialize(sequelize);
    ClientSimple.initialize(sequelize);
    ProductSimple.initialize(sequelize);
    WarehouseSimple.initialize(sequelize);
    WarehouseStockSimple.initialize(sequelize);
    OrderSimple.initialize(sequelize);
    OrderItemSimple.initialize(sequelize);
    
    await sequelize.sync({ force: false });
  } catch (error) {
    console.error('Error al conectar a Supabase:', error);
  }
};