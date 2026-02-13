// ✅ Load ENV first
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

/* ===================== DATABASE ===================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ Mongo Error:", err.message));

/* ===================== USER SCHEMA ===================== */

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: {
      type: String,
      enum: ["customer", "staff"],
      default: "customer",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

/* ===================== STORE SCHEMA ===================== */

const storeSchema = new mongoose.Schema(
  {
    brandName: { type: String, required: true },
    location: { type: String, required: true },
    city: { type: String, required: true },

    storeLogo: { type: String, default: "" },
    storeStatus: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },

    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Store = mongoose.model("Store", storeSchema);

/* ===================== RECEIPT SCHEMA ===================== */

const receiptSchema = new mongoose.Schema({
  receiptId: String,
  totalAmount: Number,
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const Receipt = mongoose.model("Receipt", receiptSchema);

/* ===================== AUTH MIDDLEWARE ===================== */

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

/* ===================== STAFF ONLY ===================== */

const staffOnly = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role !== "staff")
      return res.status(403).json({ message: "Access denied. Staff only." });
    next();
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

/* ===================== AUTH ROUTES ===================== */

// ✅ CUSTOMER SIGNUP
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
    });

    res.status(201).json({
      message: "Signup successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.log("SIGNUP ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ STAFF SIGNUP
app.post("/api/auth/create-staff", async (req, res) => {
  try {
    const { name, email, password, brandName, location, city } = req.body;

    if (!name || !email || !password || !brandName || !location || !city)
      return res.status(400).json({ message: "All fields required" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const staff = await User.create({
      name,
      email,
      password: hashed,
      role: "staff",
    });

    const store = await Store.create({
      brandName,
      location,
      city,
      owner: staff._id,
    });

    res.json({
      message: "Staff created successfully",
      staff,
      store,
    });
  } catch (err) {
    console.log("CREATE STAFF ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ LOGIN
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Invalid credentials" });

    if (user.role !== role)
      return res.status(403).json({ message: "Wrong account type" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    let storeData = {};

    if (user.role === "staff") {
      const store = await Store.findOne({ owner: user._id });

      if (store) {
        storeData = {
          storeId: store._id,
          brandName: store.brandName,
          location: store.location,
          city: store.city,
          storeLogo: store.storeLogo,
          storeStatus: store.storeStatus,
        };
      }
    }

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        ...storeData,
      },
    });
  } catch (err) {
    console.log("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ===================== GET STORES (Customer Side) ===================== */

app.get("/api/stores", async (req, res) => {
  try {
    const stores = await Store.find().select("-__v");
    res.json({ stores });
  } catch (err) {
    console.log("GET STORES ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ===================== DASHBOARD ===================== */

app.get("/api/staff/dashboard", authMiddleware, staffOnly, async (req, res) => {
  try {
    const store = await Store.findOne({ owner: req.userId });

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    const receipts = await Receipt.find({
      storeId: store._id,
    }).sort({ createdAt: -1 });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaysReceipts = receipts.filter(
      (r) => new Date(r.createdAt) >= today
    );

    const totalSales = todaysReceipts.reduce(
      (sum, r) => sum + (r.totalAmount || 0),
      0
    );

    res.json({
      totalSales,
      verifiedCount: todaysReceipts.length,
      totalReceipts: receipts.length,
      weekly: [0, 0, 0, 0, 0, 0, 0],
      recent: receipts.slice(0, 5),
    });

  } catch (err) {
    console.log("DASHBOARD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});
/* ===================== UPDATE STORE ===================== */

app.put("/api/staff/store-settings", authMiddleware, staffOnly, async (req, res) => {
  try {
    const { storeLogo, storeStatus } = req.body;

    const store = await Store.findOne({ owner: req.userId });
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    if (storeLogo !== undefined) store.storeLogo = storeLogo;
    if (storeStatus !== undefined) store.storeStatus = storeStatus;

    await store.save();

    res.json({
      message: "Store updated successfully",
      user: {
        storeId: store._id,
        brandName: store.brandName,
        location: store.location,
        city: store.city,
        storeLogo: store.storeLogo,
        storeStatus: store.storeStatus,
      },
    });

  } catch (err) {
    console.log("STORE UPDATE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


/* ===================== SERVER START ===================== */

if (require.main === module) {
  const PORT = process.env.PORT || 10000;
  app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
}

module.exports = app;
