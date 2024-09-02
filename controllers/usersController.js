const usersModel = require("../models/usersModel");
const { authentication } = require("../middlewares/middleware");
const usersCart = require("../models/userCartModel");
const featureModel = require("../models/featureModel");
const themeModel = require("../models/themeModel");
const OrderModel = require("../models/orders");

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
        authToken: `Bearer ${token}`,
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

    const ordersList = await new OrderModel({
      userId: user._id,
      orderDetails: [],
    });
    await ordersList.save();

    res.json({
      userId: user._id,
      message: "Registered successful",
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      mobile: user.mobile,
      role: user.role,
      authToken: `Bearer ${token}`,
      profileImage: user?.profileImage,
    });
  } else {
    res.status(404).json({ error: "Something went wrong" });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await usersModel.aggregate([
      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
        },
      },
      {
        $addFields: { userId: "$_id" },
      },
      {
        $project: {
          _id: 0,
          userId: 1,
          firstName: 1,
          lastName: 1,
        },
      },
    ]);

    const userList = users.map((item) => ({
      userId: item.userId,
      userName: `${item.firstName} ${item.lastName}`,
    }));

    res.status(200).json(userList);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

const getUserInfo = async (req, res) => {
  const userId = req.body.userId;
  const userInfo = await usersModel.find({ _id: userId }, { password: 0 });
  res.status(200).json(userInfo);
};

const updateUserInfo = async (req, res) => {
  const userId = req.body.userId;
  const updatedUserInfo = req.body.userInfo;
  const userInfo = await usersModel.findOne({ _id: userId });
  if (userInfo) {
    Object.assign(userInfo, updatedUserInfo);
    await userInfo.save();
    res.status(200).json({ message: "User Info is Updated Successfully" });
  } else {
    res.status(401).json({ message: "User Not found" });
  }
};
module.exports = { login, register, getUsers, getUserInfo, updateUserInfo };
