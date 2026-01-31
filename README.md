# Task Manager API (MERN Backend)

A secure and scalable Task Manager REST API built using Node.js, Express, and MongoDB.  
This backend implements JWT authentication with Access Token and Refresh Token flow.

---

## 🚀 Features

- User Authentication (Register / Login)
- JWT Access Token & Refresh Token Architecture
- Secure Refresh Token using HTTP-only Cookies
- Protected Routes with Middleware
- Task CRUD Operations
- Input Validation & Error Handling
- Token Auto Refresh Support
- Environment-based Configuration

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Cookie Parser
- dotenv
- CORS Middleware

---

## 🔐 Authentication Flow

- Access Token (Short-lived)
- Refresh Token (Long-lived, stored in HttpOnly Cookie)
- Automatic Access Token Renewal using `/auth/refresh`
- Current User Fetch via `/auth/me`

---

## 📌 API Endpoints

All endpoints below require a valid **Bearer Token** in the `Authorization` header.

### 📝 Active Tasks

| Method     | Endpoint         | Description                         | Middleware/Validation                   |
| :--------- | :--------------- | :---------------------------------- | :-------------------------------------- |
| **GET**    | `/api/tasks`     | Fetch user tasks (supports filters) | `getTasksQueryValidator`                |
| **POST**   | `/api/tasks`     | Create a new task                   | `createTaskValidator`                   |
| **PATCH**  | `/api/tasks/:id` | Update specific task fields         | `taskIdValidator`,`updateTaskValidator` |
| **DELETE** | `/api/tasks/:id` | Move task to trash (Soft Delete)    | `taskIdValidator`                       |

### 🗑️ Trash & Recovery

| Method     | Endpoint                   | Description                      | Middleware/Validation            |
| :--------- | :------------------------- | :------------------------------- | :------------------------------- |
| **GET**    | `/api/tasks/trash`         | View all soft-deleted tasks      | `getTasksQueryValidator`         |
| **PATCH**  | `/api/tasks/:id/restore`   | Restore a task from trash        | `taskIdValidator`                |
| **DELETE** | `/api/tasks/:id/permanent` | Permanent deletion (Destructive) | `trashLimiter`,`taskIdValidator` |
| **DELETE** | `/api/tasks/trash/empty`   | Wipe all tasks in trash          | `trashLimiter`                   |

## ⚙️ Environment Variables

To run this project, you will need to add the following variables to your .env file (locally) or your Render Dashboard (production):
Create a `.env` file with these keys:

- MONGO_URI
- JWT_ACCESS_SECRET
- JWT_REFRESH_SECRET
- NODE_ENV
- CLIENT_URL
- ACCESS_TOKEN_EXPIRE
- REFRESH_TOKEN_EXPIRE

## 🔒 Security Highlights

- Environment variable based secrets
- HTTP-only refresh token cookies
- Token expiration handling
- Rate limiting on destructive operations
- Middleware-based route protection

---

## 👨‍💻 Author

**Shobil Sathish**  
MERN Stack Developer  
GitHub: https://github.com/ShobilSathishPuthukudi

---

## 📌 Project Status

Backend Completed  
Frontend Integration In Progress
