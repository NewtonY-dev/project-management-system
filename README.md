```markdown
# Project Management System

A full-stack project management system with user authentication and role-based access control.

## Features

### Backend
- **Authentication**
  - User registration with email and password
  - User login with JWT token generation
  - Role-based access control (Project Manager, Team Member)
  - Password hashing with bcrypt

- **API Endpoints**
  - `POST /api/auth/register` — Register a new user
  - `POST /api/auth/login` — User login

- **Database**
  - MySQL connection with pooling
  - Environment-based configuration
  - Basic database initialization

- **Security**
  - JWT-based authentication
  - Environment variable configuration
  - Input validation and sanitization
  - Password hashing

## Technical Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** bcrypt for password hashing
- **Environment:** dotenv

## Project Structure
```
backend/
├── config/
│   └── db.js                # Database configuration
├── controllers/             # Route controllers
│   └── authController.js
├── middleware/              # Custom middleware
│   └── authMiddleware.js
├── routes/                  # API routes
│   ├── authRoutes.js
│   ├── projectRoutes.js
│   ├── taskRoutes.js
│   └── userRoutes.js
├── utils/                   # Utility functions
│   └── jwtUtils.js
├── .env.example             # Environment variables template
└── package.json             # Dependencies and scripts
```

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MySQL server
- npm or yarn

### Installation

```bash
# Clone the repository
git clone [https://github.com/NewtonY-dev/project-management-system]
cd project-management-system/backend

# Install dependencies
npm install

# Create .env from template and edit with your credentials
cp .env.example .env
# Edit .env: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET, etc.
```

### Database Setup
1. Create a MySQL database
2. Import schema/migrations if available
3. Ensure `.env` contains correct DB credentials

### Running the Server

```bash
# Development
npm run dev

# Production
npm start
```

## Security

- Passwords hashed with bcrypt before storage
- JWT tokens for authentication and session management
- Sensitive configuration via environment variables
- Input validation and sanitization for user inputs

## API Documentation

### Authentication

#### Register

```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe",
  "role": "team_member"
}
```

#### Login

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```