const express = require("express");
const { login, register, getUsers } = require("./controllers/usersController");
const {
  getProducts,
  getProduct,
  addProductToCart,
  removeProductFromCart,
  removeAllProductsFromCart,
  getOrders,
  placeTheOrder,
  getCategories,
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

const router = express.Router();
// common routes
router.post("/v1/common/register", register);

router.post("/v1/common/login", login);

router.get("/v1/common/getUsers", getUsers);

router.post("/v1/common/products", getProducts);

router.get("/v1/common/product", getProduct);

router.post("/v1/common/:userId/profile-image", (req, res) => {
  const userId = req.params.userId;
  profileUpload(userId).single("image")(req, res, async function (err) {
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

router.delete("/v1/common/:userId/profile-image", async (req, res) => {
  const { userId } = req.params;
  try {
    const updatedUser = await deleteImagePath(userId);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/v1/user/theme", getTheme);

router.post("/v1/user/feature", getFeature);

router.post("/v1/user/add-to-cart", addProductToCart);

router.post("/v1/user/remove-from-cart", removeProductFromCart);

router.post("/v1/user/remove-all-from-cart", removeAllProductsFromCart);

router.post("/v1/user/getOrders", getOrders);

router.post("/v1/user/place-the-order", placeTheOrder);

router.get("/v1/user/getCategories", getCategories);

// admin routes

router.post("/v1/admin/add-theme", addTheme);

router.post("/v1/admin/delete-theme", deleteTheme);

router.post("/v1/admin/update-theme", updateTheme);

router.post("/v1/admin/add-feature", addFeature);

router.post("/v1/admin/delete-feature", deleteFeature);

router.post("/v1/admin/update-feature", updateFeature);

module.exports = router;
