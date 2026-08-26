# 🛒 Order Microservice

The **Order Microservice** manages the shopping basket and order process for the Cake Delight application. It allows users to add cakes to a basket, manage basket contents, and check out to create an order.

Built with **Node.js, Express.js, Sequelize, and MySQL**.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database](#database)
- [APIs](#apis)
- [API Summary](#api-summary)
- [Running Locally](#running-locally)
- [Testing the APIs](#testing-the-apis)
- [Features Completed](#features-completed)
- [Current Status](#current-status)

---

## Overview

This service allows users to:

- Add cakes to the basket
- View all basket items
- Update basket quantity
- Remove basket items
- Checkout the basket
- Create an order with the total amount

---

## Tech Stack

- Node.js
- Express.js
- MySQL
- Sequelize ORM
- dotenv
- CORS
- Helmet
- Morgan

---

## Project Structure

```text
order-service/
│
├── src/
│   │
│   ├── config/
│   │   └── database.js
│   │
│   ├── controllers/
│   │   └── orderController.js
│   │
│   ├── models/
│   │   ├── BasketItem.js
│   │   └── Order.js
│   │
│   ├── routes/
│   │   ├── orderRoutes.js
│   │   └── healthRoutes.js
│   │
│   ├── services/
│   │   └── orderService.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── Dockerfile
├── package.json
└── README.md
```

---

## Database

**Database name:** `order_db`

**Tables:** `basket_items`, `orders`

### basket_items

| Column | Description |
|---|---|
| id | Basket item ID |
| cakeId | Cake ID |
| cakeName | Cake name |
| price | Cake price |
| quantity | Quantity |
| totalPrice | Total price |

### orders

| Column | Description |
|---|---|
| id | Order ID |
| totalAmount | Total order amount |
| status | Order status |
| createdAt | Order date and time |

---

## APIs

### 1. Health Check

```
GET /health
```

Checks whether the service is running.

### 2. Add Cake to Basket

```
POST /basket
```

**Example request:**

```json
{
  "cakeId": 1,
  "cakeName": "Black Forest",
  "price": 350,
  "quantity": 3
}
```

### 3. View Basket

```
GET /basket
```

Returns all basket items.

### 4. Update Basket Item

```
PUT /basket/:id
```

Updates the quantity of a basket item.

Example: `PUT /basket/1`

**Request body:**

```json
{
  "quantity": 5
}
```

### 5. Remove Basket Item

```
DELETE /basket/:id
```

Deletes a basket item.

Example: `DELETE /basket/1`

### 6. Checkout Order

```
POST /orders/checkout
```

Creates a new order from the basket.

**Response includes:**

- Order ID
- Total amount
- Order status
- Created time

---

## API Summary

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Service health check |
| POST | `/basket` | Add cake to basket |
| GET | `/basket` | View basket items |
| PUT | `/basket/:id` | Update basket item quantity |
| DELETE | `/basket/:id` | Remove basket item |
| POST | `/orders/checkout` | Checkout and create order |

> **Worth double-checking:** every basket route above sits directly under `/basket`, while checkout is the only one prefixed with `/orders`. If your `orderRoutes.js` actually mounts checkout at `/checkout` (matching the `/basket` pattern) rather than `/orders/checkout`, update this table and the examples below to match — it's easy for the Gateway's `/orders/checkout` prefix to get copied into the service-level docs by mistake.

---

## Running Locally

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The service runs at: `http://localhost:5002`

---

## Testing the APIs

```bash
# Health check
GET http://localhost:5002/health

# Add to basket
POST http://localhost:5002/basket

# View basket
GET http://localhost:5002/basket

# Update basket item
PUT http://localhost:5002/basket/1

# Delete basket item
DELETE http://localhost:5002/basket/1

# Checkout
POST http://localhost:5002/orders/checkout
```

---

## Features Completed

- Add cake to basket
- View basket items
- Update basket quantity
- Remove basket item
- Checkout order
- Order creation
- MySQL database integration
- REST APIs
- Health check API

---

## Current Status

The Order Microservice has been completed successfully.

**Implemented functionality:**

- Shopping basket management
- Order checkout
- Order creation
- MySQL database integration
- REST API development

This service is ready for integration with the remaining microservices in the Cake Delight application.