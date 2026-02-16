# Project Management System

A comprehensive full-stack web application for managing projects, tasks, users, and documents. This system provides a robust backend API built with Node.js and Express, coupled with a modern, fast frontend using React and Vite.

## Table of Contents

- [Quick Start](#quick-start)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Quick Start

Get the project running in minutes with these four simple steps:

1. **Clone the repository**
   ```bash
   git clone https://github.com/NewtonY-dev/project-management-system.git
   cd project-management-system
   ```

2. **Install dependencies**
   ```bash
   # Backend dependencies
   cd backend
   npm install
   
   # Frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Configure environment**
   ```bash
   # Backend environment
   cd backend
   cp .env.example .env
   # Edit .env with your database and OAuth credentials
   
   # Frontend environment
   cd ../frontend
   cp .env.example .env
   # Edit .env with your API URL and Google Client ID
   ```

4. **Start the application**
   ```bash
   # Terminal 1 - Start backend
   cd backend
   npm run dev
   
   # Terminal 2 - Start frontend
   cd frontend
   npm run dev
   ```

Visit `http://localhost:5173` to access the application.

---

## Features

### Core Functionality
- **User Authentication**: Secure registration, login, and Google OAuth integration using JWT tokens and bcrypt password hashing
- **Project Management**: Create, read, update, and delete projects with comprehensive CRUD operations
- **Task Management**: Efficient task tracking, assignment, status updates, and comment threading
- **User Management**: Administration of user accounts with role-based access control
- **Document Management**: Upload, download, and manage project documents with file type validation

### Advanced Features
- **Multi-Role System**: Support for Team Member and Project Manager roles with different permission levels
- **File Upload System**: Secure document upload with size limits (10MB) and type validation
- **Google OAuth Integration**: Seamless authentication using Google accounts
- **Real-time Updates**: Dynamic UI updates for task status changes and new assignments
- **Secure API**: Protected routes using middleware and flexible CORS configuration

---

## Tech Stack

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js 5.2.1
- **Database**: MySQL (using `mysql2` driver)
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs
- **File Upload**: Multer for multipart/form-data handling
- **OAuth**: Google Auth Library for Google integration
- **Security**: CORS enabled, Environment variable validation

### Frontend
- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Routing**: React Router Dom 6.26.2
- **OAuth Integration**: @react-oauth/google 0.13.4
- **Linting**: ESLint with React-specific rules
- **Development**: Hot module replacement and fast refresh

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16+ recommended) - [Download](https://nodejs.org/)
- **MySQL** server (v8+ recommended) - [Download](https://www.mysql.com/)
- **Git** for version control - [Download](https://git-scm.com/)
- **Google Cloud Project** (for OAuth integration) - [Setup Guide](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid)

---

## Installation & Setup

### 1. Database Setup

Ensure your MySQL server is running and create a database:

```sql
CREATE DATABASE project_management;
```

### 2. Backend Configuration

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create and configure your environment file:

```bash
cp .env.example .env
```

**Example `.env` configuration:**
```env
# Server configuration
PORT=8080
NODE_ENV=development

# CORS Configuration (comma-separated for multiple origins)
CORS_ORIGIN=http://localhost:3000,https://project-management-system.netlify.app

# Database configuration
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=project_management
DB_USER=root
DB_PASSWORD=your_database_password_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=1d

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:8080/api/auth/google/callback
```

### 3. Frontend Configuration

Navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
```

Create and configure your environment file:

```bash
cp .env.example .env
```

**Example frontend `.env` configuration:**
```env
VITE_API_BASE_URL=http://localhost:8080

# Replace with your actual Google Client ID for OAuth authentication
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:8080/api/auth/google/callback`
6. Copy Client ID and Client Secret to your `.env` files

### 5. Start the Development Servers

**Backend Server:**
```bash
cd backend
npm run dev
```
The server will start on `http://localhost:8080`.

**Frontend Server:**
```bash
cd frontend
npm run dev
```
The application will be available at `http://localhost:5173`.

---

## API Documentation

### Authentication Routes (`/api/auth`)

#### `POST /api/auth/register`
**Auth required**: No  
**Request body**:  
- `email` (string, required) - User email address  
- `password` (string, required) - User password  
- `name` (string, required) - User full name  
- `role` (string, optional) - User role (Team Member/Project Manager)  
**Success response**: `201 Created` - User registration successful  
**Error responses**: `400 Bad Request`, `409 Conflict`  
**Example**:
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "Team Member"
  }
}
```

#### `POST /api/auth/login`
**Auth required**: No  
**Request body**:  
- `email` (string, required) - User email address  
- `password` (string, required) - User password  
**Success response**: `200 OK` - Login successful with JWT token  
**Error responses**: `401 Unauthorized`, `404 Not Found`  
**Example**:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "Team Member"
  }
}
```

#### `POST /api/auth/google/token`
**Auth required**: No  
**Request body**:  
- `token` (string, required) - Google OAuth ID token  
**Success response**: `200 OK` - Google authentication successful  
**Error responses**: `400 Bad Request`, `401 Unauthorized`  

### Project Routes (`/api/projects`)

#### `POST /api/projects`
**Auth required**: Yes (JWT token)  
**Request body**:  
- `name` (string, required) - Project name  
- `description` (string, optional) - Project description  
- `start_date` (date, optional) - Project start date  
- `end_date` (date, optional) - Project end date  
**Success response**: `201 Created` - Project created successfully  
**Error responses**: `400 Bad Request`, `401 Unauthorized`  

#### `GET /api/projects`
**Auth required**: Yes (JWT token)  
**Success response**: `200 OK` - List of user projects  
**Error responses**: `401 Unauthorized`  

#### `GET /api/projects/:id`
**Auth required**: Yes (JWT token)  
**Success response**: `200 OK` - Project details  
**Error responses**: `404 Not Found`, `401 Unauthorized`  

#### `GET /api/projects/:id/tasks`
**Auth required**: Yes (JWT token)  
**Success response**: `200 OK` - List of project tasks  
**Error responses**: `404 Not Found`, `401 Unauthorized`  

### Task Routes (`/api/tasks`)

#### `POST /api/tasks/:projectId/tasks`
**Auth required**: Yes (JWT token)  
**Request body**:  
- `title` (string, required) - Task title  
- `description` (string, optional) - Task description  
- `priority` (string, optional) - Task priority (Low/Medium/High)  
- `due_date` (date, optional) - Task due date  
**Success response**: `201 Created` - Task created successfully  
**Error responses**: `400 Bad Request`, `401 Unauthorized`, `404 Not Found`  

#### `PUT /api/tasks/:taskId/assign`
**Auth required**: Yes (JWT token)  
**Request body**:  
- `assigned_to` (number, required) - User ID to assign task to  
**Success response**: `200 OK` - Task assigned successfully  
**Error responses**: `400 Bad Request`, `401 Unauthorized`, `404 Not Found`  

#### `GET /api/tasks/me`
**Auth required**: Yes (JWT token)  
**Success response**: `200 OK` - List of user's assigned tasks  
**Error responses**: `401 Unauthorized`  

#### `GET /api/tasks/:taskId`
**Auth required**: Yes (JWT token)  
**Success response**: `200 OK` - Task details with comments  
**Error responses**: `404 Not Found`, `401 Unauthorized`  

#### `PUT /api/tasks/:taskId/status`
**Auth required**: Yes (JWT token)  
**Request body**:  
- `status` (string, required) - New task status  
**Success response**: `200 OK` - Task status updated  
**Error responses**: `400 Bad Request`, `401 Unauthorized`, `404 Not Found`  

#### `POST /api/tasks/:taskId/comments`
**Auth required**: Yes (JWT token)  
**Request body**:  
- `comment` (string, required) - Comment text  
**Success response**: `201 Created` - Comment added successfully  
**Error responses**: `400 Bad Request`, `401 Unauthorized`, `404 Not Found`  

### User Routes (`/api/users`)

#### `GET /api/users`
**Auth required**: Yes (JWT token)  
**Success response**: `200 OK` - List of all users  
**Error responses**: `401 Unauthorized`  

### Document Routes (`/api/documents`)

#### `POST /api/documents/:taskId/documents`
**Auth required**: Yes (JWT token)  
**Request body**:  
- `file` (multipart/form-data, required) - File to upload (Max 10MB)  
- `title` (string, optional) - Document title  
**Success response**: `201 Created` - Document uploaded successfully  
**Error responses**: `400 Bad Request`, `401 Unauthorized`, `413 Payload Too Large`  
**Allowed file types**: jpg, jpeg, png, gif, pdf, doc, docx, txt  
**Example**:
```json
{
  "message": "Document uploaded successfully",
  "document": {
    "id": 42,
    "title": "Project Plan",
    "filename": "plan.pdf",
    "url": "/uploads/plan.pdf",
    "task_id": 1,
    "uploaded_by": 1
  }
}
```

#### `GET /api/documents/:taskId/documents`
**Auth required**: Yes (JWT token)  
**Success response**: `200 OK` - List of task documents  
**Error responses**: `404 Not Found`, `401 Unauthorized`  

#### `GET /api/documents/:documentId/download`
**Auth required**: Yes (JWT token)  
**Success response**: `200 OK` - File download  
**Error responses**: `404 Not Found`, `401 Unauthorized`  

#### `DELETE /api/documents/:documentId`
**Auth required**: Yes (JWT token)  
**Success response**: `200 OK` - Document deleted successfully  
**Error responses**: `404 Not Found`, `401 Unauthorized`  

---

## Project Structure

```
project-management-system/
├── backend/                # Node.js/Express API
│   ├── config/             # Database and environment configuration
│   │   ├── db.js
│   │   ├── envValidation.js
│   │   └── multerConfig.js
│   ├── constants/          # Application constants
│   │   └── fileTypes.js
│   ├── controllers/        # Route logic
│   │   ├── authController.js
│   │   ├── documentController.js
│   │   ├── googleAuthController.js
│   │   ├── projectController.js
│   │   ├── taskController.js
│   │   └── userController.js
│   ├── middleware/         # Auth and error handling
│   │   ├── authMiddleware.js
│   │   ├── documentValidation.js
│   │   └── errorMiddleware.js
│   ├── routes/             # API definition
│   │   ├── authRoutes.js
│   │   ├── documentRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── taskRoutes.js
│   │   └── userRoutes.js
│   ├── services/           # Business logic services
│   ├── uploads/            # File upload directory
│   ├── utils/              # Helper functions
│   │   ├── fileUtils.js
│   │   ├── jwtUtils.js
│   │   └── logger.js
│   ├── .env.example        # Environment variables template
│   ├── package.json
│   └── server.js           # Entry point
└── frontend/               # React Application
    ├── public/             # Static assets
    ├── src/
    │   ├── api/            # API integration
    │   │   ├── auth.js
    │   │   ├── projects.js
    │   │   ├── session.js
    │   │   ├── tasks.js
    │   │   └── utils.js
    │   ├── components/     # Reusable UI components
    │   │   ├── CommentForm.jsx
    │   │   ├── CommentList.jsx
    │   │   ├── CreateProjectModal.jsx
    │   │   ├── CreateTaskModal.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── ProjectCard.jsx
    │   │   ├── TaskCard.jsx
    │   │   ├── TaskStatusControls.jsx
    │   │   └── TMTaskCard.jsx
    │   ├── constants/      # Constants
    │   │   └── tasks.js
    │   ├── pages/          # Full page views
    │   │   ├── AuthCallback.jsx
    │   │   ├── Login.jsx
    │   │   ├── PMDashboard.jsx
    │   │   ├── ProjectDetail.jsx
    │   │   ├── Signup.jsx
    │   │   ├── TMDashboard.jsx
    │   │   └── TaskDetail.jsx
    │   ├── routes/         # Frontend routing logic
    │   │   └── guards.jsx
    │   ├── App.jsx         # Main App component
    │   ├── index.css       # Global styles
    │   └── main.jsx        # Entry point
    ├── .env.example        # Environment variables template
    ├── eslint.config.js    # ESLint configuration
    ├── index.html          # Main HTML entry
    ├── package.json
    └── vite.config.js      # Vite configuration
```

---

## Development

### Key Scripts

#### Backend (`/backend`)
- `npm run start`: Runs the server using `node`
- `npm run dev`: Runs the server using `nodemon` for hot-reloading

#### Frontend (`/frontend`)
- `npm run dev`: Starts the Vite development server
- `npm run build`: Builds the app for production
- `npm run preview`: Preview the production build locally
- `npm run lint`: Runs ESLint to check for code quality issues

### Environment Variables

#### Backend Variables
- `PORT`: Server port (default: 8080)
- `NODE_ENV`: Environment mode (development/production)
- `CORS_ORIGIN`: Allowed CORS origins (comma-separated)
- `DB_HOST`: MySQL database host
- `DB_PORT`: MySQL database port
- `DB_NAME`: Database name
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `JWT_SECRET`: JWT signing secret
- `JWT_EXPIRES_IN`: JWT token expiration time
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `GOOGLE_REDIRECT_URI`: Google OAuth redirect URI

#### Frontend Variables
- `VITE_API_BASE_URL`: Backend API base URL
- `VITE_GOOGLE_CLIENT_ID`: Google OAuth client ID for frontend

### File Upload Configuration

- **Maximum file size**: 10MB
- **Allowed file types**: jpg, jpeg, png, gif, pdf, doc, docx, txt
- **Upload directory**: `/backend/uploads/` (auto-created)
- **Storage**: Local file system with organized folder structure

---

## Testing

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Test Coverage

Currently, the project uses basic test setup. Future enhancements will include:
- Unit tests for API endpoints
- Integration tests for user workflows
- Frontend component testing
- E2E testing with Cypress

---

## Deployment

### Production Deployment Checklist

1. **Environment Setup**
   - Set `NODE_ENV=production`
   - Configure production database
   - Set up SSL certificates
   - Configure CORS for production domains

2. **Database Preparation**
   - Run database migrations
   - Set up database backups
   - Configure connection pooling

3. **Security Configuration**
   - Use strong JWT secrets
   - Enable HTTPS
   - Configure firewall rules
   - Set up rate limiting

4. **File Upload Setup**
   - Configure persistent storage for uploads
   - Set up file backup strategy
   - Configure CDN if needed

### Docker Deployment (Optional)

```dockerfile
# Example Dockerfile for backend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
```

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| **Database connection failed** | Check MySQL service status, verify credentials in `.env` |
| **CORS errors in browser** | Ensure `CORS_ORIGIN` includes your frontend URL |
| **File upload fails** | Check upload directory permissions, verify file size limits |
| **Google OAuth not working** | Verify Client ID/Secret, check redirect URI configuration |
| **JWT token expired** | Check `JWT_EXPIRES_IN` setting, implement token refresh |
| **Frontend cannot reach backend** | Verify `VITE_API_BASE_URL` matches backend URL |

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
DEBUG=app:*
```

### Log Files

- Backend logs: Console output (configure file logging in production)
- Frontend logs: Browser developer console
- Database logs: MySQL error logs

---

## Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Standards

- Follow ESLint configuration for frontend code
- Use consistent naming conventions
- Write clear, descriptive commit messages
- Add tests for new features
- Update documentation as needed

### Pull Request Guidelines

- Ensure all tests pass
- Update README if needed
- Describe changes clearly in PR description
- Link relevant issues in PR description

---

## License

This project is licensed under the **ISC** license.

---

## Support

For support and questions:

- Create an issue in the repository
- Check the troubleshooting section above
- Review the API documentation for endpoint details

---

## Badges

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-19.2.0-blue)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/mysql-%3E%3D8.0-blue)](https://www.mysql.com/)
