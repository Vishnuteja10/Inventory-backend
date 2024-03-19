const ProductModel = require("../models/ProductModel");

const Home = async (req, res) => {
  res.render("Home");
};

const Categories = async (req, res) => {
  try {
    const categories = await ProductModel.distinct("category");

    res.render("Categories", {
      categories: categories || [],
    });
  } catch (error) {
    res.json({ success: false, error });
  }
};

const SubCategories = async (req, res) => {
  try {
    const { category, subcategory } = req.query;

    console.log("Category is", category);
    console.log("Subcategory is", subcategory);

    let query = {};

    if (category) {
      query.category = category;
    }

    if (subcategory) {
      query.subcategory = subcategory;
    }

    let products = await ProductModel.find(query);

    console.log("Products:", products);

    let subcategories = [];
    if (category) {
      subcategories = await ProductModel.aggregate([
        { $match: { category: category } },
        { $group: { _id: "$subCategory" } },
      ]);
      subcategories = subcategories.map((entry) => entry._id);
    }
    console.log("sub categories ", subcategories);
    res.render("SubCategory", {
      products,
      category,
      subcategories,
    });
  } catch (error) {
    res.json({ success: false, error });
  }
};

const Products = async (req, res) => {
  try {
    const products = await ProductModel.find({});
    // res.json({ success: true, products });
    console.log("products are", products);
    res.render("Products", {
      title: "Products page",
      products: products || [],
      category: undefined,
      subcategory: undefined,
    });
  } catch (error) {
    res.json({ success: false, error });
  }
};

const AddProduct = async (req, res) => {
  try {
    const { category, subcategory } = req.query;
    console.log("add product", category, subcategory);
    if (category || subcategory) {
      res.render("AddProduct", {
        category,
        subcategory,
      });
    } else {
      res.render("AddProduct", {
        category: undefined,
        subcategory: undefined,
      });
    }
  } catch (error) {
    res.json({ success: false, error });
  }
};

const EditProduct = async (req, res) => {
  try {
    const id = req?.params?.id;
    const Product = await ProductModel.findById(id);
    if (Product == null) {
      res.redirect("/api/products");
    } else {
      res.render("Edit", {
        Product: Product,
        category: Product?.category,
        subcategory: Product?.subCategory,
      });
    }
  } catch (error) {
    res.json({ success: false, error });
  }
};
module.exports = {
  Home,
  Products,
  AddProduct,
  EditProduct,
  Categories,
  SubCategories,
};
