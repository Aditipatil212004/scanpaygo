// ✅ Load ENV first
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json({ limit: "10mb" }));

/* ===================== DATABASE ===================== */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ Mongo Error:", err.message));

/* ===================== USER SCHEMA ===================== */
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["customer", "staff"], default: "customer" },
  storeName: { type: String, default: "" }, // ✅ ADD THIS
}, { timestamps: true });


const User = mongoose.model("User", userSchema);

/* ===================== AUTH MIDDLEWARE ===================== */
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

/* ===================== STAFF ROLE MIDDLEWARE ===================== */
const staffOnly = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role !== "staff") return res.status(403).json({ message: "Access denied. Staff only." });
    next();
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

/* ===================== AUTH ROUTES ===================== */

// Signup (Customer)
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    res.status(201).json({
      message: "Signup successful",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// Create Staff (Admin use only)
app.post("/api/auth/create-staff", async (req, res) => {
  try {
    const { name, email, password, storeName } = req.body;

    if (!name || !email || !password || !storeName) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const staff = await User.create({
      name,
      email,
      password: hashed,
      role: "staff",
      storeName: storeName, // explicitly assign
    });

    res.json({
      message: "Staff created",
      staff,
    });

  } catch (err) {
    console.log("CREATE STAFF ERROR =>", err); // 🔥 add this
    res.status(500).json({ message: "Server error" });
  }
});



// ================= GET STAFF DASHBOARD DATA =================
app.get("/api/staff/dashboard", authMiddleware, staffOnly, async (req, res) => {
  try {
    const receipts = await Receipt.find().sort({ createdAt: -1 });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaysReceipts = receipts.filter(r => new Date(r.createdAt) >= today);

    const totalSales = todaysReceipts.reduce((sum, r) => sum + r.totalAmount, 0);

    res.json({
      totalSales,
      verifiedCount: todaysReceipts.length,
      totalReceipts: receipts.length,
      recent: receipts.slice(0, 5)
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// Login (Customer + Staff)



app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 🔥 ROLE CHECK (VERY IMPORTANT)
    if (user.role !== role) {
      return res.status(403).json({
        message:
          role === "staff"
            ? "This account is not a staff account."
            : "This account is not a customer account.",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
  message: "Login successful",
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    storeName: user.storeName, // ⭐ VERY IMPORTANT
  },
});

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


/* ===================== STAFF PROTECTED ROUTE ===================== */
app.post("/api/staff/verify-receipt", authMiddleware, staffOnly, async (req, res) => {
  try {
    const { receiptId } = req.body;

    if (!receiptId) return res.status(400).json({ message: "Receipt ID required" });

    res.json({
      ok: true,
      message: "Receipt verified successfully",
      verifiedBy: req.userId,
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

/* ===================== SERVER START ===================== */
if (require.main === module) {
  const PORT = process.env.PORT || 10000;
  app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
}

module.exports = app;
