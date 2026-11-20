# EduPulse

EduPulse is a modern learning management interface for students and instructors. It provides course discovery, lesson progress tracking, assignments, quizzes, instructor tools, and a responsive dashboard.

## Features

- Student dashboard with progress, deadlines, and course activity
- Course catalog with search, category filters, and lesson player
- Notes, lesson completion, quizzes, and saved local progress
- Assignment submission and grade tracking
- Instructor portal for courses, students, submissions, and announcements
- REST API with role-based authentication and MongoDB models
- Responsive interface for desktop and mobile

## Technology Stack

| Area | Technology |
| --- | --- |
| Frontend | React 19, Vite |
| Backend | Node.js, Express |
| Database | MongoDB with Mongoose |
| Authentication | JSON Web Tokens, bcrypt |

## Project Structure

```text
EduPulse/
├── frontend/       # React user interface
│   └── src/
│       ├── pages/  # Student, instructor, and admin screens
│       └── assets/
└── server/         # Express REST API
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    └── seed.js
```

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm
- MongoDB or a MongoDB Atlas connection

### 1. Configure the backend

Create `server/.env` with:

```env
MONGO_URI=mongodb://127.0.0.1:27017/edupulse
JWT_SECRET=replace_with_a_long_random_secret
PORT=5000
CLIENT_URL=http://localhost:5173
```

### 2. Install dependencies

```powershell
cd server
npm install
npm run seed

cd ../frontend
npm install
```

### 3. Start the application

Open two terminals.

From the first terminal:

```powershell
cd server
npm run dev
```

From the second terminal:

```powershell
cd frontend
npm run dev
```

Open `http://localhost:5173`.

The API health endpoint is available at `http://localhost:5000/api/health`.

## Demo Accounts

After running `npm run seed` in the server directory:

| Role | Username | Password |
| --- | --- | --- |
| Admin | `admin@edupulse.test` | `DemoPass123!` |
| Instructor | `instructor@edupulse.test` | `DemoPass123!` |
| Student | `student@edupulse.test` | `DemoPass123!` |

The current frontend includes demo login screens and stores student dashboard progress in browser local storage. The instructor and student demo controls do not require real credentials. The Express API can be run separately for authenticated role-based workflows.

## Available Scripts

### Frontend

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the production build |

### Backend

| Command | Description |
| --- | --- |
| `npm run dev` | Start the API with Nodemon |
| `npm start` | Start the API |
| `npm run seed` | Add demo users and sample course data |

## API Overview

| Area | Base route |
| --- | --- |
| Authentication | `/api/auth` |
| Admin | `/api/admin` |
| Instructor | `/api/instructor` |
| Student | `/api/student` |
| Health check | `/api/health` |

## Production Build

```powershell
cd frontend
npm run build
npm run preview
```
