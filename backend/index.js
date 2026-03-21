const express = require("express");
const App = express();

require("dotenv").config();

const cors = require("cors");
const cookieParser = require("cookie-parser");

const DataBase = require("./DB");
const WorkerAuth = require("./Reg");

App.use(express.json());
App.use(cookieParser());

const allowedOrigins = [
  "https://gig-bima.vercel.app",
  "http://localhost:3000",
  "http://localhost:1234"
];

App.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Connect Database
DataBase();

// Routes
App.use("/worker", WorkerAuth);

module.exports = App;
