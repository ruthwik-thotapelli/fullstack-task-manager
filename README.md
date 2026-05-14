# Full Stack Task Manager

This repository contains a complete full-stack application with task management and notification workflow support.
It includes a React frontend, an Express backend, MongoDB integration, logging middleware, error handling, and a notification API implementation for the assessment.

---

## What’s included

- Task management features: create, read, update, delete tasks
- Task filtering and task board UI
- Notification system with protected API endpoints
- Frontend notification page with filters and unread state
- MongoDB schema design for notifications with priority handling
- Seed helper to load sample notifications on startup
- Project design documentation: `notification_system_design.md`

---

## Tech stack

### Frontend
- React
- Vite
- Axios
- React Router DOM

### Backend
- Node.js
- Express
- MongoDB
- Mongoose

### Dev utilities
- nodemon
- dotenv

---

## Repository structure

```bash
fullstack-task-manager/
├── backend/
│   ├── package.json
│   ├── src/
│   │   ├── config/db.js
│   │   ├── controllers/
│   │   │   ├── taskController.js
│   │   │   └── notificationController.js
│   │   ├── middleware/
│   │   │   ├── asyncHandler.js
│   │   │   ├── authMiddleware.js
│   │   │   ├── errorHandler.js
│   │   │   └── logger.js
│   │   ├── models/
│   │   │   ├── Task.js
│   │   │   └── Notification.js
│   │   ├── routes/
│   │   │   ├── taskRoutes.js
│   │   │   └── notificationRoutes.js
│   │   ├── seedNotifications.js
│   │   └── server.js
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── components/
│       ├── pages/
│       └── services/
├── notification_system_design.md
├── .gitignore
└── README.md
```

---

## Getting started

### Prerequisites

- Node.js 18+ or compatible
- npm
- MongoDB connection string

### Backend setup

1. Open terminal and navigate to `backend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `backend/` with:
   ```env
   MONGO_URI=<your-mongodb-connection-string>
   API_TOKEN=notif-demo-token
   PORT=5000
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000` and seed sample notifications if the collection is empty.

### Frontend setup

1. Open a second terminal and navigate to `frontend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `frontend/` with:
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_NOTIFICATION_API_TOKEN=notif-demo-token
   ```
4. Start the frontend app:
   ```bash
   npm run dev
   ```

The frontend should be available at `http://localhost:5173` by default.

---

## API Endpoints

### Task API
- `GET /api/tasks`
- `GET /api/tasks/:id`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

### Notification API (protected)
- `GET /api/notifications` - supports `limit`, `page`, `notification_type`, `priority`, `unseen`
- `POST /api/notifications` - create new notification
- `GET /api/notifications/:id` - fetch one notification
- `PATCH /api/notifications/:id` - mark notification as read

#### Authentication header
Use the bearer token defined in the backend `.env` file:

```http
Authorization: Bearer notif-demo-token
```

---

## Notification frontend

The app includes a notification page at `/notifications` that:
- displays all notifications
- highlights unread notifications
- filters by notification type and priority
- sorts priority notifications first

---

## Design documentation

See `notification_system_design.md` for the full Stage 1–7 design deliverables, including API contract, DB design, query optimization, priority inbox strategy, and batch notification pseudocode.

---

## Notes

- `backend/seedNotifications.js` seeds sample notifications automatically on backend startup.
- `.gitignore` excludes `node_modules` and environment files.
- This repo is already pushed to GitHub on `origin/main`.
