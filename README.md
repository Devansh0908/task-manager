# Team Task Manager

A production-ready full-stack task manager for teams. Admins create projects, add members, assign tasks, and manage work. Members view their projects and update task status.

## Tech Stack

- Frontend: React with Vite
- Backend: Node.js, Express
- Database: MongoDB with Mongoose
- Auth: JWT and bcrypt
- API: REST
- Deployment target: Railway

## Folder Structure

```text
.
├── client
│   └── src
│       ├── api
│       ├── components
│       ├── context
│       └── pages
└── server
    └── src
        ├── config
        ├── controllers
        ├── middleware
        ├── models
        ├── routes
        └── utils
```

## Features

- Signup and login with JWT authentication
- Password hashing with bcrypt
- Admin and member roles
- Admin-only project creation
- Admin-only project member management
- Admin-only task assignment and task deletion
- Members can view assigned projects and update task status
- Project detail page with members and task management
- Dashboard analytics:
  - Total tasks
  - Tasks by status
  - Overdue tasks
- Input validation and consistent API error responses
- Railway-ready backend using `PORT` and environment variables

## Environment Variables

Create `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/team_task_manager
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Local Setup

Install dependencies from the project root:

```bash
npm run install:all
```

Start MongoDB locally, then run the backend:

```bash
npm run dev:server
```

In another terminal, run the frontend:

```bash
npm run dev:client
```

Open the app at `http://localhost:5173`.

## API Endpoints

### Auth

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/signup` | Public | Create an account |
| POST | `/api/auth/login` | Public | Log in and receive JWT |

### Projects

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/projects` | Admin | Create project |
| GET | `/api/projects` | Authenticated | List accessible projects |
| GET | `/api/projects/analytics` | Authenticated | Dashboard analytics |
| POST | `/api/projects/:id/add-member` | Admin | Add member by `email` or `userId` |

### Tasks

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/tasks` | Admin | Create and assign task |
| GET | `/api/tasks/:projectId` | Project members | List tasks for project |
| PUT | `/api/tasks/:id` | Admin or assigned member | Admin can edit task fields; members can update status |
| DELETE | `/api/tasks/:id` | Admin | Delete task |

## Railway Deployment

1. Create a Railway project and add a MongoDB database or provide a MongoDB Atlas URI.
2. Set backend environment variables in Railway:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
   - `CLIENT_URL`
3. Set the root directory to `server` for the backend service.
4. Use `npm start` as the start command.
5. Deploy the frontend separately with `VITE_API_URL` pointing to the deployed backend `/api` URL.

## Useful Commands

```bash
npm run install:all
npm run dev:server
npm run dev:client
npm run build
npm start
```
