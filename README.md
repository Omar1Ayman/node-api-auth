# API User Authentication and Authorization in Node.js

This Node.js application demonstrates how to implement user authentication and authorization for an API using various techniques such as JSON Web Tokens (JWT) and middleware in Node.js.

## Features

- User registration
- User login
- User reset password
- JWT generation and verification
- Protected routes using middleware
- Role-based access control (RBAC)
- Secure password hashing with bcrypt

## Prerequisites

Before running this application, ensure you have the following installed:

- Node.js and npm

## Getting Started

1. Clone this repository:

   ```bash
   git clone <repository-url>
   ```

2. Navigate into the project directory:

   ```bash
   cd api-user-authentication-nodejs
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up environment variables:

   Create a `.env` file in the root directory and provide the following variables:

   ```

   JWT_SECRET=<your-secret-key>
   PORT=3000
   DB_URL=URL
   NODE_ENV=development
   USER_EMAIL=your-email
   USER_PASS=your app password
   CLOUDINARY_CLOUD_NAME
   CLOUDINARY_API_KEY
   CLOUDINARY_API_SECRET

   ```

5. Start the server:

```bash
npm run start:dev
npm run start:prod
```

## API Endpoints

### Authentication

- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Log in with existing credentials.

### Protected Routes

- `GET /api/users`: Get all users profile (requires authentication,admin).
- `DELETE /api/users`: DELETE all users profile (requires authentication,admin).
- `UPDATE /api/users/:id`: UPDATE user profile (requires authentication).
- `GET /api/users/:id`: GET user profile (requires authentication).
- `GET /password/forgot-password`: GET forgot passwor form.
- `POST /password/reset-password`: Send reset password Link.
- `GET /password/reset-password/:id/:token`: GEt reset password Link.
- `POST /password/reset-password/:id/:token`: reset password .

## Environment Variables

- `PORT`: The port on which the server will run.
- `JWT_SECRET`: Secret key used to sign JWT tokens.
- `USER_EMAIL`:your-email to rest password
- `USER_PASS`:your app password to rest password
- `CLOUDINARY_CLOUD_NAME`: cloudinary name to upload profile
- `CLOUDINARY_API_KEY`: cloudinary api key to upload profile
- `CLOUDINARY_API_SECRET`:cloudinary api secret to upload profile

## Usage

- Register a new user by sending a POST request to `/api/auth/register`.
- Log in with existing credentials by sending a POST request to `/api/auth/login`.
- Use the JWT token obtained after login to access protected routes.
- Access user profile and admin data using the appropriate endpoints.
