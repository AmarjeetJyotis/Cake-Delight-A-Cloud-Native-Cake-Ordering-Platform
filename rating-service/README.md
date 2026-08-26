# ⭐ Rating Microservice

The **Rating Microservice** manages cake ratings and customer reviews for the Cake Delight application. It allows users to submit ratings and reviews, view all ratings for a cake, and see a cake's average rating.

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
- [Status](#status)

---

## Overview

This service allows users to:

- Submit ratings for cakes
- Write reviews
- View all ratings of a cake
- Calculate the average rating of a cake

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
rating-service/
│
├── src/
│   │
│   ├── config/
│   │   └── database.js
│   │
│   ├── controllers/
│   │   └── ratingController.js
│   │
│   ├── models/
│   │   └── Rating.js
│   │
│   ├── routes/
│   │   ├── healthRoutes.js
│   │   └── ratingRoutes.js
│   │
│   ├── services/
│   │   └── ratingService.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── .gitignore
├── Dockerfile
├── package.json
└── README.md
```

---

## Database

**Database name:** `rating_db`

**Table:** `ratings`

| Column | Description |
|---|---|
| id | Rating ID |
| cakeId | Cake ID |
| userName | Customer name |
| rating | Rating value |
| review | Customer review |
| createdAt | Rating date |

---

## APIs

### 1. Health Check

```
GET /health
```

Checks whether the service is running.

### 2. Submit Rating

```
POST /ratings
```

Adds a new rating for a cake.

**Example request:**

```json
{
  "cakeId": 1,
  "userName": "Amarjeet",
  "rating": 5,
  "review": "Very delicious cake."
}
```

### 3. Get Ratings By Cake

```
GET /ratings/:cakeId
```

Returns all ratings for the selected cake.

Example: `GET /ratings/1`

### 4. Get Average Rating

```
GET /ratings/:cakeId/average
```

Returns the average rating of the selected cake.

Example: `GET /ratings/1/average`

---

## API Summary

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Service health check |
| POST | `/ratings` | Submit a rating and review |
| GET | `/ratings/:cakeId` | Get all ratings for a cake |
| GET | `/ratings/:cakeId/average` | Get a cake's average rating |

---

## Running Locally

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The service runs at: `http://localhost:5003`

---

## Testing the APIs

```bash
# Health check
GET http://localhost:5003/health

# Submit rating
POST http://localhost:5003/ratings

# View ratings for a cake
GET http://localhost:5003/ratings/1

# Average rating for a cake
GET http://localhost:5003/ratings/1/average
```

---

## Features Completed

- Submit cake rating
- Submit customer review
- View all ratings
- Calculate average rating
- MySQL database integration
- REST APIs
- Health check API

---

## Status

The Rating Microservice is completed successfully according to the project requirements.