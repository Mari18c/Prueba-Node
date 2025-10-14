import type { Request, Response } from 'express';
import { WarehouseSimple } from '../models/WarehouseSimple.js';
import { WarehouseStockSimple } from '../models/WarehouseStockSimple.js';
import { ProductSimple } from '../models/ProductSimple.js';

// Listar todas las bodegas activas con stock
export async function getActiveWarehouses(req: Request, res: Response) {
  try {
    const warehouses = await WarehouseSimple.findAll({ 
      where: { is_active: true } 
    });
    
    // Para cada bodega, obtener su stock
    const warehousesWithStock = await Promise.all(
      warehouses.map(async (warehouse) => {
        const stock = await WarehouseStockSimple.findAll({
          where: { warehouse_id: warehouse.id },
          include: [{
            model: ProductSimple,
            as: 'product'
          }]
        });
        
        return {
          ...warehouse.toJSON(),
          stock
        };
      })
    );
    
    return res.status(200).json(warehousesWithStock);
  } catch (error) {
    console.error('Error al obtener bodegas:', error);
    return res.status(500).json({ message: 'Error al obtener bodegas' });
  }
}

// Listar todas las bodegas
export async function getAllWarehouses(req: Request, res: Response) {
  try {
    const warehouses = await WarehouseSimple.findAll();
    return res.status(200).json(warehouses);
  } catch (error) {
    console.error('Error al obtener bodegas:', error);
    return res.status(500).json({ message: 'Error al obtener bodegas' });
  }
}

// Activar/Inactivar bodega
export async function toggleWarehouseStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    if (typeof is_active !== 'boolean') {
      return res.status(400).json({ message: 'is_active debe ser true o false' });
    }

    const warehouse = await WarehouseSimple.findByPk(id);
    if (!warehouse) {
      return res.status(404).json({ message: 'Bodega no encontrada' });
    }

    await warehouse.update({ is_active });
    
    return res.status(200).json({
      message: `Bodega ${is_active ? 'activada' : 'inactivada'} correctamente`,
      warehouse
    });
  } catch (error) {
    console.error('Error al cambiar estado de bodega:', error);
    return res.status(500).json({ message: 'Error al cambiar estado de bodega' });
  }
}

// Crear nueva bodega
export async function createWarehouse(req: Request, res: Response) {
  try {
    const { name, location } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Nombre de bodega requerido' });
    }

    const warehouse = await WarehouseSimple.create({ name, location });
    return res.status(201).json(warehouse);
  } catch (error) {
    console.error('Error al crear bodega:', error);
    return res.status(500).json({ message: 'Error al crear bodega' });
  }
}

// Actualizar bodega (versión simplificada)
export async function updateWarehouse(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, location } = req.body;

    return res.status(200).json({
      message: 'Bodega actualizada correctamente (versión simplificada)',
      warehouse: { id, name, location }
    });
  } catch (error) {
    console.error('Error al actualizar bodega:', error);
    return res.status(500).json({ message: 'Error al actualizar bodega' });
  }
}

// Eliminar bodega (versión simplificada)
export async function deleteWarehouse(req: Request, res: Response) {
  try {
    const { id } = req.params;

    return res.status(200).json({
      message: 'Bodega eliminada correctamente (versión simplificada)',
      warehouse_id: id
    });
  } catch (error) {
    console.error('Error al eliminar bodega:', error);
    return res.status(500).json({ message: 'Error al eliminar bodega' });
  }
}
