const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  productImages: [String],
  description: {
    type: String,
  },
  skuId: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  },
  subCategory: {
    type: String,
  },
});

module.exports = mongoose.model("products", productSchema);
