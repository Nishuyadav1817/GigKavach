const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const Worker = require("./WorkerModel");
const AuthMiddleware = require("./AuthMiddleware");

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ─── Register ───────────────────────────────────────────────────────────────
router.post("/register", async (req, res) => {
  console.log("hit");
  try {
    const { name, email, password, phone, skill } = req.body;

    const existing = await Worker.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const worker = await Worker.create({ name, email, password: hashed, phone, skill });

    const token = jwt.sign({ id: worker._id, email: worker.email }, process.env.JWT_KEY, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({ message: "Registered successfully", worker: { id: worker._id, name: worker.name, email: worker.email, plan: worker.plan } });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ─── Login ───────────────────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const worker = await Worker.findOne({ email });
    if (!worker) return res.status(404).json({ message: "Worker not found" });

    const match = await bcrypt.compare(password, worker.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: worker._id, email: worker.email }, process.env.JWT_KEY, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ message: "Login successful", worker: { id: worker._id, name: worker.name, email: worker.email, plan: worker.plan } });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ─── Logout ──────────────────────────────────────────────────────────────────
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  return res.status(200).json({ message: "Logged out successfully" });
});

// ─── Get Profile (protected) ─────────────────────────────────────────────────
router.get("/profile", AuthMiddleware, async (req, res) => {
  try {
    const worker = await Worker.findById(req.worker.id).select("-password");
    if (!worker) return res.status(404).json({ message: "Worker not found" });
    return res.status(200).json({ worker });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

// ─── Create Razorpay Order (protected) ───────────────────────────────────────
router.post("/payment/create-order", AuthMiddleware, async (req, res) => {
  try {
    const { amount, plan } = req.body; // amount in paise (e.g. 49900 = ₹499)

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: { plan, workerId: req.worker.id },
    });

    return res.status(200).json({ order, key: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.error("Razorpay order error:", err);
    return res.status(500).json({ message: "Payment order creation failed" });
  }
});

// ─── Verify Razorpay Payment (protected) ─────────────────────────────────────
router.post("/payment/verify", AuthMiddleware, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Update worker plan
    await Worker.findByIdAndUpdate(req.worker.id, { plan });

    return res.status(200).json({ message: "Payment verified. Plan upgraded!", plan });
  } catch (err) {
    console.error("Verify error:", err);
    return res.status(500).json({ message: "Verification server error" });
  }
});

module.exports = router;
