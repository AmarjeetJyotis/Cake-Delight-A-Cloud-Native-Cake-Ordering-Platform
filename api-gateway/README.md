# API Gateway — Cake Delight

The **API Gateway** is the single entry point for all client requests in the **Cake Delight** microservices application. It routes incoming requests to the appropriate backend microservice, so the frontend never needs to know the individual service URLs.

It communicates with the following microservices:

- Cake Catalog Service
- Order Service
- Rating Service
- Notification Service

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Service Communication](#service-communication)
- [Running Locally](#running-locally)
- [Running with Docker](#running-with-docker)
- [Running with Docker Compose](#running-with-docker-compose)
- [Kubernetes](#kubernetes)
- [Error Handling & Logs](#error-handling--logs)
- [Architecture Role](#architecture-role)
- [Related Services](#related-services)
- [End-to-End Flow](#end-to-end-flow)
- [Health Check](#health-check)
- [Author](#author)

---

## Features

- Routes requests to the Cake Catalog Service
- Routes requests to the Order Service
- Routes requests to the Rating Service
- Routes requests to the Notification Service
- Provides a centralized access point for all backend services
- Provides health check functionality
- Uses environment variables for service configuration
- Supports Docker-based execution

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | Web framework |
| http-proxy-middleware | Request routing/proxying |
| CORS | Cross-origin request handling |
| Helmet | Security headers |
| Morgan | Request logging |
| Docker | Containerized execution |

---

## Project Structure

```text
api-gateway/
│
├── src/
│   ├── config/
│   │   └── gatewayConfig.js
│   │
│   ├── routes/
│   │   └── gatewayRoutes.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── .gitignore
├── Dockerfile
├── package.json
├── package-lock.json
└── README.md
```

---

## Installation

1. Navigate to the API Gateway directory:
   ```bash
   cd api-gateway
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

---

## Environment Variables

Create a `.env` file in the `api-gateway` directory.

### Local Environment

```env
PORT=5000

CATALOG_SERVICE=http://localhost:5001
ORDER_SERVICE=http://localhost:5002
RATING_SERVICE=http://localhost:5003
NOTIFICATION_SERVICE=http://localhost:5004
```

### Docker Environment

When the service runs inside Docker Compose, container service names are used instead of `localhost`:

```env
PORT=5000

CATALOG_SERVICE=http://catalog-service:5001
ORDER_SERVICE=http://order-service:5002
RATING_SERVICE=http://rating-service:5003
NOTIFICATION_SERVICE=http://notification-service:5004
```

> The Docker Compose configuration supplies these values automatically.

---

## API Endpoints

All routes below are exposed by the Gateway to the frontend.

### 1. Health Check

| Method | Endpoint |
|---|---|
| GET | `/health` |

Example: `http://localhost:5000/health`

### 2. Cake Catalog APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/catalog/cakes` | Get all cakes |
| GET | `/catalog/cakes/:id` | Get a cake by ID |
| POST | `/catalog/cakes` | Add a new cake |
| DELETE | `/catalog/cakes/:id` | Delete a cake |

**Filtering** (via query parameters):

```
GET /catalog/cakes?name=Chocolate
GET /catalog/cakes?category=Chocolate
GET /catalog/cakes?minPrice=300&maxPrice=800
```

Supported filters: name, category, minimum price, maximum price.

### 3. Order APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/orders/basket` | Add item to basket |
| GET | `/orders/basket` | View basket |
| PUT | `/orders/basket/:id` | Update basket item |
| DELETE | `/orders/basket/:id` | Remove basket item |
| POST | `/orders/checkout` | Checkout |

> Checkout creates the order and publishes an order-completion event through RabbitMQ.

### 4. Rating APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/ratings` | Submit a rating |
| GET | `/ratings/:cakeId` | Get ratings for a cake |
| GET | `/ratings/:cakeId/average` | Get average rating |

### 5. Notification APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/notifications` | Create a notification |
| GET | `/notifications` | Get notifications |

> The Notification Service also receives order-completion events through RabbitMQ.

---

## Service Communication

The API Gateway communicates with backend services using HTTP REST APIs.

```
                    ┌──────────────────────┐
                    │      Frontend        │
                    │  HTML/CSS/JavaScript │
                    └──────────┬───────────┘
                               │
                               │ HTTP
                               ▼
                    ┌──────────────────────┐
                    │     API Gateway      │
                    │      Port 5000       │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
       ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
       │   Catalog   │  │    Order    │  │   Rating    │
       │   Service   │  │   Service   │  │   Service   │
       │   :5001     │  │   :5002     │  │   :5003     │
       └─────────────┘  └──────┬──────┘  └─────────────┘
                               │
                               │ RabbitMQ
                               ▼
                       ┌─────────────────┐
                       │  Notification   │
                       │    Service      │
                       │     :5004       │
                       └─────────────────┘
```

---

## Running Locally

Start the development server:

```bash
npm run dev
```

Or start the production server:

```bash
npm start
```

The API Gateway runs at: `http://localhost:5000`

---

## Running with Docker

Build the image:

```bash
docker build -t cake-delight-gateway ./api-gateway
```

Run the container:

```bash
docker run -p 5000:5000 cake-delight-gateway
```

---

## Running with Docker Compose

For the complete Cake Delight application, run Docker Compose from the project root:

```bash
docker compose -f docker/docker-compose.yml up --build -d
```

Check running containers:

```bash
docker ps
```

- API Gateway: `http://localhost:5000`
- Frontend: `http://localhost:8080`

---

## Kubernetes

The API Gateway is also deployed as part of the Cake Delight Kubernetes environment.

Configuration file: `kubernetes/api-gateway.yaml`

Apply the configuration from the project root:

```bash
kubectl apply -f kubernetes/
```

Useful checks:

```bash
kubectl get service api-gateway -n cake-delight
kubectl get deployment api-gateway -n cake-delight
kubectl get pods -n cake-delight
```

The API Gateway is exposed through a Kubernetes Service.

---

## Error Handling & Logs

The API Gateway forwards requests to the appropriate microservice and returns the response to the client. Service communication errors are handled through the gateway and proxy middleware.

View application logs with:

```bash
docker logs cake-delight-gateway
```

---

## Architecture Role

The API Gateway provides a single entry point for the frontend and hides internal service addresses.

**Without the Gateway**, the frontend would talk to every service directly:

```
Frontend
   │
   ├── Catalog Service
   ├── Order Service
   ├── Rating Service
   └── Notification Service
```

**With the Gateway**, all traffic is centralized:

```
Frontend
    │
    ▼
API Gateway
    │
    ├── Catalog Service
    ├── Order Service
    ├── Rating Service
    └── Notification Service
```

This supports loose coupling between the frontend and backend services.

---

## Related Services

| Service | Port | Responsibility |
|---|---|---|
| API Gateway | 5000 | Central API entry point |
| Cake Catalog Service | 5001 | Cake catalog management |
| Order Service | 5002 | Basket and order management |
| Rating Service | 5003 | Cake ratings and reviews |
| Notification Service | 5004 | Order notifications |
| MySQL | 3306 | Persistent database |
| RabbitMQ | 5672 | Event/message broker |

---

## End-to-End Flow

```
Browse Cakes
     │
     ▼
Filter Cakes
     │
     ▼
Add Cake To Basket
     │
     ▼
View / Update / Remove Basket Items
     │
     ▼
Checkout
     │
     ▼
Order Created
     │
     ▼
Order Completion Event
     │
     ▼
RabbitMQ
     │
     ▼
Notification Service
     │
     ▼
Order Confirmation Notification
```

---

## Health Check

```bash
curl http://localhost:5000/health
```

---

## Author

**Amarjeet Kumar**
Project: *Cake Delight — Cloud-Native Microservices Capstone Project*