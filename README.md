# Project Management System

A comprehensive full-stack web application for managing projects, tasks, and users. This system provides a robust backend API built with Node.js and Express, coupled with a modern, fast frontend using React and Vite.

## Features

*   **User Authentication**: Secure user registration and login using JWT (JSON Web Tokens) and bcrypt for password hashing.
*   **Project Management**: Create, read, update, and delete projects (`/api/projects`).
*   **Task Management**: efficient task tracking and assignment (`/api/tasks`).
*   **User Management**: Administration of user accounts (`/api/users`).
*   **Secure API**: Protected routes using middleware and CORS configuration.

## Tech Stack

### Backend
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: MySQL (using `mysql2` driver)
*   **Authentication**: JSON Web Tokens (JWT) & bcryptjs
*   **Security**: CORS enabled, Environment variable validation

### Frontend
*   **Framework**: React 19
*   **Build Tool**: Vite
*   **Routing**: React Router Dom
*   **Linting**: ESLint

## Prerequisites

Before you begin, ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (v16+ recommended)
*   [MySQL](https://www.mysql.com/) server

## Installation & Setup

### 1. Database Setup
Ensure your MySQL server is running. You will need to create a database (default name: `project_management`) that matches your environment configuration.

### 2. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Configuration:
1.  Create a `.env` file in the `backend` directory based on `.env.example`.
2.  Update the variables to match your environment.

```bash
cp .env.example .env
```

**Example `.env` configuration:**
```env
PORT=8080
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=project_management
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d
```

Start the development server:
```bash
npm run dev
```
The server will start on `http://localhost:8080`.

### 3. Frontend Setup

Navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173` (or the port shown in your terminal).

## Key Scripts

### Backend (`/backend`)
*   `npm run start`: Runs the server using `node`.
*   `npm run dev`: Runs the server using `nodemon` for hot-reloading.

### Frontend (`/frontend`)
*   `npm run dev`: Starts the Vite development server.
*   `npm run build`: Builds the app for production.
*   `npm run preview`: Preview the production build locally.
*   `npm run lint`: Runs ESLint to check for code quality issues.

## Project Structure

```
project-management-system/
├── backend/                # Node.js/Express API
│   ├── package.json
│   ├── server.js           # Entry point
│   ├── .env.example        # Environment variables template
│   ├── config/             # Database and environment configuration
│   │   ├── db.js
│   │   └── envValidation.js
│   ├── controllers/        # Route logic
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   ├── taskController.js
│   │   └── userController.js
│   ├── middleware/         # Auth and error handling
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── routes/             # API definition
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── taskRoutes.js
│   │   └── userRoutes.js
│   └── utils/              # Helper functions
│       └── jwtUtils.js
└── frontend/               # React Application
    ├── README.md
    ├── eslint.config.js    # ESLint configuration
    ├── index.html          # Main HTML entry
    ├── package.json
    ├── vite.config.js      # Vite configuration
    ├── .env.example        # Environment variables template
    └── src/
        ├── App.jsx         # Main App component
        ├── index.css       # Global styles
        ├── main.jsx        # Entry point
        ├── api/            # API integration
        │   ├── auth.js
        │   ├── projects.js
        │   ├── session.js
        │   ├── tasks.js
        │   └── utils.js
        ├── components/     # Reusable UI components
        │   ├── CommentForm.jsx
        │   ├── CommentList.jsx
        │   ├── CreateProjectModal.jsx
        │   ├── CreateTaskModal.jsx
        │   ├── Dashboard.jsx
        │   ├── ProjectCard.jsx
        │   ├── TaskCard.jsx
        │   ├── TaskStatusControls.jsx
        │   └── TMTaskCard.jsx
        ├── constants/      # Constants
        │   └── tasks.js
        ├── pages/          # Full page views
        │   ├── Auth.css
        │   ├── Dashboard.css
        │   ├── Login.jsx
        │   ├── PMDashboard.jsx
        │   ├── ProjectDetail.css
        │   ├── ProjectDetail.jsx
        │   ├── Signup.jsx
        │   ├── TaskDetail.css
        │   ├── TaskDetail.jsx
        │   └── TMDashboard.jsx
        └── routes/         # Frontend routing logic
            └── guards.jsx
```

## License

This project is licensed under the **ISC** license.
