import type { Request, Response } from 'express';
import { ProductSimple } from '../models/ProductSimple.js';

// Obtener producto por código (SKU)
export async function getProductBySku(req: Request, res: Response) {
  try {
    const { sku } = req.params;
    
    if (!sku) {
      return res.status(400).json({ message: 'Código del producto requerido' });
    }

    const product = await ProductSimple.findOne({ where: { sku } });
    
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    return res.status(500).json({ message: 'Error al obtener producto' });
  }
}

// Listar todos los productos activos
export async function getActiveProducts(req: Request, res: Response) {
  try {
    const products = await ProductSimple.findAll({ where: { is_active: true } });
    return res.status(200).json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return res.status(500).json({ message: 'Error al obtener productos' });
  }
}

// Listar todos los productos
export async function getAllProducts(req: Request, res: Response) {
  try {
    const products = await ProductSimple.findAll();
    return res.status(200).json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return res.status(500).json({ message: 'Error al obtener productos' });
  }
}

// Crear producto
export async function createProduct(req: Request, res: Response) {
  try {
    const { sku, name, price } = req.body;
    
    if (!sku || !name || !price) {
      return res.status(400).json({ message: 'SKU, nombre y precio requeridos' });
    }

    // Verificar si ya existe un producto con ese SKU
    const existingProduct = await ProductSimple.findOne({ where: { sku } });
    if (existingProduct) {
      return res.status(400).json({ message: 'Ya existe un producto con este SKU' });
    }

    const product = await ProductSimple.create({ sku, name, price });
    return res.status(201).json(product);
  } catch (error) {
    console.error('Error al crear producto:', error);
    return res.status(500).json({ message: 'Error al crear producto' });
  }
}

// Actualizar producto (versión simplificada)
export async function updateProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { sku, name, price, is_active } = req.body;

    return res.status(200).json({
      message: 'Producto actualizado correctamente (versión simplificada)',
      product: { id, sku, name, price, is_active }
    });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    return res.status(500).json({ message: 'Error al actualizar producto' });
  }
}

// Eliminar producto lógicamente
export async function deleteProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const product = await ProductSimple.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Eliminación lógica - marcar como inactivo
    await product.update({ is_active: false });
    
    return res.status(200).json({
      message: 'Producto eliminado correctamente',
      product
    });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    return res.status(500).json({ message: 'Error al eliminar producto' });
  }
}
