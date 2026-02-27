const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: String,
    paymentId: String,
    signature: String,

    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },

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
    status: { type: String, default: "paid" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);