const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: String, // Razorpay order_id
    paymentId: String, // Razorpay payment_id
    signature: String,

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },

    items: [
      {
        barcode: String,
        name: String,
        price: Number,
        qty: Number,
      },
    ],

    subtotal: Number,
    tax: Number,
    totalAmount: Number,

    status: {
      type: String,
      enum: ["paid", "failed"],
      default: "paid",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);