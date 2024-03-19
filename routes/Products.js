const express = require("express");
const router = express.Router();
const upload = require("../middlewares/ImageUpload");

const {
  addProduct,
  getAllProducts,
  updateProductDetails,
  deleteProduct,
} = require("../controllers/Products");

router.route("/addProduct").post(upload, addProduct);

router.route("/getAllProducts").get(getAllProducts);

router.route("/updateProduct/:id").post(upload, updateProductDetails);

router.route("/delete/:id").get(upload, deleteProduct);

module.exports = router;
