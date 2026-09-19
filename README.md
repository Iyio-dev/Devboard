# DevBoard

DevBoard is a full-stack project and task management application. Users can register an account, create projects, and break each project down into tasks that can be created, edited, completed, and deleted. A dashboard gives an at-a-glance overview of total projects, total tasks, and completed tasks, and every project shows a live progress bar based on its completed tasks.

## Features

- User authentication (register, log in, log out) with JSON Web Tokens
- Protected API routes — users can only ever see and modify their own data
- Create, read, update, and delete projects
- Create, read, update, and delete tasks inside a project
- Mark tasks as completed
- Per-project statistics: total tasks, completed tasks, and a progress bar
- Dashboard overview with total projects, total tasks, and completed tasks
- Loading, error, and empty states on data-driven pages
- Responsive layout with a mobile navigation menu

## Tech Stack

**Frontend:**

- React
- Vite
- React Router
- Tailwind CSS
- Axios
- lucide-react (icons)

**Backend:**

- Node.js
- Express
- MongoDB
- Mongoose
- JWT (jsonwebtoken)
- bcryptjs (password hashing)

## Architecture

```
React frontend (Vite)
        │  Axios HTTP requests (JWT sent in the Authorization header)
        ▼
REST API — Express backend  (/api/v1/...)
        │  Mongoose ODM
        ▼
MongoDB database
```

The backend exposes a versioned REST API under `/api/v1`. Every request to the projects and tasks routes passes through an authentication middleware that verifies the JWT before the controller runs.

## Authentication

Authentication is token-based. When a user registers or logs in, the backend verifies their credentials (passwords are hashed with bcrypt) and returns a signed JWT. The frontend stores the token in `localStorage` and an Axios request interceptor automatically attaches it to every API request as an `Authorization: Bearer <token>` header. On the backend, `authMiddleware` verifies the token, loads the user, and attaches it to the request — controllers then check resource ownership (`project.user` / `task.user`) before allowing any read or write.

## API Routes

Base URL: `/api/v1`

### Auth

| Method | Endpoint         | Description                    | Auth required |
| ------ | ---------------- | ------------------------------ | ------------- |
| POST   | `/auth/sign-up`  | Register a new account         | No            |
| POST   | `/auth/sign-in`  | Log in and receive a JWT       | No            |

### Projects

| Method | Endpoint               | Description                          | Auth required |
| ------ | ---------------------- | ------------------------------------ | ------------- |
| GET    | `/projects/`           | List the current user's projects     | Yes           |
| GET    | `/projects/:id`        | Get a single project                 | Yes           |
| POST   | `/projects/create`     | Create a project                     | Yes           |
| PUT    | `/projects/update/:id` | Update a project                     | Yes           |
| DELETE | `/projects/delete/:id` | Delete a project (and its tasks)     | Yes           |
| GET    | `/projects/:id/tasks`  | List all tasks inside a project      | Yes           |

### Tasks

| Method | Endpoint              | Description                     | Auth required |
| ------ | --------------------- | ------------------------------- | ------------- |
| GET    | `/tasks/all`          | List all of the user's tasks    | Yes           |
| GET    | `/tasks/:id`          | Get a single task               | Yes           |
| POST   | `/tasks/:id/create`   | Create a task in project `:id`  | Yes           |
| PUT    | `/tasks/update/:id`   | Update a task                   | Yes           |
| PATCH  | `/tasks/complete/:id` | Mark a task as completed        | Yes           |
| DELETE | `/tasks/delete/:id`   | Delete a task                   | Yes           |

## Installation

### Prerequisites

- Node.js (v18+)
- MongoDB running locally, or a MongoDB Atlas connection string

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd devboard
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

### 4. Configure environment variables

Create `backend/.env` (see `backend/.env.example`):

```env
MONGO_URI=mongodb://localhost:27017/devboard
PORT=5001
JWT_SECRET=your-long-random-secret
TOKEN_EXPIRES_IN=7d
```

Optionally create `frontend/.env` if your backend is not running on the default local address (see `frontend/.env.example`):

```env
VITE_API_URL=http://localhost:5001/api/v1
```

### 5. Start MongoDB

Make sure your local MongoDB instance is running (or that your Atlas `MONGO_URI` is reachable).

### 6. Start the backend

```bash
cd backend
npm run dev
```

The API will run on `http://localhost:5001` (or your configured `PORT`).

### 7. Start the frontend

In a second terminal:

```bash
cd frontend
npm run dev
```

The app will be available at the URL Vite prints (usually `http://localhost:5173`).

## Environment Variables

### Backend (`backend/.env`)

```env
MONGO_URI=          # MongoDB connection string
JWT_SECRET=         # Secret used to sign JWTs
PORT=               # Port the Express server listens on
TOKEN_EXPIRES_IN=   # JWT lifetime, e.g. 7d
```

### Frontend (`frontend/.env`, optional)

```env
VITE_API_URL=       # Backend API base URL, e.g. http://localhost:5001/api/v1
```

## Screenshots

<!-- Add screenshots after deployment -->

- **Landing page** — _screenshot coming soon_
- **Dashboard** — _screenshot coming soon_
- **Project detail with tasks & progress** — _screenshot coming soon_
- **Create project / auth pages** — _screenshot coming soon_

## What I Learned

Building DevBoard taught me how the pieces of a full-stack JavaScript application fit together end to end:

- Designing a versioned **REST API** with Express and organizing it into routes, controllers, middleware, and models
- Implementing **JWT authentication**: hashing passwords with bcrypt, signing and verifying tokens, and protecting routes with middleware
- Enforcing **per-user authorization** so users can only access resources they own
- Modeling relational data in MongoDB with **Mongoose** (users → projects → tasks)
- Managing **async data fetching in React** with loading, error, and empty states
- Keeping the UI in sync with the server using React state updates and custom browser events
- Handling CORS and environment-based configuration for local vs. deployed environments

## Future Improvements

Ideas for a V2 (not yet implemented):

- Due dates and priorities for tasks
- Drag-and-drop task ordering / Kanban board view
- Refresh tokens and "remember me" sessions
- Project sharing / collaboration between users
- Search and filtering across projects and tasks

## Author

Ajibola Iyiola
