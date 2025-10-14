# Order Management API

REST API for managing clients, warehouses, products, and delivery orders with role-based authentication.

## Features

- **JWT Authentication** with roles (ADMIN, ANALYST)
- **Complete CRUD** for all entities
- **Stock validations** for orders
- **Role-based access control**
- **Logical deletion** of products

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file with the following variables:

```env
DATABASE_URL=your_supabase_database_url
JWT_SECRET=your_very_secure_jwt_secret
JWT_EXPIRES=8h
PORT=3005
```

## Usage

```bash
npm run dev
```

The server will run on `http://localhost:3005`

## Endpoints

### Authentication (Public)

#### POST `/api/auth/register`
Register new user
```json
{
  "name": "John Doe",
  "email": "john@email.com",
  "password": "123456",
  "role": "ADMIN"
}
```

#### POST `/api/auth/login`
Login
```json
{
  "email": "john@email.com",
  "password": "123456"
}
```

### Clients

#### GET `/api/clients` (ADMIN/ANALYST)
List all clients

#### POST `/api/clients/search` (ADMIN/ANALYST)
Search client by ID number
```json
{
  "cedula": "12345678"
}
```

#### POST `/api/clients` (ADMIN)
Create new client
```json
{
  "cedula": "12345678",
  "name": "Jane Smith",
  "email": "jane@email.com"
}
```

#### PUT `/api/clients/:id` (ADMIN)
Update client

#### DELETE `/api/clients/:id` (ADMIN)
Delete client

### Warehouses

#### GET `/api/warehouses/active` (ADMIN/ANALYST)
List active warehouses with stock

#### GET `/api/warehouses/all` (ADMIN/ANALYST)
List all warehouses

#### POST `/api/warehouses` (ADMIN)
Create new warehouse
```json
{
  "name": "Central Warehouse",
  "location": "Bogotá"
}
```

#### PATCH `/api/warehouses/:id/status` (ADMIN)
Activate/deactivate warehouse
```json
{
  "is_active": false
}
```

### Products

#### GET `/api/products/sku/:sku` (Public)
Get product by SKU code

#### GET `/api/products/active` (ADMIN/ANALYST)
List active products

#### POST `/api/products` (ADMIN)
Create product
```json
{
  "sku": "PROD001",
  "name": "Dell Laptop",
  "price": 1500000
}
```

#### DELETE `/api/products/:id` (ADMIN)
Delete product (logically)

### Orders

#### POST `/api/orders` (ADMIN/ANALYST)
Create new order
```json
{
  "client_id": 1,
  "address_id": 1,
  "warehouse_id": 1,
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    }
  ]
}
```

#### PATCH `/api/orders/:id/status` (ANALYST/ADMIN)
Change order status
```json
{
  "status": "EN_TRANSITO"
}
```

#### GET `/api/orders/history` (ADMIN/ANALYST)
All orders history

#### GET `/api/orders/active` (ADMIN/ANALYST)
Active orders (pending and in transit)

#### GET `/api/orders/client/:client_id` (ADMIN/ANALYST)
Orders by client

## Authentication

Include the JWT token in the header:
```
Authorization: Bearer your_jwt_token
```

## Roles

- **ADMIN**: Full access to all CRUD operations
- **ANALYST**: Only queries and order status updates

## Validations

- Cannot create an order without sufficient stock
- Cannot register clients with duplicate ID numbers
- Cannot register products with duplicate SKU
- Orders can only have states: PENDIENTE, EN_TRANSITO, ENTREGADA

## Database

Run the `seed.sql` script to create tables and test data.

## Project Structure

```
src/
├── controllers/     # Business logic
├── models/         # Sequelize models
├── routes/         # Route definitions
├── middlewares/    # Authentication middlewares
└── config/         # Database configuration
```

## Testing

```bash
npm test              # Run tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

## Available Scripts

```bash
npm run dev          # Development server
npm run build        # Build TypeScript
npm start            # Production server
npm test             # Run tests
```

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Programming language
- **Sequelize** - ORM for database
- **PostgreSQL** - Database (Supabase)
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Jest** - Testing framework