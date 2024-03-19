const express = require("express");

const router = express.Router();

const {
  Home,
  Products,
  AddProduct,
  EditProduct,
  Categories,
  SubCategories,
} = require("../controllers/Pages");

router.route("/home").get(Home);

router.route("/products").get(Products);

router.route("/addProductPage").get(AddProduct);

router.route("/editProduct/:id").get(EditProduct);

router.route("/subCategories").get(SubCategories);

router.route("/categories").get(Categories);

module.exports = router;
