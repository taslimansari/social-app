# Social App

A minimal fullstack social app (React + Express + MongoDB) with user signup/login, posting, liking and commenting.

This README provides quick setup steps, environment variables, API documentation, example requests, and development notes so you can run and extend the project locally.

---

## Tech stack

- Backend: Node.js, Express, Mongoose (MongoDB), bcryptjs, jsonwebtoken, cors
- Frontend: React (Create React App), React Router, Axios
- Dev tools: nodemon (backend)

---

## Quickstart

### Prerequisites

- Node.js (16+ recommended)
- npm (comes with Node)
- MongoDB connection (local or hosted, e.g., MongoDB Atlas)

This repo is structured with two folders:
- `backend/` — the server API
- `frontend/` — the React client

### 1) Clone the repo

```bash
git clone https://github.com/taslimansari/social-app.git
cd social-app
```

### 2) Backend (API)

1. Install dependencies:

```bash
cd backend
npm install
```

2. Create a `.env` file (do NOT commit secrets). At minimum provide:

```
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=some-strong-secret
PORT=5000   # optional, default in server.js is 5000
```

> Note: The repository currently contains an example `.env` with values. Replace with your own credentials and never commit secrets.

3. Start the dev server (auto-restarts on change):

```bash
npm run dev
```

Or start normally:

```bash
npm start
```

The server will listen on port 5000 by default:
```
Server running on port 5000
MongoDB connected
```

### 3) Frontend (client)

1. In a separate terminal:

```bash
cd frontend
npm install
npm start
```

2. The React app will run on http://localhost:3000 by default. The client expects the API at `http://localhost:5000/api`. If you run the backend on a different host/port, update `frontend/src/services/api.js` accordingly.

---

## Environment variables

Backend `.env` (required):

- `MONGO_URI` — MongoDB connection string (e.g., `mongodb+srv://<user>:<pass>@cluster.mongodb.net/dbname`)
- `JWT_SECRET` — secret used to sign JWTs (keep private)
- `PORT` — optional, port for Express server (default 5000)

Frontend stores the JWT token in localStorage under `token` (see `frontend/src/services/api.js`).

---

## API Reference

Base URL: `http://localhost:5000/api`

All request and response bodies are JSON unless otherwise noted.

### Authentication

- POST `/api/auth/signup`
  - Create a new user.
  - Request body:
    ```json
    {
      "username": "alice",
      "email": "alice@example.com",
      "password": "supersecret"
    }
    ```
  - Response: the created user object (password is hashed in the DB).

  Example:
  ```bash
  curl -X POST http://localhost:5000/api/auth/signup \
    -H "Content-Type: application/json" \
    -d '{"username":"alice","email":"alice@example.com","password":"supersecret"}'
  ```

- POST `/api/auth/login`
  - Login and receive a JWT.
  - Request body:
    ```json
    {
      "email": "alice@example.com",
      "password": "supersecret"
    }
    ```
  - Response:
    ```json
    { "token": "eyJhbGciOi..." }
    ```

  Example:
  ```bash
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"alice@example.com","password":"supersecret"}'
  ```

  Save the returned token to use protected endpoints:
  ```bash
  export TOKEN="eyJhbGciOi..."
  ```

### Posts

- GET `/api/posts`
  - Public endpoint that returns all posts sorted newest-first.
  - Response: array of post objects.

  Example:
  ```bash
  curl http://localhost:5000/api/posts
  ```

- POST `/api/posts` (authenticated)
  - Create a new post.
  - Required header: `Authorization: Bearer <token>`
  - Request body:
    ```json
    {
      "text": "Hello world!",
      "image": "https://example.com/pic.jpg" // optional
    }
    ```
  - Response: the created post object.

  Example:
  ```bash
  curl -X POST http://localhost:5000/api/posts \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{"text":"Hello from curl!"}'
  ```

- PUT `/api/posts/:id/like` (authenticated)
  - Toggles like/unlike by the authenticated user.
  - Required header: `Authorization: Bearer <token>`
  - Response: the updated post.

  Example:
  ```bash
  curl -X PUT http://localhost:5000/api/posts/<POST_ID>/like \
    -H "Authorization: Bearer $TOKEN"
  ```

- POST `/api/posts/:id/comment` (authenticated)
  - Add a comment to a post.
  - Required header: `Authorization: Bearer <token>`
  - Request body:
    ```json
    { "text": "Nice post!" }
    ```
  - Response: the updated post.

  Example:
  ```bash
  curl -X POST http://localhost:5000/api/posts/<POST_ID>/comment \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{"text":"Great post!"}'
  ```

---

## Authentication details

- The backend generates a JWT on successful login with payload:
  ```json
  { "id": "<userId>", "username": "<username>" }
  ```
- The middleware expects the header:
  ```
  Authorization: Bearer <token>
  ```
  and sets `req.user` to the decoded payload for protected routes.

- The frontend Axios instance (`frontend/src/services/api.js`) automatically attaches the token from `localStorage.getItem("token")` as `Authorization` header.

---

## Data models (summary)

- User
  - username: String (required)
  - email: String (required, unique)
  - password: String (hashed)

- Post
  - userId: ObjectId (reference id)
  - username: String
  - text: String
  - image: String (URL)
  - likes: [{ username }]
  - comments: [{ username, text, createdAt }]
  - createdAt: Date

---

## Development notes & tips

- If MongoDB fails to connect:
  - Verify `MONGO_URI` in `.env`.
  - For Atlas, ensure your IP is whitelisted and username/password are correct.
- CORS:
  - Backend uses `cors()`; if you change ports, the default config should allow the front-end dev server to call the API.
- JWT errors:
  - If you receive `Unauthorized` from protected endpoints, check the Authorization header format: `Bearer <token>`.
  - Tokens are signed with `JWT_SECRET`; changing the secret will invalidate previously issued tokens.
- Hot-reload:
  - Use `npm run dev` in the backend (nodemon) for development.

---

## Where to look in source

- Backend entry: `backend/server.js`
- DB connection: `backend/config/db.js`
- Auth routes: `backend/routes/auth.js`
- Post routes: `backend/routes/posts.js`
- Models: `backend/models/User.js`, `backend/models/Post.js`
- Auth middleware: `backend/middleware/authMiddleware.js`
- Frontend API helper: `frontend/src/services/api.js`
- Frontend app / routes: `frontend/src/App.js`, pages in `frontend/src/pages/`

---

## Security & housekeeping

- Remove any committed `.env` files that contain secrets. Generate new secrets for production.
- Use HTTPS and secure cookies in production.
- Do not store plaintext passwords — the app uses bcrypt hashing.

---

## Contributing

Feel free to open issues or PRs. For quick local contributions:
1. Fork the repo, create a feature branch.
2. Run backend + frontend locally to reproduce behavior.
3. Add changes, test, and create a PR with a clear description.

---


