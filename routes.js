const express = require("express");
const {
  login,
  register,
  getUsers,
  getUserInfo,
  updateUserInfo,
} = require("./controllers/usersController");
const {
  getProducts,
  getProduct,
  addProductToCart,
  removeProductFromCart,
  removeAllProductsFromCart,
  getOrders,
  placeTheOrder,
  getCategories,
  getProductsFromCart,
} = require("./controllers/productsController");
const {
  getTheme,
  updateTheme,
  addTheme,
  deleteTheme,
} = require("./controllers/themeController");
const {
  updateFeature,
  getFeature,
  addFeature,
  deleteFeature,
} = require("./controllers/featureController");

const { profileUpload } = require("./middlewares/profileStorage");
const {
  addImagePath,
  deleteImagePath,
} = require("./controllers/profileImageController");

const {
  addAddress,
  updateAddress,
  deleteAddress,
  makeAsActiveAddress,
  getAddressList,
} = require("./controllers/addressController");

const {
  addCard,
  updateCard,
  deleteCard,
  makeAsActiveCard,
  getCardsList,
} = require("./controllers/cardDetailsController");
const { autherization } = require("./middlewares/middleware");

const router = express.Router();
// common routes
router.post("/v1/common/register", register);

router.post("/v1/common/login", login);

router.get("/v1/common/getUsers", autherization, getUsers);

router.post("/v1/common/products", autherization, getProducts);

router.get("/v1/common/product", autherization, getProduct);

router.post("/v1/common/:userId/profile-image", autherization, (req, res) => {
  const userId = req.params.userId;
  profileUpload(userId).single("image")(req, res, async function (err) {
    console.log(req);
    if (err) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    const file = req.file;
    if (!file) {
      return res.status(400).send("No file uploaded.");
    }
    const path = await addImagePath(userId, file.filename);
    res
      .status(200)
      .send({ image: path, message: "profile image uploaded successfully." });
  });
});

router.delete(
  "/v1/common/:userId/profile-image",
  autherization,
  async (req, res) => {
    const { userId } = req.params;
    try {
      const updatedUser = await deleteImagePath(userId);
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.post("/v1/user/get-user-info", autherization, getUserInfo);

router.post("/v1/user/update-user-info", autherization, updateUserInfo);

router.post("/v1/user/theme", autherization, getTheme);

router.post("/v1/user/feature", autherization, getFeature);

router.post("/v1/user/get-from-cart", autherization, getProductsFromCart);

router.post("/v1/user/add-to-cart", autherization, addProductToCart);

router.post("/v1/user/remove-from-cart", autherization, removeProductFromCart);

router.post(
  "/v1/user/remove-all-from-cart",
  autherization,
  removeAllProductsFromCart
);

router.post("/v1/user/getOrders", autherization, getOrders);

router.post("/v1/user/place-the-order", autherization, placeTheOrder);

router.get("/v1/user/getCategories", autherization, getCategories);

router.post("/v1/user/add-address", autherization, addAddress);
router.post("/v1/user/update-address", autherization, updateAddress);
router.post("/v1/user/delete-address", autherization, deleteAddress);
router.post("/v1/user/make-address-active", autherization, makeAsActiveAddress);
router.post("/v1/user/get-address-list", autherization, getAddressList);

router.post("/v1/user/add-card", autherization, addCard);
router.post("/v1/user/update-card", autherization, updateCard);
router.post("/v1/user/delete-card", autherization, deleteCard);
router.post("/v1/user/make-card-active", autherization, makeAsActiveCard);
router.post("/v1/user/get-card-list", autherization, getCardsList);

// admin routes

router.post("/v1/admin/add-theme", autherization, addTheme);

router.post("/v1/admin/delete-theme", autherization, deleteTheme);

router.post("/v1/admin/update-theme", autherization, updateTheme);

router.post("/v1/admin/add-feature", autherization, addFeature);

router.post("/v1/admin/delete-feature", autherization, deleteFeature);

router.post("/v1/admin/update-feature", autherization, updateFeature);

module.exports = router;
