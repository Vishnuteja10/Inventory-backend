const bcrypt = require("bcrypt");
const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    console.log("inside login");
    console.log(req.body);

    const email = req.body.email;
    const password = req.body.password;

    bcrypt
      .hash(password, 10)
      .then((hash) => {
        console.log("hasged pwd", hash); // Output the hashed value
      })
      .catch((err) => {
        console.error("Error:", err);
      });

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const user = await User.findOne({ email });

    console.log("passwords are", password, user.password);

    if (!user) {
      return res.status(400).json({ error: "Invalid user or password" });
    }

    const passwordMatched = await bcrypt.compare(password, user.password);
    if (!passwordMatched) {
      return res.status(400).json({ error: "password didnt match" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);

    const userid = await user._id;

    res.redirect("/api/products");

    // res.json({
    //   success: true,
    //   user: user.email,
    //   token,
    //   userid,
    // });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

module.exports = {
  login,
};
