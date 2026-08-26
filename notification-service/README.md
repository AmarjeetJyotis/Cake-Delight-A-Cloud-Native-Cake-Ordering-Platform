# 🔔 Notification Microservice

### Cloud Native Microservices Capstone Project

**Author:** Amarjeet Kumar

The Notification Microservice is responsible for processing order confirmation notifications in the Cake Delight application. It receives order completion events from the Order Microservice through **RabbitMQ**, stores notification information in **MySQL**, exposes notifications through REST APIs, and attempts to send order confirmation emails.

Built with **Node.js, Express.js, Sequelize, MySQL, RabbitMQ, and Nodemailer**.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Microservice Communication](#microservice-communication)
- [Project Structure](#project-structure)
- [Database](#database)
- [Notification Model](#notification-model)
- [RabbitMQ Event Handling](#rabbitmq-event-handling)
- [APIs](#apis)
- [API Gateway Routes](#api-gateway-routes)
- [Email Notification](#email-notification)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Testing the APIs](#testing-the-apis)
- [Docker](#docker)
- [Kubernetes](#kubernetes)
- [End-to-End Notification Flow](#end-to-end-notification-flow)
- [Fault Tolerance & Logging](#fault-tolerance--logging)
- [Capstone Requirement Mapping](#capstone-requirement-mapping)
- [Current Status](#current-status)
- [Author](#author)

---

## Overview

The Notification Microservice performs the following responsibilities:

- Listen for order completion events
- Receive order information from RabbitMQ
- Create order confirmation notifications
- Store notification history in MySQL
- Provide REST APIs to retrieve and delete notifications
- Send order confirmation emails
- Provide a health check endpoint

---

## Tech Stack

- Node.js
- Express.js
- MySQL
- Sequelize ORM
- RabbitMQ
- Nodemailer
- dotenv
- CORS
- Helmet
- Morgan
- Docker
- Kubernetes

---

## Microservice Communication

The Notification Microservice uses **RabbitMQ** for asynchronous communication with the Order Microservice, so the Order Microservice can complete an order without depending directly on the Notification Microservice.

```text
Order Microservice
       |
       | Order Completed Event
       v
    RabbitMQ
       |
       v
Notification Microservice
       |
       +------------------+
       |                  |
       v                  v
   MySQL Database      Email Service
```

---

## Project Structure

```text
notification-service/
│
├── src/
│   │
│   ├── config/
│   │   └── database.js
│   │
│   ├── controllers/
│   │   └── notificationController.js
│   │
│   ├── messaging/
│   │   └── rabbitmq.js
│   │
│   ├── models/
│   │   └── Notification.js
│   │
│   ├── routes/
│   │   ├── notificationRoutes.js
│   │   └── healthRoutes.js
│   │
│   ├── services/
│   │   ├── emailService.js
│   │   └── notificationService.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── .env.example
├── .gitignore
├── Dockerfile
├── package.json
├── package-lock.json
└── README.md
```

---

## Database

- **Database name:** `notification_db`
- **Table:** `notifications`

### Table Structure

| Column | Description |
|---|---|
| id | Unique notification ID |
| orderId | ID of the completed order |
| customerName | Customer name |
| message | Order confirmation message |
| status | Notification status |
| createdAt | Notification creation time |

The database schema is also available at `database/schema/notification.sql`.

---

## Notification Model

Managed using Sequelize ORM, with fields:

- `id`
- `orderId`
- `customerName`
- `message`
- `status`
- `createdAt`

---

## RabbitMQ Event Handling

The Notification Microservice listens for the order completion event published by the Order Microservice.

**Example event payload:**

```json
{
  "orderId": 1,
  "customerName": "Amarjeet Kumar",
  "customerEmail": "customer@example.com",
  "deliveryAddress": "Noida UP",
  "totalAmount": 998,
  "items": [],
  "message": "Your cake order has been placed successfully."
}
```

**After receiving the event, the service:**

1. Receives the order completion event.
2. Creates a notification record.
3. Stores the notification in MySQL.
4. Attempts to send an order confirmation email.
5. Makes the notification available through the REST API.

---

## APIs

### 1. Health Check

```
GET /health
```

Checks whether the Notification Microservice is running.

### 2. Create Notification

```
POST /notifications
```

**Example request:**

```json
{
  "orderId": 1,
  "customerName": "Amarjeet Kumar",
  "message": "Your cake order has been placed successfully."
}
```

### 3. Get All Notifications

```
GET /notifications
```

Returns the stored notification records.

### 4. Delete Notification

```
DELETE /notifications/:id
```

Example: `DELETE /notifications/1`

### API Summary

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Service health check |
| POST | `/notifications` | Create a notification |
| GET | `/notifications` | Get all notifications |
| DELETE | `/notifications/:id` | Delete a notification |

---

## API Gateway Routes

When the complete Cake Delight application is running, the frontend accesses the Notification Microservice through the **API Gateway** (`http://localhost:5000`) rather than hitting port 5004 directly:

| Method | Endpoint |
|---|---|
| GET | `/notifications` |
| POST | `/notifications` |
| DELETE | `/notifications/:id` |

---

## Email Notification

The service uses **Nodemailer** to send order confirmation emails, configured through environment variables:

```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_SECURE=true
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM=your-email@gmail.com
```

The email feature is triggered after an order completion event is received.

> **Note:** Email delivery depends on the network and SMTP access available in the environment — the service *attempts* to send the email rather than guaranteeing delivery, since SMTP connectivity can vary by environment (e.g., local machine vs. Azure/Linux hosting).

---

## Environment Variables

**Example configuration:**

```env
PORT=5004

DB_HOST=localhost
DB_PORT=3306
DB_NAME=notification_db
DB_USER=root
DB_PASSWORD=your-password

RABBITMQ_URL=amqp://admin:admin123@localhost:5672

MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_SECURE=true
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM=your-email@gmail.com
```

When running inside Docker Compose, container service names are used instead:

```env
DB_HOST=mysql
RABBITMQ_URL=amqp://admin:admin123@rabbitmq:5672
```

> ⚠️ **Never commit real credentials.** Keep actual mail/DB passwords only in your local `.env` file (not tracked in git) — use placeholder values in `.env.example` and in this README.

---

## Running Locally

```bash
# Install dependencies
npm install

# Start in development mode
npm run dev

# Or start normally
npm start
```

The service runs at: `http://localhost:5004`

---

## Testing the APIs

The APIs can be tested using Postman or another API testing tool.

```bash
# Health check
GET http://localhost:5004/health

# Create notification
POST http://localhost:5004/notifications
{
  "orderId": 1,
  "customerName": "Amarjeet Kumar",
  "message": "Your cake order has been placed successfully."
}

# Get notifications
GET http://localhost:5004/notifications

# Delete notification
DELETE http://localhost:5004/notifications/1
```

---

## Docker

The Notification Microservice contains its own `Dockerfile`.

Start the complete application from the project root:

```bash
docker compose -f docker/docker-compose.yml up --build -d
```

Check running containers:

```bash
docker ps
```

Check Notification Service logs:

```bash
docker logs cake-delight-notification --tail 100
```

### Docker Service Configuration

Inside Docker Compose, the Notification Microservice communicates with:

| Dependency | Address |
|---|---|
| MySQL | `mysql:3306` |
| RabbitMQ | `rabbitmq:5672` |

Exposed on: `5004:5004`

---

## Kubernetes

Configuration: `kubernetes/notification-service.yaml`

```bash
# Apply all Kubernetes resources from the project root
kubectl apply -f kubernetes/

# Check the pod
kubectl get pods -n cake-delight

# Check the service
kubectl get service notification-service -n cake-delight

# View logs
kubectl logs deployment/notification-service -n cake-delight
```

---

## End-to-End Notification Flow

```text
Customer
   |
   v
Cake Delight Frontend
   |
   v
API Gateway
   |
   v
Order Microservice
   |
   | Create Order
   |
   v
Order Completed Event
   |
   v
RabbitMQ
   |
   v
Notification Microservice
   |
   +----------------------+
   |                      |
   v                      v
MySQL                 Email Service
   |
   v
Notification API
   |
   v
Frontend Notifications
```

---

## Fault Tolerance & Logging

The service includes:

- RabbitMQ-based asynchronous communication
- Database persistence
- Health check endpoint
- Console logging
- HTTP request logging using Morgan
- Error handling for notification processing
- Error handling for email sending

Because it's packaged as an independent microservice, it can be restarted on its own without affecting the rest of the application.

---

## Capstone Requirement Mapping

| Capstone Requirement | Implementation |
|---|---|
| Notification Microservice | Implemented |
| REST APIs | Express.js REST APIs |
| Database Persistence | MySQL |
| Database ORM | Sequelize |
| Event-driven communication | RabbitMQ |
| Order completion event | Implemented |
| Order confirmation notification | Implemented |
| Email notification | Nodemailer |
| Docker | Dockerfile and Docker Compose |
| Kubernetes | Kubernetes deployment |
| Health Check | `/health` |
| Logging | Morgan and service logs |
| Independent Service | Separate Notification Microservice |

---

## Current Status

The Notification Microservice is implemented as part of the Cake Delight Cloud Native Microservices Capstone Project.

**Implemented functionality:**

- Order completion event consumption
- RabbitMQ integration
- Notification creation, persistence, retrieval, and deletion
- Email notification processing
- MySQL integration
- REST APIs
- Health check
- Docker support
- Kubernetes deployment support

---

## Author

**Amarjeet Kumar**

Project: *Cake Delight*
Capstone: *Cloud Native Microservices Engineering Capstone Project*