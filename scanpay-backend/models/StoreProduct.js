const mongoose = require("mongoose");

const storeProductSchema = new mongoose.Schema({
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true,
    index: true,
  },

  barcode: {
    type: String,
    required: true,
    index: true,
  },

  name: String,
  brand: String,
  gender: String,
  price: Number,
  color: String,
  stock: {
    type: Number,
    default: 999,
  },
});

module.exports = mongoose.model("StoreProduct", storeProductSchema);
