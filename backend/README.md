# Golf Master Backend

This is the NestJS backend for the Golf Master application. It handles user authentication and profile data management.

## Features

-   **Authentication**: JWT-based authentication using Passport.js.
-   **Endpoints**: `/register`, `/login`.
-   **Profile Management**: Secure CRUD endpoints for user profiles.
-   **Validation**: DTOs with `class-validator` for request payload validation.
-   **Data Store**: PostgreSQL managed through Prisma, provisioned via Neon for development.

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

### 3. Database Setup

Follow these steps the first time you run the project or whenever the schema changes:

1. **Configure the connection string**: the repository already ships with `.env.development` and `.env.production` files containing the Neon `DATABASE_URL`. Adjust them only if you are using a different cluster.
2. **Apply migrations**:

   ```bash
   npx dotenv -e .env.development -- npx prisma migrate deploy
   ```

   The `dotenv` wrapper loads `DATABASE_URL` before invoking Prisma, avoiding the `P1012` validation error you get when the variable is missing. When you start the Nest server the `PrismaService` will execute the same command automatically (it even loads the matching `.env` file if needed), so the tables also get created if you forgot this manual step. Set `PRISMA_AUTO_MIGRATE=false` in your environment to skip the automatic run (useful in CI).
3. **Seed initial data**:

   ```bash
   npx prisma db seed
   ```

   The seed script now reads `DATABASE_URL` automatically from `.env.development` (or from the
   file pointed by `PRISMA_ENV_FILE`), so you can run it without manually exporting variables.
   It loads demo users, profiles and golf courses so the app is immediately usable.

### 4. Testing the Integration

-   **Automated tests**: run `npx jest`. The current suite focuses on service-level units and is being expanded to cover new Prisma flows.
-   **Manual smoke checks**:
    -   2025-10-17: `npm run start:dev` fails with `PrismaClientInitializationError (P1001)` when contacting the Neon pooler (`ep-gentle-mouse-agdx3lak-pooler.c-2.eu-central-1.aws.neon.tech:5432`). Validate network access or credentials before executing manual API tests.

### 5. API Endpoints

-   `POST /api/auth/register` - Create a new user.
-   `POST /api/auth/login` - Log in and receive a JWT.
-   `GET /api/profile` - (Protected) Get the current user's profile.
-   `PUT /api/profile` - (Protected) Update the current user's profile.