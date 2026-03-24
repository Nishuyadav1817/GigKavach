const express = require("express");
const App = express();
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const DataBase = require("./DB");
const WorkerAuth = require("./Reg"); // Your worker routes

// ------------------ MIDDLEWARE ------------------

// Parse JSON and cookies
App.use(express.json());
App.use(cookieParser());

// Allowed frontend origins
const allowedOrigins = [
  "https://gig-kavach-psi.vercel.app",
  "http://localhost:3000",
  "http://localhost:1234"
];

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (Postman, mobile apps)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("Blocked by CORS:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
};

// Apply CORS globally (also handles preflight OPTIONS)
App.use(cors(corsOptions));

// ------------------ DATABASE ------------------
DataBase(); // Connect to MongoDB or your DB

// ------------------ ROUTES ------------------
App.use("/worker", WorkerAuth); // Worker authentication routes

// Test route
App.get("/", (req, res) => {
  res.send("Gig Kavach API Running");
});



// ------------------ EXPORT ------------------
module.exports = App;