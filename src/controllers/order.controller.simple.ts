import type { Request, Response } from 'express';
import { OrderSimple } from '../models/OrderSimple.js';
import { OrderItemSimple } from '../models/OrderItemSimple.js';
import { ClientSimple } from '../models/ClientSimple.js';
import { WarehouseSimple } from '../models/WarehouseSimple.js';
import { ProductSimple } from '../models/ProductSimple.js';
import { WarehouseStockSimple } from '../models/WarehouseStockSimple.js';

// Crear nueva orden
export async function createOrder(req: Request, res: Response) {
  try {
    const { client_id, warehouse_id, items } = req.body;
    
    if (!client_id || !warehouse_id || !items || !Array.isArray(items)) {
      return res.status(400).json({ 
        message: 'client_id, warehouse_id e items son requeridos' 
      });
    }

    // Verificar que el cliente existe
    const client = await ClientSimple.findByPk(client_id);
    if (!client) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    // Verificar que la bodega existe y está activa
    const warehouse = await WarehouseSimple.findOne({ 
      where: { id: warehouse_id, is_active: true } 
    });
    if (!warehouse) {
      return res.status(404).json({ message: 'Bodega no encontrada o inactiva' });
    }

    // Verificar stock para cada item
    for (const item of items) {
      const { product_id, quantity } = item;
      
      if (!product_id || !quantity || quantity <= 0) {
        return res.status(400).json({ message: 'Cada item debe tener product_id y quantity válidos' });
      }

      const stock = await WarehouseStockSimple.findOne({
        where: { warehouse_id, product_id }
      });

      if (!stock || stock.quantity < quantity) {
        return res.status(400).json({ 
          message: `Stock insuficiente para el producto ${product_id} en la bodega ${warehouse_id}` 
        });
      }
    }

    // Generar número de orden único
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Crear la orden
    const order = await OrderSimple.create({
      order_number: orderNumber,
      client_id,
      warehouse_id,
      status: 'PENDIENTE'
    });

    // Crear items de la orden y actualizar stock
    for (const item of items) {
      const { product_id, quantity } = item;
      
      const product = await ProductSimple.findByPk(product_id);
      if (!product) {
        return res.status(404).json({ message: `Producto ${product_id} no encontrado` });
      }

      // Crear item de la orden
      await OrderItemSimple.create({
        order_id: order.id,
        product_id,
        quantity,
        price: product.price
      });

      // Actualizar stock
      const stock = await WarehouseStockSimple.findOne({
        where: { warehouse_id, product_id }
      });
      await stock!.update({ quantity: stock!.quantity - quantity });
    }

    return res.status(201).json({
      message: 'Orden creada correctamente',
      order: {
        id: order.id,
        order_number: order.order_number,
        client_id: order.client_id,
        warehouse_id: order.warehouse_id,
        status: order.status,
        items
      }
    });
  } catch (error) {
    console.error('Error al crear orden:', error);
    return res.status(500).json({ message: 'Error al crear orden' });
  }
}

// Cambiar estado de orden
export async function updateOrderStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['PENDIENTE', 'EN_TRANSITO', 'ENTREGADA'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Estado inválido. Debe ser: PENDIENTE, EN_TRANSITO o ENTREGADA' 
      });
    }

    const order = await OrderSimple.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    await order.update({ status });
    
    return res.status(200).json({
      message: 'Estado de orden actualizado correctamente',
      order
    });
  } catch (error) {
    console.error('Error al actualizar estado de orden:', error);
    return res.status(500).json({ message: 'Error al actualizar estado de orden' });
  }
}

// Obtener historial de todas las órdenes
export async function getOrderHistory(req: Request, res: Response) {
  try {
    const orders = await OrderSimple.findAll({
      order: [['id', 'DESC']]
    });
    
    return res.status(200).json(orders);
  } catch (error) {
    console.error('Error al obtener historial de órdenes:', error);
    return res.status(500).json({ message: 'Error al obtener historial de órdenes' });
  }
}

// Obtener órdenes por cliente
export async function getOrdersByClient(req: Request, res: Response) {
  try {
    const { client_id } = req.params;

    const orders = await OrderSimple.findAll({
      where: { client_id },
      order: [['id', 'DESC']]
    });
    
    return res.status(200).json(orders);
  } catch (error) {
    console.error('Error al obtener órdenes del cliente:', error);
    return res.status(500).json({ message: 'Error al obtener órdenes del cliente' });
  }
}

// Obtener órdenes activas
export async function getActiveOrders(req: Request, res: Response) {
  try {
    const orders = await OrderSimple.findAll({
      where: {
        status: ['PENDIENTE', 'EN_TRANSITO']
      },
      order: [['id', 'DESC']]
    });
    
    return res.status(200).json(orders);
  } catch (error) {
    console.error('Error al obtener órdenes activas:', error);
    return res.status(500).json({ message: 'Error al obtener órdenes activas' });
  }
}
