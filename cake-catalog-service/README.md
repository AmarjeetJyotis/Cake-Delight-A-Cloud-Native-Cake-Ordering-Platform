# Cake Catalog Microservice

The **Cake Catalog Microservice** manages cake product information for the **Cake Delight** cloud-native microservices application. It maintains the cake catalog data and exposes REST APIs consumed by the frontend through the API Gateway.

Built with **Node.js, Express.js, Sequelize ORM, and MySQL**.

---

## Table of Contents

- [Overview](#overview)
- [Responsibilities](#responsibilities)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Application Architecture](#application-architecture)
- [Database](#database)
- [REST API Endpoints](#rest-api-endpoints)
- [API Summary](#api-summary)
- [Environment Variables](#environment-variables)
- [Database Connection & Sync](#database-connection--sync)
- [Sample Cake Data](#sample-cake-data)
- [Running Locally](#running-locally)
- [Local API Testing](#local-api-testing)
- [Docker](#docker)
- [Docker Compose](#docker-compose)
- [Kubernetes](#kubernetes)
- [API Gateway Integration](#api-gateway-integration)
- [Error Handling](#error-handling)
- [Health Check](#health-check)
- [Cloud-Native Role](#cloud-native-role)
- [Complete Cake Catalog Flow](#complete-cake-catalog-flow)
- [Integration With Other Microservices](#integration-with-other-microservices)
- [Project Status](#project-status)
- [Author](#author)

---

## Overview

The service supports:

- Adding cakes
- Browsing cakes
- Viewing individual cake details
- Filtering cakes by name, category, minimum price, and maximum price
- Deleting cakes
- Health checking
- MySQL database persistence

---

## Responsibilities

The Cake Catalog Microservice owns the **cake catalog business capability**. It manages:

| Field | Description |
|---|---|
| Cake ID | Unique identifier |
| Name | Cake name |
| Description | Cake description |
| Category | Cake category |
| Price | Cake price |
| Availability | Whether the cake is available |
| Image reference | Optional image reference |

The service maintains its own database table and exposes REST APIs for other application components.

---

## Tech Stack

- Node.js
- Express.js
- Sequelize ORM
- MySQL
- dotenv
- CORS
- Helmet
- Morgan
- Docker
- Kubernetes

---

## Project Structure

```text
cake-catalog-service/
│
├── src/
│   │
│   ├── config/
│   │   └── database.js
│   │
│   ├── controllers/
│   │   └── cakeController.js
│   │
│   ├── models/
│   │   └── Cake.js
│   │
│   ├── routes/
│   │   ├── cakeRoutes.js
│   │   └── healthRoutes.js
│   │
│   ├── services/
│   │   └── cakeService.js
│   │
│   ├── app.js
│   ├── seedCakes.js
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

## Application Architecture

The service follows a layered structure:

```
Client / API Gateway
        │
        ▼
     Routes
        │
        ▼
   Controller
        │
        ▼
    Service
        │
        ▼
      Model
        │
        ▼
      MySQL
```

| Layer | Responsibility |
|---|---|
| Routes | Defines the REST API endpoints |
| Controllers | Handles HTTP requests and responses |
| Services | Contains the business logic for cake operations |
| Models | Defines the Cake database model using Sequelize |
| Config | Handles the MySQL connection |

---

## Database

The Cake Catalog Service uses MySQL for persistent storage.

- **Database name:** `cake_catalog_db`
- **Table name:** `cakes`

### Cake Table Structure

| Column | Type | Description |
|---|---|---|
| id | INTEGER | Unique cake ID (auto-increment primary key) |
| name | VARCHAR | Cake name |
| description | TEXT | Cake description |
| category | VARCHAR | Cake category |
| price | DECIMAL | Cake price |
| availability | BOOLEAN | Cake availability status |
| imageReference | VARCHAR | Optional image reference |

---

## REST API Endpoints

### 1. Health Check

```
GET /health
```

Checks whether the Cake Catalog Service is running.

Example: `http://localhost:5001/health`

### 2. Add Cake

```
POST /cakes
```

**Example Request**

```json
{
  "name": "Chocolate Truffle Cake",
  "description": "Rich chocolate cake with creamy truffle layers",
  "category": "Chocolate",
  "price": 799,
  "availability": true
}
```

**Example Response**

```json
{
  "success": true,
  "message": "Cake added successfully",
  "data": {
    "id": 1,
    "name": "Chocolate Truffle Cake",
    "description": "Rich chocolate cake with creamy truffle layers",
    "category": "Chocolate",
    "price": "799.00",
    "availability": true
  }
}
```

### 3. Get All Cakes

```
GET /cakes
```

Example: `http://localhost:5001/cakes`

### 4. Get Cake By ID

```
GET /cakes/:id
```

Example: `GET /cakes/1`

If the cake does not exist, the service returns a `404` response.

### 5. Filter Cakes

Filtering is handled by the same `GET /cakes` endpoint using query parameters — **there is no separate `/cakes/filter` route.**

| Filter | Endpoint |
|---|---|
| By name (partial match) | `GET /cakes?name=Chocolate` |
| By category | `GET /cakes?category=Chocolate` |
| By minimum price | `GET /cakes?minPrice=500` |
| By maximum price | `GET /cakes?maxPrice=1000` |
| By price range | `GET /cakes?minPrice=500&maxPrice=1000` |

Filters can also be combined:

```
GET /cakes?name=Chocolate&category=Chocolate&minPrice=500&maxPrice=1000
```

### 6. Delete Cake

```
DELETE /cakes/:id
```

Example: `DELETE /cakes/1`

If the cake does not exist, the response is:

```json
{
  "success": false,
  "message": "Cake not found"
}
```

---

## API Summary

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Service health check |
| POST | `/cakes` | Add a cake |
| GET | `/cakes` | Get all cakes |
| GET | `/cakes/:id` | Get cake by ID |
| GET | `/cakes?name=...` | Filter by name |
| GET | `/cakes?category=...` | Filter by category |
| GET | `/cakes?minPrice=...` | Filter by minimum price |
| GET | `/cakes?maxPrice=...` | Filter by maximum price |
| GET | `/cakes?minPrice=...&maxPrice=...` | Filter by price range |
| DELETE | `/cakes/:id` | Delete a cake |

> **Note:** `GET /cakes/filter?category=...` is **not** a valid route. Filtering always goes through `GET /cakes` with query parameters, matching the actual `cakeRoutes.js` (`POST /`, `GET /`, `GET /:id`, `DELETE /:id`) and the controller's use of `req.query.name`, `req.query.category`, `req.query.minPrice`, and `req.query.maxPrice`.

---

## Environment Variables

The service uses environment variables for database configuration.

### Local

```env
PORT=5001

DB_HOST=localhost
DB_PORT=3306
DB_NAME=cake_catalog_db
DB_USER=root
DB_PASSWORD=your_password
```

### Docker

```env
DB_HOST=mysql
DB_PORT=3306
```

> The Docker Compose configuration provides these values to the container automatically.

---

## Database Connection & Sync

The service uses Sequelize ORM to connect to MySQL. Configuration lives at `src/config/database.js`, and the connection is verified during startup.

**Startup flow:**

```
Start Service
     │
     ▼
Connect to MySQL
     │
     ▼
Authenticate Database
     │
     ▼
Synchronize Tables
     │
     ▼
Start Express Server
```

During startup, Sequelize checks and synchronizes the required database tables — creating the `cakes` table if it doesn't already exist.

---

## Sample Cake Data

`src/seedCakes.js` provides sample cake data when the catalog is empty. The seed process checks whether cake data already exists before inserting sample records, preventing duplicates on repeated service starts.

---

## Running Locally

1. Navigate to the service directory:
   ```bash
   cd cake-catalog-service
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start in development mode:
   ```bash
   npm run dev
   ```
   Or start normally:
   ```bash
   npm start
   ```

The service runs at: `http://localhost:5001`

---

## Local API Testing

```bash
# Health check
curl http://localhost:5001/health

# Get all cakes
curl http://localhost:5001/cakes

# Get a specific cake
curl http://localhost:5001/cakes/1

# Filter by name
curl "http://localhost:5001/cakes?name=Chocolate"

# Filter by category
curl "http://localhost:5001/cakes?category=Chocolate"

# Filter by price range
curl "http://localhost:5001/cakes?minPrice=500&maxPrice=1000"
```

---

## Docker

Build the image (from the project root):

```bash
docker build -t cake-delight-catalog ./cake-catalog-service
```

Run the container:

```bash
docker run -p 5001:5001 cake-delight-catalog
```

> For normal application execution, use Docker Compose instead — this service depends on MySQL and other components.

---

## Docker Compose

The Cake Catalog Service is included in the main Docker Compose configuration: `docker/docker-compose.yml`.

Start the complete application from the project root:

```bash
docker compose -f docker/docker-compose.yml up --build -d
```

Check running containers:

```bash
docker ps
```

The catalog service container is `cake-delight-catalog`. View its logs:

```bash
docker logs cake-delight-catalog
```

### Docker Service Communication

- Inside Docker Compose, the Catalog Service connects to MySQL using `mysql:3306`.
- The API Gateway communicates with the Catalog Service using `http://catalog-service:5001`.
- The frontend does **not** access the Catalog Service directly.

```
Frontend
    │
    ▼
API Gateway
    │
    ▼
Cake Catalog Service
    │
    ▼
MySQL
```

---

## Kubernetes

Configuration file: `kubernetes/cake-catalog.yaml`

Apply from the project root:

```bash
kubectl apply -f kubernetes/
```

Namespace: `cake-delight`

```bash
kubectl get pods -n cake-delight
kubectl get deployment cake-catalog -n cake-delight
kubectl get service catalog-service -n cake-delight
```

### Kubernetes Service Communication

Inside Kubernetes, the Catalog Service is accessed by other services as a ClusterIP service using `catalog-service:5001`. The API Gateway communicates with it using `http://catalog-service:5001`.

### Kubernetes Logs

```bash
kubectl logs deployment/cake-catalog -n cake-delight
kubectl describe deployment cake-catalog -n cake-delight
```

---

## API Gateway Integration

The Cake Catalog Service is accessed by the frontend through the API Gateway.

```
                    Frontend
                       │
                       ▼
                 API Gateway
                   Port 5000
                       │
                       ▼
              Catalog Service
                   Port 5001
                       │
                       ▼
                    MySQL
```

The API Gateway exposes catalog requests under `/catalog/cakes`:

```
GET    /catalog/cakes
GET    /catalog/cakes/:id
POST   /catalog/cakes
DELETE /catalog/cakes/:id
```

These are forwarded to `http://catalog-service:5001/cakes`.

---

## Error Handling

**Cake not found** — `404 Not Found`:

```json
{
  "success": false,
  "message": "Cake not found"
}
```

**Server error** — unexpected errors return an HTTP `500` response.

---

## Health Check

```
GET /health
```

Used to verify the Catalog Service is running, and to support monitoring in containerized or orchestrated environments.

---

## Cloud-Native Role

The Cake Catalog Microservice demonstrates:

- Independent microservice design
- REST API communication
- Database-backed persistence
- Docker containerization
- Kubernetes deployment
- Environment-based configuration
- Service-to-service communication
- Health checking
- Layered application structure

---

## Complete Cake Catalog Flow

```
User
 │
 ▼
Frontend
 │
 ▼
API Gateway
 │
 ▼
Cake Catalog Service
 │
 ├── Add Cake
 ├── Browse Cakes
 ├── View Cake
 ├── Filter Cakes
 └── Delete Cake
 │
 ▼
MySQL
```

---

## Integration With Other Microservices

The Cake Catalog Service provides cake information used by the Order Service during the customer ordering journey.

```
Browse Cakes
      │
      ▼
Filter Cakes
      │
      ▼
Select Cake
      │
      ▼
Add To Basket
      │
      ▼
Order Service
      │
      ▼
Checkout
      │
      ▼
Notification
```

---

## Project Status

The Cake Catalog Microservice implements the required catalog functionality for the Cake Delight Capstone Project.

**Implemented:**

- Cake product management (add, browse, view, delete)
- Filter by name, category, minimum price, maximum price, and price range
- MySQL persistence via Sequelize ORM
- REST API
- Health check
- Docker containerization & Docker Compose integration
- Kubernetes deployment
- API Gateway integration
- Sample data seeding

---

## Author

**Amarjeet Kumar**

| | |
|---|---|
| Project | Cake Delight |
| Project Type | Cloud-Native Microservices Capstone Project |
| Service | Cake Catalog Microservice |
| Backend | Node.js / Express.js |
| ORM | Sequelize |
| Database | MySQL |
| Containerization | Docker |
| Orchestration | Kubernetes |