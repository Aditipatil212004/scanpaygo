const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  barcode: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: String,
  price: Number,
});

module.exports = mongoose.model("Product", productSchema);
