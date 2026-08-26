# 🍰 Cake Delight — Frontend

### Cloud Native Microservices Capstone Project

**Author:** Amarjeet Kumar

Cake Delight is the frontend application of the Cloud Native Microservices Engineering Capstone Project. It provides a simple, responsive web interface for browsing cakes, searching and filtering products, managing the shopping basket, completing checkout, submitting ratings and reviews, and viewing order notifications.

Built with **HTML, CSS, and JavaScript**, and communicates with the backend exclusively through the **API Gateway**.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Frontend Features](#frontend-features)
- [Backend Communication](#backend-communication)
- [Main API Operations](#main-api-operations)
- [Project Structure](#project-structure)
- [Running Locally](#running-locally)
- [Running with Docker](#running-with-docker)
- [Running with Kubernetes](#running-with-kubernetes)
- [Application Architecture](#application-architecture)
- [End-to-End User Flow](#end-to-end-user-flow)
- [Full Project Layout](#full-project-layout)
- [Application Access](#application-access)
- [Status](#status)
- [Author](#author)

---

## Tech Stack

- HTML5
- CSS3
- JavaScript
- Fetch API
- Docker
- Nginx

---

## Frontend Features

### 1. Add New Cake

Users can add a new cake to the catalog with:

- Cake Name
- Description
- Category
- Price
- Availability

The request is sent through the API Gateway to the Cake Catalog Microservice.

### 2. Search and Filter Cakes

Users can search and filter cakes by:

- Cake Name
- Category
- Minimum Price
- Maximum Price

The frontend sends the search request to the API Gateway, which forwards it to the Cake Catalog Microservice.

### 3. Available Cakes

The frontend displays available cakes with:

- Cake Name, Category, Description, Price, Availability
- **Add to Basket** button
- **Delete Cake** button

### 4. Shopping Basket

Users can:

- Add cakes to the basket
- View basket items, quantities, item totals, and the grand total
- Remove or update basket items
- Proceed to checkout

Basket operations are handled by the Order Microservice through the API Gateway.

### 5. Checkout

Users provide customer information before placing an order:

- Customer Name
- Customer Email
- Delivery Address
- Order Items
- Order Total

**After successful checkout:**

1. The order is created by the Order Microservice.
2. The basket is cleared.
3. An order completion event is published.
4. The Notification Microservice receives the event.
5. An order confirmation notification is created.
6. The notification is displayed in the frontend.
7. An email notification is attempted by the Notification Microservice.

### 6. Cake Ratings and Reviews

Users can submit ratings and reviews with:

- Cake ID
- Customer Name
- Rating (1–5)
- Review

Users can also view the **average rating** and **customer reviews**. Rating data is stored and managed by the Rating Microservice.

### 7. Notifications

Users can:

- Refresh notifications
- View order confirmation notifications and customer info
- View notification status
- Remove notifications

Notifications are received from the Notification Microservice through the API Gateway.

### 8. Responsive User Interface

The layout adjusts automatically across desktops, laptops, tablets, and mobile devices.

---

## Backend Communication

The frontend does **not** communicate directly with individual backend microservices. All requests go through the **API Gateway**.

```text
                    Cake Delight Frontend
                            |
                            | HTTP Requests
                            v
                     API Gateway
                       :5000
                            |
          +-----------------+-----------------+
          |                 |                 |
          v                 v                 v
      Catalog             Order             Rating
       :5001              :5002              :5003
          |                 |                 |
          v                 v                 v
   cake_catalog_db       order_db          rating_db
                            |
                            |
                            | RabbitMQ Event
                            v
                    Notification Service
                           :5004
                            |
                            v
                    notification_db
```

Default API Gateway URL during local Docker execution: `http://localhost:5000`. The frontend never exposes individual microservice URLs to the user.

---

## Main API Operations

### Cake Catalog

| Method | Endpoint |
|---|---|
| GET | `/catalog/cakes` |
| GET | `/catalog/cakes/:id` |
| POST | `/catalog/cakes` |
| DELETE | `/catalog/cakes/:id` |

Filtering via query parameters:

```
/catalog/cakes?name=Chocolate
/catalog/cakes?category=Chocolate
/catalog/cakes?minPrice=300&maxPrice=800
```

### Order and Basket

| Method | Endpoint |
|---|---|
| POST | `/orders/basket` |
| GET | `/orders/basket` |
| PUT | `/orders/basket/:id` |
| DELETE | `/orders/basket/:id` |
| POST | `/orders/checkout` |

### Ratings

| Method | Endpoint |
|---|---|
| POST | `/ratings` |
| GET | `/ratings/:cakeId` |
| GET | `/ratings/:cakeId/average` |

### Notifications

| Method | Endpoint |
|---|---|
| GET | `/notifications` |
| DELETE | `/notifications/:id` |

---

## Project Structure

```text
frontend/
│
├── css/
│   └── style.css
│
├── js/
│   └── app.js
│
├── Dockerfile
├── index.html
└── README.md
```

---

## Running Locally

If the backend services are running locally, the frontend can be opened through a web server. For the complete Docker-based application, use the project-level Docker Compose configuration.

From the project root:

```bash
docker compose -f docker/docker-compose.yml up --build -d
```

Once the containers are up, open: `http://localhost:8080`

---

## Running with Docker

The frontend has its own `Dockerfile` and is packaged as a container using **Nginx**.

The Docker Compose configuration builds the frontend alongside:

- API Gateway
- Cake Catalog Service
- Order Service
- Rating Service
- Notification Service
- MySQL
- RabbitMQ

| | |
|---|---|
| Container port | 80 |
| Host port | 8080 |

Access at: `http://localhost:8080`

---

## Running with Kubernetes

Kubernetes configuration: `../kubernetes/frontend.yaml`

The frontend is deployed as a Kubernetes workload and exposed through the frontend service.

```bash
# Deploy from the project root
kubectl apply -f kubernetes/

# Check the deployment
kubectl get pods -n cake-delight

# Check the service
kubectl get services -n cake-delight
```

For local testing, use port forwarding:

```bash
kubectl port-forward service/frontend 8080:80 -n cake-delight
```

Then open: `http://localhost:8080`

---

## Application Architecture

The frontend follows the client-to-gateway architecture used across Cake Delight — **all requests pass through the API Gateway**, which is the single entry point to every backend service.

```text
User
 |
 v
Cake Delight Frontend
 |
 v
API Gateway
 |
 +----> Cake Catalog Service ----> cake_catalog_db
 |
 +----> Order Service -----------> order_db
 |              |
 |              v
 |           RabbitMQ
 |              |
 |              v
 +----> Notification Service ---> notification_db
 |
 +----> Rating Service ---------> rating_db
```

---

## End-to-End User Flow

```text
Browse Cakes
     |
     v
Search / Filter Cakes
     |
     v
Add Cake to Basket
     |
     v
Review Basket
     |
     v
Enter Customer Information
     |
     v
Checkout
     |
     v
Order Created
     |
     v
Order Completion Event
     |
     v
RabbitMQ
     |
     v
Notification Service
     |
     +----> Notification Stored
     |
     +----> Email Notification
     |
     v
Notification Displayed in Frontend
```

Users can then submit ratings and reviews for cakes.

---

## Full Project Layout

The frontend is one part of the complete Cake Delight application:

```text
Cake Delight
│
├── api-gateway/
├── cake-catalog-service/
├── order-service/
├── rating-service/
├── notification-service/
├── frontend/
├── database/
├── docker/
└── kubernetes/
```

---

## Application Access

### Docker

| Component | URL |
|---|---|
| Frontend | `http://localhost:8080` |
| API Gateway | `http://localhost:5000` |

### Kubernetes

```bash
kubectl port-forward service/frontend 8080:80 -n cake-delight
```

Then: `http://localhost:8080`

---

## Status

The Cake Delight frontend implements the required customer-facing functionality for the Cloud Native Microservices Engineering Capstone Project.

**Implemented features:**

- Responsive frontend
- Cake catalog browsing, search, and filtering
- Add / delete cake
- Shopping basket and basket management
- Checkout and order creation
- Cake ratings, customer reviews, and average rating
- Order notifications
- Docker-based execution
- Kubernetes deployment support
- API Gateway integration

---

## Author

**Amarjeet Kumar**

Project: *Cake Delight — Cloud Native Microservices Engineering Capstone Project*