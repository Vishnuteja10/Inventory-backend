const ProductModel = require("../models/ProductModel");
const express = require("express");
const fs = require("fs");
const path = require("path");

const addProduct = async (req, res) => {
  try {
    const { productName, description, skuId, category, subCategory } = req.body;
    const productImages = req?.files;
    const productImagePaths = productImages.map((image) => image.filename);
    console.log("image is", req.files);
    console.log(req.body);
    const Product = new ProductModel({
      productName,
      productImages: productImagePaths,
      description,
      skuId,
      category,
      subCategory,
    });
    await Product.save();

    req.session.message = {
      type: "Success",
      message: "Product added successfully",
    };

    // req.session.category = undefined;
    // req.session.subcategory = undefined;

    res.redirect("/api/getAllProducts");

    // res.json({ success: true, Product, message: "Product added successfully" });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      error: error,
      errorMessage: "Something went wrong!",
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const { category, subCategory } = req.query;

    console.log("category is", category, "sub cat", subCategory);
    let products;

    if (category) {
      products = await ProductModel.find({ category, subCategory });
    } else {
      products = await ProductModel.find({});
    }
    // res.json({ success: true, products });
    console.log("products are", products);
    res.render("Products", {
      title: "Products page",
      products,
      category,
      subcategory: subCategory,
    });
  } catch (error) {
    res.json({ success: false, error });
  }
};

const deleteDirectory = (directory) => {
  if (fs.existsSync(directory)) {
    fs.readdirSync(directory).forEach((file) => {
      const fullPath = path.join(directory, file);
      if (fs.lstatSync(fullPath).isDirectory()) {
        // Recursively remove subdirectories
        deleteDirectory(fullPath);
      } else {
        // Remove files
        fs.unlinkSync(fullPath);
      }
    });
    // Once all files and subdirectories are removed, delete the directory itself
    fs.rmdirSync(directory);
  }
};

const updateProductDetails = async (req, res) => {
  try {
    const { productName, description, subCategory, skuId, category } = req.body;
    const productId = req.params.id;

    const productImages = req?.files;
    const productImagePaths = productImages.map((image) => image.filename);

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      {
        $set: {
          productName,
          description,
          subCategory,
          category,
          productImages: productImagePaths,
          // productImages,
        },
      },
      { new: true }
    );

    if (updatedProduct) {
      req.session.message = {
        type: "success",
        message: "Product updated successfully!",
      };
      return res.redirect("/api/getAllProducts");
    }

    res.json({ success: false, message: "Product not found" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.json({ success: false, error: "Error updating product" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req?.params?.id;
    console.log("params", req?.params);
    console.log("product id", productId);
    const product = await ProductModel.findByIdAndDelete(productId);
    if (product) {
      req.session.message = {
        type: "Success",
        message: "Product deleted successfully",
      };
      const imagePath = path.join(
        __dirname,
        "..",
        "uploads",
        product?.category,
        product?.subCategory,
        product?.productName
      );

      console.log("image path is", imagePath);

      const deleteDirectory = (directory) => {
        fs.readdirSync(directory).forEach((file) => {
          const fullPath = path.join(directory, file);
          if (fs.lstatSync(fullPath).isDirectory()) {
            // Recursively remove subdirectories
            deleteDirectory(fullPath);
          } else {
            // Remove files
            fs.unlinkSync(fullPath);
          }
        });
        // Once all files and subdirectories are removed, delete the directory itself
        fs.rmdirSync(directory);
      };

      deleteDirectory(imagePath);

      res.redirect("/api/products");
    }

    // res.json({ success: true, product });
  } catch (error) {
    res.json({ success: false, error });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  updateProductDetails,
  deleteProduct,
};
