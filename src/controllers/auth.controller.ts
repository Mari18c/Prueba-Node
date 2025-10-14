import type { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserSimple } from '../models/index.js';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecreto_fhl';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '8h';

// Middleware para verificar token
export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Token requerido' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
}

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Faltan datos requeridos' });
    }

    const existing = await UserSimple.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Email ya registrado' });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await UserSimple.create({ 
      name, 
      email, 
      password: hash, 
      role: role || 'ANALYST' 
    });
    
    return res.status(201).json({ 
      id: user.id, 
      name: user.name,
      email: user.email, 
      role: user.role 
    });
  } catch (err) {
    console.error('Error en registro:', err);
    return res.status(500).json({ message: 'Error al registrar usuario' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña requeridos' });
    }

    const user = await UserSimple.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const payload = { id: user.id, email: user.email, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES } as jwt.SignOptions);

    return res.status(200).json({ 
      token, 
      user: { 
        id: user.id, 
        name: user.name,
        email: user.email, 
        role: user.role 
      } 
    });
  } catch (err) {
    console.error('Error en login:', err);
    return res.status(500).json({ message: 'Error en login' });
  }
}
