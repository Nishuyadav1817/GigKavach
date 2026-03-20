const mongoose = require("mongoose");

const WorkerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    skill: { type: String },
    isVerified: { type: Boolean, default: false },
    plan: { type: String, default: "free" }, // free | basic | premium
  },
  { timestamps: true }
);

module.exports = mongoose.model("Worker", WorkerSchema);
