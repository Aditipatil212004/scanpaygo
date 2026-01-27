// ✅ Load ENV first (VERY IMPORTANT)
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const multer = require("multer");

const app = express();

// ✅ Routes (import AFTER dotenv)
const paymentRoutes = require("../routes/paymentRoutes");

// ✅ Multer setup
const upload = multer({ storage: multer.memoryStorage() });

// ✅ Debug ENV
console.log("✅ ENV PORT =", process.env.PORT);
console.log("✅ ENV MONGO_URI =", process.env.MONGO_URI ? "LOADED" : "MISSING");
console.log("✅ ENV JWT_SECRET =", process.env.JWT_SECRET ? "LOADED" : "MISSING");
console.log("✅ ENV EMAIL_USER =", process.env.EMAIL_USER || "MISSING");
console.log("✅ ENV EMAIL_PASS =", process.env.EMAIL_PASS ? "LOADED" : "MISSING");
console.log("✅ RAZORPAY_KEY_ID =", process.env.RAZORPAY_KEY_ID || "MISSING");
console.log("✅ RAZORPAY_KEY_SECRET =", process.env.RAZORPAY_KEY_SECRET ? "LOADED" : "MISSING");

// ✅ Middlewares
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "10mb" }));

// ✅ Payment Routes
app.use("/payment", paymentRoutes);

/* ✅ MongoDB Connect */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err.message));

/* ✅ Email Transporter (Gmail) */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Mail transporter verify failed:", error.message);
  } else {
    console.log("✅ Mail transporter is ready to send emails");
  }
});

/* =========================================================
   ✅ Schemas & Models
========================================================= */

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },

    phone: { type: String, default: "" },
    dob: { type: String, default: "" },
    photo: { type: String, default: "" },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);

const addressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    label: { type: String, default: "Home" }, // Home / Work / Store
    storeName: { type: String, default: "" }, // Zudio, Dmart etc.

    addressLine: { type: String, required: true },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    pincode: { type: String, default: "" },

    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },

    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);
const Address = mongoose.model("Address", addressSchema);

/* ✅ Dummy Products */
const PRODUCTS = [
  { barcode: "8901234567890", id: "p1", name: "Cotton T-Shirt", price: 499 },
  { barcode: "8901234567891", id: "p2", name: "Denim Jeans", price: 1299 },
  { barcode: "026356007", id: "p3", name: "Cotton Kurti", price: 790 },
];

/* =========================================================
   ✅ Middleware: Auth
========================================================= */
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

/* =========================================================
   ✅ Test Route
========================================================= */
app.get("/", (req, res) => {
  res.json({ success: true, message: "Backend Running ✅" });
});

/* =========================================================
   ✅ Products API
========================================================= */
app.get("/api/products/:barcode", (req, res) => {
  const { barcode } = req.params;
  const product = PRODUCTS.find((p) => p.barcode === barcode);

  if (!product) return res.status(404).json({ message: "Product not found" });

  res.json(product);
});

/* =========================================================
   ✅ AUTH ROUTES (Signup + Login)
========================================================= */

