const multer = require("multer");
const path = require("path");
const fs = require("fs");

let storage = multer.diskStorage({
  destination: function (req, res, cb) {
    console.log("inside multer", req.body);
    const category = req?.body?.category;
    const subcategory = req?.body?.subCategory;
    const productName = req?.body?.productName;

    const uploadDir = path.join(
      __dirname,
      "..",
      "uploads",
      category,
      subcategory,
      productName
    );

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

let upload = multer({
  storage: storage,
}).array("productImages", 10);

module.exports = upload;
