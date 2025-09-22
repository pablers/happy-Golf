# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Branch: `fix/cors-and-docs` - 2025-09-22

#### Fixed
- **CORS Error**: Resolved a Cross-Origin Resource Sharing (CORS) error that blocked requests from the frontend. This was fixed by adding the `CORS_ORIGIN` environment variable to the `.env.development` file.
- **Documentation**: Updated `README.md` files (root and backend) to clarify the development startup process, correcting misleading instructions and emphasizing the use of `npm run start:dev`.

### Branch: `fix/backend-setup-and-runtime` - 2025-09-22

#### Fixed
- **Dependencies**: Added missing testing-related `devDependencies` (`@nestjs/testing`, `jest`, etc.) to resolve build failures. Ensured all new dependencies are compatible with the project's NestJS v10 core.
- **Configuration**: Added a default `JWT_SECRET` to the `.env.development` file to fix a runtime error where the `JwtStrategy` failed to initialize.

---
*Note: No structural database changes were made in these updates. The application currently uses a temporary in-memory data store.*