// ✅ SIGNUP
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Signup successful ✅",
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    console.error("Signup Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ LOGIN
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful ✅",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================================================
   ✅ Profile Update (single route only)
========================================================= */
app.put("/api/user/update-profile", authMiddleware, upload.single("photo"), async (req, res) => {
  try {
    const { phone, dob } = req.body;

    let photoBase64 = "";
    if (req.file) {
      const base64 = req.file.buffer.toString("base64");
      photoBase64 = `data:${req.file.mimetype};base64,${base64}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        phone: phone || "",
        dob: dob || "",
        ...(photoBase64 ? { photo: photoBase64 } : {}),
      },
      { new: true }
    ).select("-password");

    res.json({ ok: true, message: "Profile updated ✅", user: updatedUser });
  } catch (err) {
    console.log("Update profile error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================================================
   ✅ Address APIs
========================================================= */
app.get("/api/address", authMiddleware, async (req, res) => {
  try {
    const list = await Address.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ ok: true, addresses: list });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/address", authMiddleware, async (req, res) => {
  try {
    const {
      label,
      storeName,
      addressLine,
      city,
      state,
      pincode,
      latitude,
      longitude,
      isDefault,
    } = req.body;

    if (!addressLine) return res.status(400).json({ message: "Address is required" });

    if (isDefault) {
      await Address.updateMany({ userId: req.userId }, { isDefault: false });
    }

    const newAddress = await Address.create({
      userId: req.userId,
      label,
      storeName,
      addressLine,
      city,
      state,
      pincode,
      latitude,
      longitude,
      isDefault: !!isDefault,
    });

    res.json({ ok: true, message: "Address saved ✅", address: newAddress });
  } catch (err) {
    console.log("Add address error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/api/address/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await Address.findOneAndDelete({ _id: id, userId: req.userId });
    res.json({ ok: true, message: "Address deleted ✅" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/address/selected", authMiddleware, async (req, res) => {
  try {
    const selected = await Address.findOne({ userId: req.userId, isDefault: true });
    res.json({ ok: true, selected });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================================================
   ✅ Forgot Password
========================================================= */
app.post("/api/auth/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "ScanPay Password Reset",
      html: `
        <div style="font-family:Arial; padding:10px;">
          <h2>Reset Your Password</h2>
          <p>Click link to reset your ScanPay password:</p>
          <a href="${resetLink}" style="display:inline-block;background:black;color:white;padding:12px 18px;border-radius:8px;text-decoration:none;">Reset Password</a>
          <p style="margin-top:15px;">Or copy this link:</p>
          <p>${resetLink}</p>
          <p>This link expires in 15 minutes.</p>
        </div>
      `,
    });

    return res.json({ message: "Reset link sent to email ✅" });
  } catch (err) {
    console.log("Forgot password error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

/* =========================================================
   ✅ Reset Password API
========================================================= */
app.post("/api/auth/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword)
      return res.status(400).json({ message: "Token and new password required" });

    if (newPassword.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Token invalid or expired" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return res.json({ message: "Password reset successful ✅" });
  } catch (err) {
    console.log("Reset password error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

/* =========================================================
   ✅ Reset Password Page (HTML)
========================================================= */
app.get("/reset-password", (req, res) => {
  const token = req.query.token || "";

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>ScanPay Reset Password</title>
        <style>
          body{font-family:Arial;background:#f5f5f5;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;}
          .card{background:#fff;padding:25px;border-radius:14px;width:350px;box-shadow:0 8px 30px rgba(0,0,0,.1);}
          h2{margin:0 0 10px;}
          input{width:100%;padding:12px;margin-top:10px;border-radius:10px;border:1px solid #ddd;outline:none;}
          button{width:100%;padding:12px;border:none;border-radius:10px;background:#000;color:#fff;font-weight:bold;margin-top:15px;cursor:pointer;}
          .msg{margin-top:12px;font-size:14px;color:#333;}
        </style>
      </head>
      <body>
        <div class="card">
          <h2>Reset Password</h2>
          <p>Enter your new password</p>

          <input type="password" id="pass" placeholder="New Password (min 6)" />
          <button onclick="resetPassword()">Reset Password</button>

          <div class="msg" id="msg"></div>
        </div>

        <script>
          async function resetPassword(){
            const newPassword = document.getElementById("pass").value;
            const msg = document.getElementById("msg");

            if(!"${token}"){
              msg.innerHTML = "❌ Token missing";
              return;
            }

            if(!newPassword || newPassword.length < 6){
              msg.innerHTML = "❌ Password must be at least 6 characters";
              return;
            }

            msg.innerHTML = "⏳ Resetting password...";

            try{
              const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ token: "${token}", newPassword })
              });

              const data = await res.json();
              msg.innerHTML = data.message || "✅ Done";
            } catch(e){
              msg.innerHTML = "❌ Something went wrong";
            }
          }
        </script>
      </body>
    </html>
  `);
});

/* =========================================================
   ✅ Start Server
========================================================= */
if (require.main === module) {
  const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Backend running on port ${PORT}`);
});


}

module.exports = app;
