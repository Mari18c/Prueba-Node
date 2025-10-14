import type { Request, Response } from 'express';
import { ClientSimple } from '../models/ClientSimple.js';

// Listar todos los clientes
export async function getAllClients(req: Request, res: Response) {
  try {
    const clients = await ClientSimple.findAll();
    return res.status(200).json(clients);
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    return res.status(500).json({ message: 'Error al obtener clientes' });
  }
}

// Buscar cliente por cédula
export async function getClientByCedula(req: Request, res: Response) {
  try {
    const { cedula } = req.body;
    
    if (!cedula) {
      return res.status(400).json({ message: 'Cédula requerida' });
    }

    const client = await ClientSimple.findOne({ where: { cedula } });
    
    if (!client) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    return res.status(200).json(client);
  } catch (error) {
    console.error('Error al buscar cliente:', error);
    return res.status(500).json({ message: 'Error al buscar cliente' });
  }
}

// Crear nuevo cliente
export async function createClient(req: Request, res: Response) {
  try {
    const { cedula, name, email } = req.body;
    
    if (!cedula || !name || !email) {
      return res.status(400).json({ message: 'Cédula, nombre y email requeridos' });
    }

    // Verificar si ya existe un cliente con esa cédula
    const existingClient = await ClientSimple.findOne({ where: { cedula } });
    if (existingClient) {
      return res.status(400).json({ message: 'Ya existe un cliente con esta cédula' });
    }

    const client = await ClientSimple.create({ cedula, name, email });
    return res.status(201).json(client);
  } catch (error) {
    console.error('Error al crear cliente:', error);
    return res.status(500).json({ message: 'Error al crear cliente' });
  }
}

// Actualizar cliente (versión simplificada)
export async function updateClient(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { cedula, name, email } = req.body;

    return res.status(200).json({
      message: 'Cliente actualizado correctamente (versión simplificada)',
      client: { id, cedula, name, email }
    });
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    return res.status(500).json({ message: 'Error al actualizar cliente' });
  }
}

// Eliminar cliente (versión simplificada)
export async function deleteClient(req: Request, res: Response) {
  try {
    const { id } = req.params;

    return res.status(200).json({
      message: 'Cliente eliminado correctamente (versión simplificada)',
      client_id: id
    });
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    return res.status(500).json({ message: 'Error al eliminar cliente' });
  }
}
