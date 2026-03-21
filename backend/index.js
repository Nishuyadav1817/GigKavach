const express = require("express");
const App = express();

require("dotenv").config();

const cors = require("cors");
const cookieParser = require("cookie-parser");

const DataBase = require("./DB");
const WorkerAuth = require("./Reg");

// Middleware
App.use(express.json());
App.use(cookieParser());

// Allowed Frontend Origins
const allowedOrigins = [
  "https://gig-kavach-psi.vercel.app",
  "http://localhost:3000",
  "http://localhost:1234"
];

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
};

// Apply CORS
App.use(cors(corsOptions));

// Handle Preflight Requests
App.options("*", cors(corsOptions));

// Connect Database
DataBase();

// Routes
App.use("/worker", WorkerAuth);

// Test Route
App.get("/", (req, res) => {
  res.send("Gig Kavach API Running");
});

// Export App (Vercel serverless)
module.exports = App;