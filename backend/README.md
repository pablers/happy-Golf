# Golf Master Backend

This is the NestJS backend for the Golf Master application. It handles user authentication and profile data management.

## Features

-   **Authentication**: JWT-based authentication using Passport.js.
-   **Endpoints**: `/register`, `/login`.
-   **Profile Management**: Secure CRUD endpoints for user profiles.
-   **Validation**: DTOs with `class-validator` for request payload validation.
-   **Data Store**: Simple in-memory user store for demonstration purposes.

## Running the Application

### 1. Installation

```bash
npm install
```

### 2. Running in Development

To run the application in watch mode (rebuilds on file change):

```bash
npm run start:dev
```

> **Note:** This is the only command you need to run for development. It automatically compiles your code and restarts the server when you make changes. You do not need to run `npm run build` separately.

The server will be running on `http://localhost:3001`.

### 3. API Endpoints

-   `POST /api/auth/register` - Create a new user.
-   `POST /api/auth/login` - Log in and receive a JWT.
-   `GET /api/profile` - (Protected) Get the current user's profile.
-   `PUT /api/profile` - (Protected) Update the current user's profile.