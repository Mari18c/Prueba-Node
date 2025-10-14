import { Request, Response } from 'express';

// Mock de UserSimple
const mockUserSimple = {
  findOne: jest.fn(),
  create: jest.fn()
};

// Mock de bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn()
}));

// Mock de jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn()
}));

// Mock del modelo UserSimple
jest.mock('../models/index.js', () => ({
  UserSimple: mockUserSimple
}));

// Importar después de los mocks
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { register, login, verifyToken } from '../controllers/auth.controller.js';

const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

describe('Auth Controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockReq = {
      body: {},
      headers: {},
      user: undefined
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('debería registrar un usuario exitosamente', async () => {
      // Arrange
      mockReq.body = {
        name: 'Juan Pérez',
        email: 'juan@test.com',
        password: '123456',
        role: 'ADMIN'
      };

      const hashedPassword = 'hashed_password_123';
      const createdUser = {
        id: 1,
        name: 'Juan Pérez',
        email: 'juan@test.com',
        role: 'ADMIN'
      };

      mockUserSimple.findOne.mockResolvedValue(null);
      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never);
      mockUserSimple.create.mockResolvedValue(createdUser as any);

      // Act
      await register(mockReq as Request, mockRes as Response);

      // Assert
      expect(mockUserSimple.findOne).toHaveBeenCalledWith({ where: { email: 'juan@test.com' } });
      expect(mockedBcrypt.hash).toHaveBeenCalledWith('123456', 10);
      expect(mockUserSimple.create).toHaveBeenCalledWith({
        name: 'Juan Pérez',
        email: 'juan@test.com',
        password: hashedPassword,
        role: 'ADMIN'
      });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        id: 1,
        name: 'Juan Pérez',
        email: 'juan@test.com',
        role: 'ADMIN'
      });
    });

    it('debería retornar error si faltan datos requeridos', async () => {
      // Arrange
      mockReq.body = {
        name: 'Juan Pérez',
        // email y password faltantes
      };

      // Act
      await register(mockReq as Request, mockRes as Response);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Faltan datos requeridos' });
    });

    it('debería retornar error si el email ya existe', async () => {
      // Arrange
      mockReq.body = {
        name: 'Juan Pérez',
        email: 'juan@test.com',
        password: '123456'
      };

      const existingUser = { id: 1, email: 'juan@test.com' };
      mockUserSimple.findOne.mockResolvedValue(existingUser as any);

      // Act
      await register(mockReq as Request, mockRes as Response);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Email ya registrado' });
    });
  });

  describe('login', () => {
    it('debería hacer login exitosamente', async () => {
      // Arrange
      mockReq.body = {
        email: 'juan@test.com',
        password: '123456'
      };

      const user = {
        id: 1,
        name: 'Juan Pérez',
        email: 'juan@test.com',
        password: 'hashed_password',
        role: 'ADMIN'
      };

      const token = 'jwt_token_123';

      mockUserSimple.findOne.mockResolvedValue(user as any);
      mockedBcrypt.compare.mockResolvedValue(true as never);
      mockedJwt.sign.mockReturnValue(token as any);

      // Act
      await login(mockReq as Request, mockRes as Response);

      // Assert
      expect(mockUserSimple.findOne).toHaveBeenCalledWith({ where: { email: 'juan@test.com' } });
      expect(mockedBcrypt.compare).toHaveBeenCalledWith('123456', 'hashed_password');
      expect(mockedJwt.sign).toHaveBeenCalledWith(
        { id: 1, email: 'juan@test.com', role: 'ADMIN' },
        'supersecreto_fhl',
        { expiresIn: '8h' }
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        token,
        user: {
          id: 1,
          name: 'Juan Pérez',
          email: 'juan@test.com',
          role: 'ADMIN'
        }
      });
    });

    it('debería retornar error si las credenciales son inválidas', async () => {
      // Arrange
      mockReq.body = {
        email: 'juan@test.com',
        password: '123456'
      };

      mockUserSimple.findOne.mockResolvedValue(null);

      // Act
      await login(mockReq as Request, mockRes as Response);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Credenciales inválidas' });
    });
  });

  describe('verifyToken', () => {
    it('debería verificar token válido', () => {
      // Arrange
      mockReq.headers = {
        authorization: 'Bearer valid_token_123'
      };

      const decodedToken = { id: 1, email: 'juan@test.com', role: 'ADMIN' };
      mockedJwt.verify.mockReturnValue(decodedToken as any);

      // Act
      verifyToken(mockReq as Request, mockRes as Response, mockNext);

      // Assert
      expect(mockedJwt.verify).toHaveBeenCalledWith('valid_token_123', 'supersecreto_fhl');
      expect(mockReq.user).toEqual(decodedToken);
      expect(mockNext).toHaveBeenCalled();
    });

    it('debería retornar error si no hay token', () => {
      // Arrange
      mockReq.headers = {};

      // Act
      verifyToken(mockReq as Request, mockRes as Response, mockNext);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Token requerido' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('debería retornar error si el token es inválido', () => {
      // Arrange
      mockReq.headers = {
        authorization: 'Bearer invalid_token'
      };

      mockedJwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      // Act
      verifyToken(mockReq as Request, mockRes as Response, mockNext);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Token inválido' });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
