# learnora_UdemyClone_FullMERN
# Learnora — MERN E-learning Platform

Learnora is a full-stack e-learning demo inspired by online course marketplaces. It includes a responsive React frontend, Express REST API, MongoDB models, JWT authentication, course catalogue, student enrollment, instructor course creation, and lesson progress tracking.

## Features

- Responsive landing page and course catalogue
- Search, category filters, and sorting
- Course details and curriculum
- User registration and login with hashed passwords
- JWT-protected endpoints
- Student dashboard and enrollment
- Lesson navigation and progress tracking
- Instructor role and course creation form
- Sample course seed data

## Requirements

- Node.js 18 or later
- npm
- MongoDB locally, or a MongoDB Atlas connection string

## Setup

1. Extract the project ZIP.
2. Open a terminal in the `learnora-mern` folder.
3. Install the root helper dependency:

   ```bash
   npm install
   ```

4. Install the frontend and backend dependencies:

   ```bash
   npm run install:all
   ```

5. Copy `server/.env.example` to `server/.env` and set your MongoDB URI and a long random JWT secret.

   Example local configuration:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/learnora
   JWT_SECRET=replace_this_with_a_long_random_secret
   CLIENT_URL=http://localhost:5173
   ```

6. Optional: copy `client/.env.example` to `client/.env`. The default API URL already points to the local server.

7. Seed the database with sample courses:

   ```bash
   npm run seed
   ```

8. Start both frontend and backend:

   ```bash
   npm run dev
   ```

9. Open `http://localhost:5173`.

The API health endpoint is `http://localhost:5000/api/health`.

## Demo instructor

The seed script creates this local-only instructor account:

- Email: `instructor@learnora.local`
- Password: `ChangeMe123!`

Change this password or remove the account before deploying. This is a demo credential, not a production account.

## API overview

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/api/health` | Public | Health check |
| POST | `/api/auth/register` | Public | Register student |
| POST | `/api/auth/login` | Public | Log in |
| GET | `/api/auth/me` | Logged in | Current user |
| GET | `/api/courses` | Public | List/search/filter courses |
| GET | `/api/courses/:id` | Public | Course details |
| POST | `/api/courses` | Instructor | Create course |
| PUT | `/api/courses/:id` | Owning instructor | Update course |
| DELETE | `/api/courses/:id` | Owning instructor | Delete course |
| POST | `/api/enrollments` | Logged in | Enroll in course |
| GET | `/api/enrollments/my-courses` | Logged in | List own enrollments |
| GET | `/api/enrollments/:id` | Enrollment owner | Get enrolled course |
| GET | `/api/enrollments/:id/progress` | Enrollment owner | Read progress |
| PUT | `/api/enrollments/:id/progress` | Enrollment owner | Update lesson progress |

Send `Authorization: Bearer <token>` to protected API endpoints.

## Project structure

```text
learnora-mern/
├── client/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── api.js
│       ├── App.jsx
│       ├── main.jsx
│       └── styles.css
├── server/
│   └── src/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── seed.js
│       └── server.js
├── package.json
└── README.md
```

## Notes

- Enrollment is a demo workflow; no payment gateway is connected.
- The lesson area uses text lesson content and a placeholder visual, not a real video-hosting system.
- Course thumbnail URLs in the seed data are remote sample images. Replace them with images you are licensed to use.
- The demo instructor password is for local development only.
- Before production deployment, add stronger request validation, rate limiting, security headers, secure token storage/cookie strategy, logging, tests, and a production deployment configuration.
- This project is a learning starter, not a fully audited production platform.
