const mongoose = require("mongoose");

const receiptSchema = new mongoose.Schema(
  {
    receiptId: String,
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    totalAmount: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Receipt", receiptSchema);