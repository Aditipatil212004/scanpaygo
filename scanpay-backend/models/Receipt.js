const mongoose = require("mongoose");

const receiptSchema = new mongoose.Schema({
  receiptId: String,
  orderId: String,

  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
  },

  totalAmount: Number,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Receipt", receiptSchema);