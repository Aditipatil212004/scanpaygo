const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    ProductID: { type: Number, index: true },
    ProductName: String,
    ProductBrand: String,
    Gender: String,
    "Price (INR)": Number,
    PrimaryColor: String,
  },
  { strict: false } // VERY IMPORTANT
);

module.exports = mongoose.model("Product", productSchema);
