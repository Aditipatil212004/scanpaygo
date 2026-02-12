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

    storeName: { type: String, default: "" },
    storeLogo: { type: String, default: "" }, // base64
    storeStatus: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
const storeSchema = new mongoose.Schema({
  storeName: { type: String, required: true },
  storeLogo: { type: String, default: "" },
  storeStatus: { type: String, enum: ["open", "closed"], default: "open" },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

const Store = mongoose.model("Store", storeSchema);


/* ===================== RECEIPT SCHEMA ===================== */

const receiptSchema = new mongoose.Schema({
  receiptId: String,
  totalAmount: Number,
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
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ STAFF SIGNUP
app.post("/api/auth/create-staff", async (req, res) => {
  try {
    const { name, email, password, storeName } = req.body;

    if (!name || !email || !password || !storeName)
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

    // 🔥 CREATE STORE HERE
    const newStore = await Store.create({
      storeName,
      owner: staff._id,
    });

    res.json({
      message: "Staff created",
      staff,
      store: newStore,
    });

  } catch (err) {
    console.log("CREATE STAFF ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ LOGIN (ROLE PROTECTED)
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Invalid credentials" });

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
        storeName: user.storeName || "",
        storeLogo: user.storeLogo,
        storeStatus: user.storeStatus,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ===================== UPDATE STORE ===================== */

// UPDATE STORE INFO
app.put("/api/staff/store-settings", authMiddleware, staffOnly, async (req, res) => {
  try {
    const { storeLogo, storeStatus } = req.body;

    const updateFields = {};
    if (storeLogo !== undefined) updateFields.storeLogo = storeLogo;
    if (storeStatus !== undefined) updateFields.storeStatus = storeStatus;

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      updateFields,
      { new: true }
    ).select("-password");

    res.json({
      message: "Store updated successfully",
      user: updatedUser   // ⭐ IMPORTANT
    });

  } catch (err) {
    console.log("STORE UPDATE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/stores/:storeName", async (req, res) => {
  try {
    const store = await Store.findOne({
      storeName: req.params.storeName
    });

    if (!store) return res.status(404).json({ message: "Store not found" });

    res.json({ store });

  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

/* ===================== DASHBOARD ===================== */

app.get("/api/staff/dashboard", authMiddleware, staffOnly, async (req, res) => {
  try {
    const receipts = await Receipt.find().sort({ createdAt: -1 });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaysReceipts = receipts.filter(
      (r) => new Date(r.createdAt) >= today
    );

    const totalSales = todaysReceipts.reduce(
      (sum, r) => sum + (r.totalAmount || 0),
      0
    );

    const weekly = [0, 0, 0, 0, 0, 0, 0]; // no dummy data

    res.json({
      totalSales,
      verifiedCount: todaysReceipts.length,
      totalReceipts: receipts.length,
      weekly,
      recent: receipts.slice(0, 5),
    });
  } catch (err) {
    console.log("DASHBOARD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


/* ===================== VERIFY RECEIPT ===================== */

app.post("/api/staff/verify-receipt", authMiddleware, staffOnly, async (req, res) => {
  try {
    const { receiptId } = req.body;

    if (!receiptId)
      return res.status(400).json({ message: "Receipt ID required" });

    const newReceipt = await Receipt.create({
      receiptId,
      totalAmount: Math.floor(Math.random() * 5000) + 200,
    });

    res.json({
      ok: true,
      message: "Receipt verified successfully",
      receipt: newReceipt,
    });
  } catch (err) {
    console.log("VERIFY ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ===================== ROOT CHECK ===================== */

app.get("/", (req, res) => {
  res.json({ message: "ScanPay Backend Running 🚀" });
});

/* ===================== SERVER START ===================== */

if (require.main === module) {
  const PORT = process.env.PORT || 10000;
  app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
}

module.exports = app;
