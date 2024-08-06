const usersModel = require("../models/usersModel");
const { authentication } = require("../middlewares/middleware");
const usersCart = require("../models/userCartModel");
const featureModel = require("../models/featureModel");
const themeModel = require("../models/themeModel");

const login = async (req, res) => {
  try {
    const user = await usersModel.findOne({
      email: req.body.email,
      password: req.body.password,
    });

    if (user) {
      const token = await authentication({
        email: user.email,
        role: user.role,
      });
      res.status(200).json({
        userId: user._id,
        message: "Login successful",
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        mobile: user.mobile,
        role: user.role,
        authToken: token,
        profileImage: user?.profileImage,
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const register = async (req, res) => {
  const user = await usersModel.create({ ...req.body, profileImage: "" });
  if (user) {
    const token = await authentication({
      email: user.email,
      role: user.role,
    });

    const userCart = await new usersCart({
      userId: user._id,
      productDetails: [],
    });
    await userCart.save();

    const featureList = await new featureModel({
      userId: user._id,
      featureList: [],
    });
    await featureList.save();

    const themeList = await new themeModel({
      userId: user._id,
      themeList: [],
    });

    await themeList.save();

    res.json({
      userId: user._id,
      message: "Registered successful",
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      mobile: user.mobile,
      role: user.role,
      authToken: token,
      profileImage: user?.profileImage,
    });
  } else {
    res.status(404).json({ error: "Something went wrong" });
  }
};

module.exports = { login, register };
