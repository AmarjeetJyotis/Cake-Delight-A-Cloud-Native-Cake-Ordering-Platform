# 🍰 Cake Delight
## Cloud-Native Microservices Engineering Capstone Project
Cake Delight is a cloud-native cake ordering platform built using a microservices architecture.
🛠️ Technology Stack
Technology	Usage
Node.js	Microservices development
Express.js	REST API implementation
MySQL	Relational database persistence
Sequelize	Database ORM
RabbitMQ	Event-driven messaging
HTML	Frontend structure
CSS	Frontend styling and responsive UI
JavaScript	Frontend functionality
Docker	Containerization
Docker Compose	Local multi-container execution
Kubernetes	Container orchestration
API Gateway	Single external API entry point
---
## ⚠️ IMPORTANT — Prerequisites & Quick Start (Read This First)
> **These commands were missing from the original README and are the most important steps to actually run the project — check them first, especially when demoing to a teacher/evaluator on a new machine.**
**Step 1 — Confirm Docker is installed:**
```powershell
docker --version
```
**Step 2 — Confirm the Docker daemon (Docker Desktop) is actually running:**
```powershell
docker info
```
> If this command errors out, Docker Desktop is not running — start it first, then retry.
**Step 3 — Build and start the application (detached mode):**
```powershell
docker compose -f docker/docker-compose.yml up --build -d
```
**Step 4 — Verify all containers are up:**
```powershell
docker ps
```
> You should see containers for the api-gateway, catalog-service, order-service, rating-service, notification-service, frontend, mysql, and rabbitmq.
**Step 5 — Open the application in your browser:**
```text
http://localhost:8080
```
**➡️ If any of the above steps fail, do not proceed to test the APIs — fix the failing step first.**
---
☸️ Kubernetes Quick Start
Kubernetes is part of the capstone deployment requirement. The project includes Kubernetes manifests in the `kubernetes/` directory.
Step 1 — Check Kubernetes
Make sure Docker Desktop Kubernetes (or another Kubernetes cluster) is running.
```powershell
kubectl version --client
kubectl get nodes
```
Step 2 — Deploy all Cake Delight resources
Run this command from the project root:
```powershell
kubectl apply -f kubernetes/
```
Step 3 — Use the project namespace
```powershell
kubectl config set-context --current --namespace=cake-delight
```
Step 4 — Verify the deployment
```powershell
kubectl get pods
kubectl get services
kubectl get deployments
kubectl get all
```
All application pods should reach `Running` status and deployments should show the required replicas as available.
Step 5 — Open the Kubernetes frontend
The current Kubernetes frontend NodePort is:
```text
http://localhost:31909
```
If NodePort access is not available in the current Kubernetes environment, use port forwarding instead:
```powershell
kubectl port-forward service/frontend 8080:80 -n cake-delight
```
Then open:
```text
http://localhost:8080
```
The API Gateway NodePort in the current configuration is:
```text
http://localhost:31002
```
> **Note:** Kubernetes NodePort numbers can be changed in the Kubernetes service manifest. Port forwarding is provided as a reliable alternative for local evaluation.
---
The application allows users to:
- Browse available cakes
- Search and filter cakes
- Add cakes to a shopping basket
- Update basket quantities
- Remove basket items
- Complete checkout
- Submit cake ratings and reviews
- View average ratings
- Delete reviews
- Receive order confirmation notifications
---
# 🏗️ Architecture
The project follows a microservices architecture with an API Gateway as the single external entry point.
```text
                         ┌─────────────────────┐
                         │   Frontend / User   │
                         │      Interface      │
                         └──────────┬──────────┘
                                    │
                                    │ HTTP
                                    ▼
                         ┌─────────────────────┐
                         │    API Gateway      │
                         │      Port 5000      │
                         └──────────┬──────────┘
                                    │
             ┌──────────────────────┼──────────────────────┐
             │                      │                      │
             ▼                      ▼                      ▼
     ┌───────────────┐      ┌───────────────┐      ┌───────────────┐
     │ Cake Catalog  │      │ Order Service │      │ Rating Service│
     │    :5001      │      │    :5002      │      │    :5003      │
     └───────────────┘      └───────┬───────┘      └───────────────┘
                                    │
                                    │ order.completed
                                    ▼
                             ┌───────────────┐
                             │   RabbitMQ    │
                             └───────┬───────┘
                                     │
                                     ▼
                             ┌───────────────┐
                             │ Notification  │
                             │    :5004      │
                             └───────────────┘
```
---
# 🔌 Service Ports
| Service | Port | Purpose |
|---|---:|---|
| API Gateway | `5000` | Single external API entry point |
| Cake Catalog Service | `5001` | Cake management |
| Order Service | `5002` | Basket and checkout |
| Rating Service | `5003` | Ratings and reviews |
| Notification Service | `5004` | Order notifications |
| Frontend | `8080` | Web application |
| RabbitMQ | `5672` | Event-driven messaging |
| RabbitMQ Management | `15672` | RabbitMQ management interface |
| MySQL | `3307` | Database access from host |
---
# 🌐 API Gateway
The API Gateway is the **single external entry point** for the application.
All external REST API requests should use:
```text
http://localhost:5000
```
The frontend communicates with the API Gateway instead of directly calling the internal microservices.
---
# 📡 Complete API List
## 1. API Gateway
### Health Check
```http
GET http://localhost:5000/health
```
Purpose:
Checks whether the API Gateway is running.
---
# 2. Cake Catalog Service
## Get All Cakes
```http
GET http://localhost:5000/catalog/cakes
```
Returns all cakes from the catalog.
---
## Add New Cake
```http
POST http://localhost:5000/catalog/cakes
```
### JSON Body
```json
{
  "name": "Black Forest Cake",
  "description": "Chocolate cake with cream",
  "category": "Chocolate",
  "price": 599,
  "availability": true
}
```
### Data Types
| Field | Type |
|---|---|
| `name` | String |
| `description` | String |
| `category` | String |
| `price` | Number |
| `availability` | Boolean |
---
## Search Cake by Name
```http
GET http://localhost:5000/catalog/cakes?name=Chocolate
```
Example:
```text
http://localhost:5000/catalog/cakes?name=Chocolate
```
---
## Filter Cakes by Category
```http
GET http://localhost:5000/catalog/cakes?category=Chocolate
```
Example:
```text
http://localhost:5000/catalog/cakes?category=Chocolate
```
---
## Filter Cakes by Price
```http
GET http://localhost:5000/catalog/cakes?minPrice=300&maxPrice=800
```
Example:
```text
http://localhost:5000/catalog/cakes?minPrice=300&maxPrice=800
```
---
## Delete Cake
```http
DELETE http://localhost:5000/catalog/cakes/{id}
```
Example:
```http
DELETE http://localhost:5000/catalog/cakes/1
```
---
# 3. Order / Basket Service
## Get Basket
```http
GET http://localhost:5000/orders/basket
```
Returns the current basket items.
---
## Add Cake to Basket
```http
POST http://localhost:5000/orders/basket
```
### JSON Body
```json
{
  "cakeId": 1,
  "cakeName": "Chocolate Truffle Cake",
  "price": 799,
  "quantity": 1
}
```
### Data Types
| Field | Type |
|---|---|
| `cakeId` | Number |
| `cakeName` | String |
| `price` | Number |
| `quantity` | Number |
---
## Update Basket Quantity
```http
PUT http://localhost:5000/orders/basket/{id}
```
Example:
```http
PUT http://localhost:5000/orders/basket/22
```
### JSON Body
```json
{
  "quantity": 2
}
```
---
## Remove Item from Basket
```http
DELETE http://localhost:5000/orders/basket/{id}
```
Example:
```http
DELETE http://localhost:5000/orders/basket/22
```
---
## Checkout
```http
POST http://localhost:5000/orders/checkout
```
### JSON Body
```json
{
  "customerName": "Amarjeet Kumar",
  "customerEmail": "amarjeet@example.com",
  "deliveryAddress": "Mohali, Punjab"
}
```
### Data Types
| Field | Type |
|---|---|
| `customerName` | String |
| `customerEmail` | String |
| `deliveryAddress` | String |
After successful checkout, the order service publishes the order completion event for the notification service.
---
# 4. Rating Service
## Submit Rating / Review
```http
POST http://localhost:5000/ratings
```
### JSON Body
```json
{
  "cakeId": 1,
  "userName": "Amarjeet Kumar",
  "rating": 5,
  "review": "Amazing experience"
}
```
### Data Types
| Field | Type |
|---|---|
| `cakeId` | Number |
| `userName` | String |
| `rating` | Number |
| `review` | String |
Rating value:
```text
1 - 5
```
---
## Get Ratings for a Cake
```http
GET http://localhost:5000/ratings/{cakeId}
```
Example:
```http
GET http://localhost:5000/ratings/1
```
Returns all ratings and reviews for the selected cake.
---
## Get Average Rating
```http
GET http://localhost:5000/ratings/{cakeId}/average
```
Example:
```http
GET http://localhost:5000/ratings/1/average
```
Returns the average rating for the selected cake.
---
## Delete Rating / Review
```http
DELETE http://localhost:5000/ratings/{ratingId}
```
Example:
```http
DELETE http://localhost:5000/ratings/10
```
---
# 5. Notification Service
## Get Notifications
```http
GET http://localhost:5000/notifications
```
Returns order confirmation notifications.
Notifications are generated through the event-driven communication between the Order Service, RabbitMQ and Notification Service.
Email Notification Note
The Notification Service supports email delivery through SMTP configuration. Actual email delivery depends on the execution environment allowing outbound SMTP connections. The application also stores the notification and displays the order confirmation notification through the application UI.
---
# 📋 Complete API Quick Reference
All APIs use:
```text
http://localhost:5000
```
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Gateway health |
| GET | `/catalog/cakes` | Get all cakes |
| POST | `/catalog/cakes` | Add cake |
| GET | `/catalog/cakes/{id}` | Cake Details  |
| DELETE | `/catalog/cakes/{id}` | Delete cake |
| GET | `/orders/basket` | Get basket |
| POST | `/orders/basket` | Add item to basket |
| PUT | `/orders/basket/{id}` | Update quantity |
| DELETE | `/orders/basket/{id}` | Remove basket item |
| POST | `/orders/checkout` | Checkout |
| GET | `/orders` | Check all order itesm |
| POST | `/ratings` | Submit rating |
| GET | `/ratings/{cakeId}` | Get cake ratings |
| GET | `/ratings/{cakeId}/average` | Get average rating |
| DELETE | `/ratings/{ratingId}` | Delete rating |
| GET | `/notifications` | Get notifications |
| POST | `/notifications` | Save Notification |
| DELETE | `/notifications/{id}` | Delete notifications |
**Total: 17 API routes**
---
🔄 End-to-End Application Flow
The complete customer journey is:
```text
Customer
   ↓
Frontend
   ↓
API Gateway
   ↓
Cake Catalog / Order / Rating Services
   ↓
Checkout
   ↓
Order Service creates the order
   ↓
RabbitMQ order.completed event
   ↓
Notification Service
   ↓
Order confirmation notification
```
The frontend supports browsing and filtering cakes, basket operations, checkout, ratings/reviews, and viewing order confirmation notifications.
---
🐇 Event-Driven Communication**
Cake Delight uses RabbitMQ for asynchronous communication.
The main event flow is:
```text
Customer
   │
   ▼
Frontend
   │
   ▼
API Gateway
   │
   ▼
Order Service
   │
   │ Order completed
   ▼
RabbitMQ
   │
   ▼
Notification Service
   │
   ▼
Order Confirmation Notification
```
The notification service consumes the order completion event and creates an order confirmation notification.
---
🗄️ Database Design
MySQL is used as the relational database. Each business microservice has its own database to keep service responsibilities separated.
Service	Database
Cake Catalog Service	`cake_catalog_db`
Order Service	`order_db`
Rating Service	`rating_db`
Notification Service	`notification_db`
The database initialization script is available under:
```text
database/init.sql
```
The application creates and synchronizes the required service tables when the services start.
---
🐳 Docker**
The project uses Docker containers for the microservices.
Main Docker services include:
```text
docker-api-gateway
docker-catalog-service
docker-order-service
docker-rating-service
docker-notification-service
docker-frontend
mysql
rabbitmq
```
---
# ☸️ Kubernetes
The application is deployed in Kubernetes under the namespace:
```text
cake-delight
```
Deploying to Kubernetes
From the project root:
```powershell
kubectl apply -f kubernetes/
```
Then verify:
```powershell
kubectl get pods -n cake-delight
kubectl get services -n cake-delight
kubectl get deployments -n cake-delight
kubectl get all -n cake-delight
```
### Kubernetes services
```text
api-gateway
catalog-service
order-service
rating-service
notification-service
frontend
mysql
rabbitmq
```
The frontend is exposed through a NodePort:
```text
http://localhost:31909
```
The API Gateway is exposed through:
```text
http://localhost:31002
```
When using the Docker Compose environment, the API Gateway is available directly at:
```text
http://localhost:5000
```
---
# 🖥️ Frontend
The Cake Delight frontend provides:
### Cake Catalog
- View available cakes
- Add new cakes
- Search cakes
- Filter by category
- Filter by price
- Delete cakes
### Shopping Basket
- Add cakes
- Increase quantity
- Decrease quantity
- Remove items
- View total price
- Enter customer information
- Place order
### Ratings
- Enter cake ID
- Enter customer name
- Select rating from 1–5
- Write review
- Submit rating
- View average rating
- View customer reviews
- Delete reviews
### Notifications
- Refresh notifications
- View order confirmation notifications
---
# 📁 Project Structure
```text
Cake-Delight-Capstone/
│
├── api-gateway/
│
├── cake-catalog-service/
│
├── order-service/
│
├── rating-service/
│
├── notification-service/
│
├── frontend/
│
├── database/
│
├── docker/
│
├── kubernetes/
│
├── .env
├── .env.example
├── package.json
├── package-lock.json
└── README.md
```
---
# 🚀 Running the Application with Docker Compose
Make sure Docker Desktop is running.
From the project root:
```powershell
docker compose -f docker/docker-compose.yml up --build
```
Or run in detached mode:
```powershell
docker compose -f docker/docker-compose.yml up --build -d
```
Check running containers:
```powershell
docker ps
```
Frontend:
```text
http://localhost:8080
```
API Gateway:
```text
http://localhost:5000
```
---
# 🛑 Stop the Application
```powershell
docker compose -f docker/docker-compose.yml down
```
To remove containers and associated volumes:
```powershell
docker compose -f docker/docker-compose.yml down -v
```
---
# 🧪 Testing APIs with Postman
Use the API Gateway as the base URL:
```text
http://localhost:5000
```
Example health request:
```http
GET http://localhost:5000/health
```
Example catalog request:
```http
GET http://localhost:5000/catalog/cakes
```
Example add cake request:
```http
POST http://localhost:5000/catalog/cakes
```
Body → raw → JSON:
```json
{
  "name": "Black Forest Cake",
  "description": "Chocolate cake with cream",
  "category": "Chocolate",
  "price": 599,
  "availability": true
}
```
Example rating request:
```http
POST http://localhost:5000/ratings
```
Body:
```json
{
  "cakeId": 1,
  "userName": "Amarjeet Kumar",
  "rating": 5,
  "review": "Amazing experience"
}
```
---
# 🔑 Important API Rule
For external testing, use:
```text
http://localhost:5000
```
The API Gateway acts as the **single entry point**.
Do not normally call the internal service ports directly.
```text
Frontend
   ↓
API Gateway :5000
   ↓
Microservices
```
Internal service ports:
```text
Catalog       :5001
Order         :5002
Rating        :5003
Notification  :5004
```
---
# 🎯 Project Features
The Cake Delight capstone demonstrates:
- Microservices architecture
- REST APIs
- API Gateway
- Docker containerization
- Kubernetes deployment
- Service-to-service communication
- RabbitMQ event-driven messaging
- Database-backed services
- Cake catalog management
- Shopping basket management
- Order checkout
- Ratings and reviews
- Order notifications
- Frontend integration
- Health monitoring
---
✅ Final Verification Checklist
Before submitting the capstone ZIP, verify the following end-to-end capabilities:
[x] Frontend loads successfully
[x] Cake catalog displays available cakes
[x] Add new cake works
[x] Search by cake name works
[x] Category filtering works
[x] Price filtering works
[x] Delete cake works
[x] Add cake to basket works
[x] Basket quantity update works
[x] Basket item removal works
[x] Checkout works
[x] Order is created and stored
[x] Order completion event is published through RabbitMQ
[x] Notification Service consumes the event
[x] Order confirmation notification is stored
[x] Order confirmation notification is displayed in the frontend
[x] Rating submission works
[x] Average rating works
[x] Review deletion works
[x] Docker Compose deployment works
[x] Kubernetes deployment manifests are included
[x] Kubernetes pods run successfully
[x] Kubernetes services are available
[x] API Gateway is used as the external API entry point
---
👨‍💻 Project**
**Project:** Cake Delight
**Type:** Cloud-Native Microservices Capstone Project
**Architecture:** Microservices
**API Entry Point:**
```text
http://localhost:5000
```
**Frontend:**
```text
http://localhost:8080
```
**Kubernetes Frontend:**
```text
http://localhost:31909
```
**Kubernetes API Gateway:**
```text
http://localhost:31002
```