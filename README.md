# Herrise App

Full-stack app with a **Node.js + MongoDB** server and a **React + Tailwind** client.

## Prerequisites

- **Node.js** 18+
- **MongoDB** running locally (e.g. `mongodb://localhost:27017`) or a cloud URI (e.g. MongoDB Atlas)

## Setup

### 1. Install dependencies

From the project root:

```bash
npm run install:all
```

Or manually:

```bash
npm install
cd server && npm install
cd client && npm install
```

### 2. Server environment

Copy the example env and set your MongoDB URI:

```bash
cd server
copy .env.example .env
```

Edit `server/.env`:

- `PORT=5000` (optional, default 5000)
- `MONGODB_URI=mongodb://localhost:27017/herrise` (or your Atlas URI)

### 3. Run the app

**Terminal 1 – API server (with MongoDB):**

```bash
npm run server
```

Server runs at **http://localhost:5000**.  
Health check: http://localhost:5000/api/health

**Terminal 2 – React client:**

```bash
npm run client
```

Client runs at **http://localhost:3000** and proxies `/api` to the server.

## Stack

- **Server:** Node.js, Express, Mongoose, CORS, dotenv
- **Client:** React 18, Vite, Tailwind CSS
- **Database:** MongoDB

## API

- `GET /api/health` – Health check
- `GET /api/items` – List items
- `POST /api/items` – Create item (`name`, optional `description`)
- `GET /api/items/:id` – Get one item
- `PATCH /api/items/:id` – Update item (e.g. `completed`)
- `DELETE /api/items/:id` – Delete item

The client uses the Vite proxy so requests to `/api` from the dev server go to the backend.
