import type { Request, Response, NextFunction } from 'express';

// Extender el tipo Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: 'ADMIN' | 'ANALYST';
      };
    }
  }
}

// Middleware para verificar que el usuario es ADMIN
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: 'Token requerido' });
  }

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de ADMIN' });
  }

  next();
}

// Middleware para verificar que el usuario es ADMIN o ANALYST
export function requireAdminOrAnalyst(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: 'Token requerido' });
  }

  if (req.user.role !== 'ADMIN' && req.user.role !== 'ANALYST') {
    return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de ADMIN o ANALYST' });
  }

  next();
}

// Middleware para verificar que el usuario es ANALYST (solo para consultas)
export function requireAnalyst(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: 'Token requerido' });
  }

  if (req.user.role !== 'ANALYST' && req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de ANALYST o ADMIN' });
  }

  next();
}
