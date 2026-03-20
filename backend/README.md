# GigKavach — Frontend + Backend Integration Guide

## Folder Structure

```
project/
├── backend/                  ← Express API (Node.js)
│   ├── index.js              ← App config (CORS, middleware, routes)
│   ├── server.js             ← Starts the server (new file)
│   ├── .env                  ← Secret keys (never commit)
│   ├── package.json
│   ├── Main/
│   │   ├── DB.js             ← MongoDB connection
│   │   ├── Redis.js          ← Redis client
│   │   ├── WorkerModel.js    ← Mongoose schema
│   │   └── AuthMiddleware.js ← JWT cookie verification
│   └── Register/
│       └── Reg.js            ← All /worker routes
│
└── frontend/                 ← React app
    ├── package.json          ← proxy points to backend port
    ├── .env                  ← REACT_APP_API_URL
    └── src/
        ├── api/
        │   └── api.js        ← All backend calls (axios)
        ├── context/
        │   └── AuthContext.js← Worker auth state (React Context)
        └── hooks/
            └── usePayment.js ← Razorpay checkout hook
```

---

## Setup

### Backend
```bash
cd backend
npm install
# Make sure .env has all keys
npm start       # production
npm run dev     # with nodemon (install nodemon globally)
```

### Frontend
```bash
cd frontend
npm install
npm start
```

---

## How to use in your React components

### 1. Wrap your app with AuthProvider (in src/index.js)

```jsx
import { AuthProvider } from "./context/AuthContext";

root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
```

### 2. Register / Login

```jsx
import { registerWorker, loginWorker } from "./api/api";
import { useAuth } from "./context/AuthContext";

const { login } = useAuth();

// Register
const data = await registerWorker({ name, email, password, phone, skill });
login(data.worker);

// Login
const data = await loginWorker({ email, password });
login(data.worker);
```

### 3. Get current user anywhere

```jsx
import { useAuth } from "./context/AuthContext";

const { worker, logout, loading } = useAuth();
// worker.name, worker.email, worker.plan
```

### 4. Trigger payment

```jsx
import usePayment from "./hooks/usePayment";

const { startPayment, loading } = usePayment();

// On button click:
await startPayment({ amount: 49900, plan: "basic" }); // ₹499
```

---

## API Routes

| Method | Route                          | Auth | Description            |
|--------|--------------------------------|------|------------------------|
| POST   | /worker/register               | No   | Register new worker    |
| POST   | /worker/login                  | No   | Login                  |
| POST   | /worker/logout                 | No   | Clear cookie           |
| GET    | /worker/profile                | Yes  | Get logged-in worker   |
| POST   | /worker/payment/create-order   | Yes  | Create Razorpay order  |
| POST   | /worker/payment/verify         | Yes  | Verify & upgrade plan  |

Auth = JWT sent automatically as httpOnly cookie via `withCredentials: true`

---

## Production (Vercel + Render)

1. Deploy backend to Render — set all `.env` vars in Render dashboard
2. In `backend/index.js`, `allowedOrigins` already has `https://gig-bima.vercel.app` ✅
3. In `frontend/.env`, set:
   ```
   REACT_APP_API_URL=https://your-backend.render.com
   ```
4. Deploy frontend to Vercel — set `REACT_APP_API_URL` in Vercel env settings
