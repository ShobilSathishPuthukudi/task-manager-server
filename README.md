# 📝 Task Manager API

A secure and scalable RESTful API built with **Node.js**, **Express**, and **MongoDB**. This backend serves as the core for a task management system, implementing industry-standard security practices for authentication and session management.

---

## ✨ Features

- **JWT Authentication**: Secure access using short-lived Access Tokens.
- **Refresh Token Rotation**: Enhanced security by rotating refresh tokens on every use and storing hashed versions in MongoDB.
- **Secure Cookies**: Refresh tokens are served via `HttpOnly` and `SameSite` cookies to prevent XSS attacks.
- **Centralized Error Handling**: Custom error middleware to provide consistent JSON error responses.
- **Data Validation**: Strict request body validation before processing logic.

---

## 🛠 Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Security**: [JSON Web Tokens (JWT)](https://jwt.io/), [Bcrypt.js](https://github.com/kelektiv/node.bcrypt.js)
- **Middleware**: [Express-Async-Handler](https://www.npmjs.com/package/express-async-handler)

---

## 📂 Project Structure

```text
src/
├── config/         # Database and server configurations
├── controllers/    # Business logic for routes
├── middleware/     # Auth guards and error handlers
├── models/         # Mongoose schemas (User, Task)
├── routes/         # Express route definitions
├── utils/          # Token generation and verification logic
└── app.js          # Main application entry point
```

Here is a complete, copy-paste-ready README.md block for your backend. I’ve refined the structure to be professional and added placeholders for your specific details.

Markdown

# 📝 Task Manager API

A secure and scalable RESTful API built with **Node.js**, **Express**, and **MongoDB**. This backend serves as the core for a task management system, implementing industry-standard security practices for authentication and session management.

---

## ✨ Features

- **JWT Authentication**: Secure access using short-lived Access Tokens.
- **Refresh Token Rotation**: Enhanced security by rotating refresh tokens on every use and storing hashed versions in MongoDB.
- **Secure Cookies**: Refresh tokens are served via `HttpOnly` and `SameSite` cookies to prevent XSS attacks.
- **Centralized Error Handling**: Custom error middleware to provide consistent JSON error responses.
- **Data Validation**: Strict request body validation before processing logic.

---

## 🛠 Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Security**: [JSON Web Tokens (JWT)](https://jwt.io/), [Bcrypt.js](https://github.com/kelektiv/node.bcrypt.js)
- **Middleware**: [Express-Async-Handler](https://www.npmjs.com/package/express-async-handler)

---

📡 API Endpoints
Authentication
Method Endpoint Description Auth Required
POST /api/auth/register Register a new user No
POST /api/auth/login Login & receive tokens No
POST /api/auth/refresh Rotate refresh token Yes (Cookie)
GET /api/auth/me Get current user profile Yes (Bearer)

Here is a complete, copy-paste-ready README.md block for your backend. I’ve refined the structure to be professional and added placeholders for your specific details.

Markdown

# 📝 Task Manager API

A secure and scalable RESTful API built with **Node.js**, **Express**, and **MongoDB**. This backend serves as the core for a task management system, implementing industry-standard security practices for authentication and session management.

---

## ✨ Features

- **JWT Authentication**: Secure access using short-lived Access Tokens.
- **Refresh Token Rotation**: Enhanced security by rotating refresh tokens on every use and storing hashed versions in MongoDB.
- **Secure Cookies**: Refresh tokens are served via `HttpOnly` and `SameSite` cookies to prevent XSS attacks.
- **Centralized Error Handling**: Custom error middleware to provide consistent JSON error responses.
- **Data Validation**: Strict request body validation before processing logic.

---

## 🛠 Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Security**: [JSON Web Tokens (JWT)](https://jwt.io/), [Bcrypt.js](https://github.com/kelektiv/node.bcrypt.js)
- **Middleware**: [Express-Async-Handler](https://www.npmjs.com/package/express-async-handler)

---

## 📂 Project Structure

src/
├── config/ # Database and server configurations
├── controllers/ # Business logic for routes
├── middleware/ # Auth guards and error handlers
├── models/ # Mongoose schemas (User, Task)
├── routes/ # Express route definitions
├── utils/ # Token generation and verification logic
└── app.js # Main application entry point

## 📡 API Endpoints

## 📡 Task Management API

📝 Active Tasks

Method Endpoint Description
GET / Fetch all user tasks
POST / Create a new task
PATCH /:id Update specific task fields
DELETE /:id Move task to Trash (Soft delete)

🗑️ Trash & Recovery

Method Endpoint Description
GET /trash View soft-deleted tasks
PATCH /:id/restore Restore task to active list
DELETE /:id/permanent Hard delete single task (Rate limited)
DELETE /trash/empty Wipe all trash (Rate limited)
