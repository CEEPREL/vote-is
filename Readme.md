# Collaborative Decision Voting App – Fullstack (NestJS + Next.js)

This repository contains the fullstack implementation of a real-time collaborative voting application. The backend is built with **NestJS**, **PostgreSQL (via Prisma)**, and **Socket.IO**. The frontend is built with **Next.js**, styled using **Tailwind CSS**, and handles real-time updates with the **Socket.IO client**.

A visual preview of the application
https://github.com/CEEPREL/vote-is/blob/94b929aa91eb928c9d0337379f69adcddbb5f694/client/public/Screenshot%202025-06-22%20at%2020.03.01.png
https://github.com/CEEPREL/vote-is/blob/94b929aa91eb928c9d0337379f69adcddbb5f694/client/public/Screenshot%202025-06-22%20at%2020.03.14.png
https://github.com/CEEPREL/vote-is/blob/94b929aa91eb928c9d0337379f69adcddbb5f694/client/public/Screenshot%202025-06-22%20at%2020.03.51.png
https://github.com/CEEPREL/vote-is/blob/94b929aa91eb928c9d0337379f69adcddbb5f694/client/public/Screenshot%202025-06-22%20at%2020.04.19.png
https://github.com/CEEPREL/vote-is/blob/78570301ba275b466ed2bb1f8292d8c298a8b148/client/public/Screenshot%202025-06-23%20at%2008.56.32.png
https://github.com/CEEPREL/vote-is/blob/78570301ba275b466ed2bb1f8292d8c298a8b148/client/public/Screenshot%202025-06-23%20at%2008.56.02.png
https://github.com/CEEPREL/vote-is/blob/78570301ba275b466ed2bb1f8292d8c298a8b148/client/public/Screenshot%202025-06-23%20at%2008.55.45.png

The application allows users to create decision rooms, share them, vote anonymously or as registered users, and view real-time results. Authentication is handled securely using **JWT with HTTP-only cookies**.

---

## Features Implemented

- **Secure Auth Flow**

  - User registration and login
  - JWT authentication (cookies only)
  - Middleware-based route protection
  - Auto-redirect to intended room after login (preserves cached URL)

- **Room Creation & Sharing**

  - Authenticated users can create decision rooms
  - Each room supports 2–5 vote options
  - Each room has a unique slug URL for sharing
  - Voting deadline enforced automatically

- **Anonymous and Authenticated Voting**

  - One vote per user or guest (enforced)
  - Deadline-based voting restriction
  - Clean REST API + data validation

- **Live Vote Updates with WebSocket**

  - Clients connect once via WebSocket
  - Server emits vote tallies in real-time
  - Reduces server traffic and improves responsiveness

- **Vote Persistence**

  - Vote records saved once per user per room
  - Guests tracked via temporary tokens

---

## Stack & Tools

| Layer      | Technology                  |
| ---------- | --------------------------- |
| Frontend   | Next.js (TypeScript)        |
| Styling    | Tailwind CSS                |
| Forms      | React Hook Form + Zod       |
| State      | React Context               |
| Backend    | NestJS (TypeScript)         |
| ORM        | Prisma                      |
| DB         | PostgreSQL                  |
| Auth       | JWT via HTTP-only cookies   |
| Real-time  | Socket.IO (client + server) |
| Validation | class-validator, DTOs       |
| Testing    | Jest, Supertest (planned)   |

---

## Folder Structure

```
project-root/
├── client/
│   ├── src/
│   │   └── app/
│   ├── components/
│   └── utils/
├── .env
├── package.json
├── tsconfig.json
├── tsconfig.server.json

├── server/
│   ├── auth/
│   ├── user/
│   ├── room/
│   ├── vote/
│   ├── gateway/
│   ├── prisma/
│   ├── common/
│   ├── .env
│   └── main.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── README.md
├── .env
```

---

## Features To Implement

### 1. Interface for Room and User Modules

Define types/interfaces for room and user responses to enhance code predictability and reuse.

### 2. All Rooms by a User

Endpoint to retrieve all rooms created by a logged-in user.

### 3. Voting via Socket.IO

Replace REST vote submission with real-time Socket.IO event handling.

- Fewer DB hits
- Lower latency
- Smoother UX

### 4. Leave Room on Logout

Disconnect WebSocket connections gracefully on logout.

### 5. Hybrid Voting Model

Allow both authenticated and guest users to vote in a single room while enforcing vote uniqueness.

### 6. Delete Room

Enable room creators to delete rooms. Will include cascade deletion of associated votes and options.

---

## Testing Plan

Upcoming tests will cover:

- Authentication logic and guard protection
- Room lifecycle (creation, fetch by slug)
- Vote uniqueness and deadline enforcement
- WebSocket event transmission

---

## Setup & Running Locally

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/voting-app.git
cd voting-app
```

### 2. Install Dependencies

```bash
yarn install
```

### 3. Set Environment Variables

Copy `.env.example` to `.env` and populate values:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/voting_db
JWT_SECRET=your-super-secret
PORT=3001
JWT_EXPIRATION=360000000
NODE_ENV=development
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
```

### 4. Run Prisma Migration

```bash
npx prisma migrate dev --name init
```

### 5. Start Backend and Frontend

```bash
# Start NestJS backend
cd server && yarn start:dev

# Start Next.js frontend
cd ../client && yarn dev
```

---

## Socket.IO Integration

```ts
const socket = io('http://localhost:3001', { withCredentials: true });

socket.emit('join-room', roomId);
socket.emit('vote', { roomId, optionId });
socket.on('vote-update', (data) => updateUI(data));
```

Events:

- join-room
- vote
- leave-room
- vote-update

---

## API Overview

| Method | Endpoint           | Description                |
| ------ | ------------------ | -------------------------- |
| POST   | /auth/register     | Register user              |
| POST   | /auth/login        | Login with credentials     |
| GET    | /rooms/my          | Get current user's rooms   |
| GET    | /rooms/\:slug      | Fetch room by slug         |
| POST   | /rooms/\:slug/vote | Submit a vote              |
| DELETE | /rooms/\:id        | Delete room (creator only) |

---

## Authentication Details

- JWT stored in HTTP-only cookie for enhanced security
- Guard-based access control for protected routes
- Redirect on auth-required routes retains the original room URL

---

## Contribution Guidelines

Pull requests are welcome. Please ensure:

- Code is type-safe
- Commit messages are clean
- Changes are isolated per feature/bugfix

---

## License

MIT License. You may reuse, modify, or extend this app for your own decision-based collaboration systems.
