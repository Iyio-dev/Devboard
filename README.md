# DevBoard

DevBoard is a full-stack project and task management application built to help users organize projects, manage tasks, and track progress from a simple dashboard.

🔗 **Live Demo:** https://devboard-two-flax.vercel.app/

## Features

* User registration and authentication
* JWT-based authentication
* Create, view, update, and delete projects
* Create and manage project tasks
* Mark tasks as completed
* Track project progress
* Protected API routes
* Responsive dashboard
* RESTful API
* MongoDB data persistence

## Tech Stack

### Frontend

* React
* Vite
* React Router
* Tailwind CSS
* Axios
* Lucide React

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JSON Web Tokens
* bcryptjs

## Architecture

```text
React + Vite
     ↓
   Axios
     ↓
REST API
     ↓
Node.js + Express
     ↓
   MongoDB
```

## Authentication

DevBoard uses JWT-based authentication.

Users can register and log in, after which authenticated requests include a JWT in the authorization header. Protected backend routes verify the token before allowing access to user-specific resources.

## Core API Routes

### Authentication

```text
POST /api/v1/auth/sign-up
POST /api/v1/auth/sign-in
```

### Projects

```text
GET    /api/v1/projects/
POST   /api/v1/projects/create
GET    /api/v1/projects/:id
PATCH  /api/v1/projects/:id
DELETE /api/v1/projects/:id
```

### Tasks

```text
GET   /api/v1/tasks/all
PATCH /api/v1/tasks/complete/:id
```

> Additional endpoints may be available depending on the current implementation.

## Getting Started

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd DevBoard
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Install backend dependencies

```bash
cd ../backend
npm install
```

### 4. Configure environment variables

Create a `.env` file in the backend directory.

Example:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5001
```

For the frontend:

```env
VITE_API_URL=http://localhost:5001/api/v1
```

Never commit your `.env` files to GitHub.

### 5. Start the backend

```bash
cd backend
npm run dev
```

### 6. Start the frontend

Open another terminal:

```bash
cd frontend
npm run dev
```

The application will then be available through the Vite development server.

## Deployment

The production version of DevBoard is deployed using:

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

## What I Learned

Building DevBoard helped me strengthen my understanding of full-stack JavaScript development.

Some of the main concepts I practiced include:

* Building REST APIs with Express
* Connecting Node.js applications to MongoDB
* Designing Mongoose models
* Implementing JWT authentication
* Protecting API routes
* Managing authentication state in React
* Connecting React applications to backend APIs with Axios
* Handling CRUD operations
* Managing asynchronous requests and loading states
* Deploying a full-stack application
* Working with environment variables in development and production

## Future Improvements

Possible improvements for future versions include:

* Task priorities and due dates
* Project search and filtering
* Improved project analytics
* Collaboration and project members
* Notifications
* Automated testing
* More advanced authorization

## Author

**Ajibola Iyiola**

Full-stack JavaScript developer focused on building practical web applications.

## Live Demo

🚀 https://devboard-two-flax.vercel.app/
