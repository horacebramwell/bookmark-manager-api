# Bookmark Manager API

This is a RESTful API for managing bookmarks, built with Express.js and TypeScript.

## Features

- User authentication (register, login)
- CRUD operations for bookmarks
- Search functionality
- Pagination
- Input validation
- Error handling
- Rate limiting

## 🚧 In Progress 🚧

- Robust error messages: Error messages are functional, but will be refined to provide more context and actionable guidance to users.

## Getting Started

1. Clone the repository
2. Install dependencies: `bun install`
3. Set up your `.env` file with the necessary environment variables
4. Run the development server: `bun run dev`
5. Build for production: `bun run build`
6. Run tests: `bun test`

## API Endpoints

- POST /api/auth/register: Register a new user
- POST /api/auth/login: Login a user
- GET /api/bookmarks: List all bookmarks (paginated)
- POST /api/bookmarks: Create a new bookmark
- PUT /api/bookmarks/:id: Update a bookmark
- DELETE /api/bookmarks/:id: Delete a bookmark
- GET /api/bookmarks/search: Search bookmarks

## Technologies Used

- Express.js
- TypeScript
- MongoDB with Mongoose
- JSON Web Tokens (JWT) for authentication
- Joi for input validation
- Winston for logging
- Jest for testing

## Environment Variables

Bun automatically loads environment variables from a `.env` file in your project root, so you don't need to install or configure `dotenv` separately. Make sure to create a `.env` file in your project root and add the necessary environment variables there.

Example `.env` file:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/bookmarks
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```
