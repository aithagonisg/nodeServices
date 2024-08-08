const Orders = require("../models/orders");
const Product = require("../models/productsModel");
const UserCart = require("../models/userCartModel");

// Controller function to get a list of products with pagination, search, and filtering
const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      categories,
      brand,
      priceMin,
      priceMax,
      search,
    } = req.body; // Assuming categories come in the request body
    const filters = {};
    if (categories?.length > 0) {
      // If categories is provided as an array, create an array of conditions
      filters.category = Array.isArray(categories)
        ? { $in: categories }
        : categories;
    }
    if (brand) filters.brand = brand;
    if (priceMin && priceMax)
      filters.price = { $gte: priceMin, $lte: priceMax };
    else if (priceMin) filters.price = { $gte: priceMin };
    else if (priceMax) filters.price = { $lte: priceMax };
    if (search) filters.title = { $regex: new RegExp(search, "i") };

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
    };

    const products = await Product.paginate(filters, options);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProduct = async (req, res) => {
  const productId = req.query.productId;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const addProductToCart = async (req, res) => {
  try {
    const userId = req.body.userId;
    const productDetails = req.body.productDetails;

    // Check if the user's cart already exists
    let userCart = await UserCart.findOne({ userId: userId });

    if (userCart) {
      // If the cart exists, add the new product details to the array
      userCart.productDetails.push(productDetails);
    } else {
      // If the cart doesn't exist, create a new cart for the user
      userCart = new UserCart({
        userId: userId,
        productDetails: [productDetails],
      });
    }
    // Save the changes
    await userCart.save();

    res
      .status(200)
      .json({ message: "Product added to cart successfully", userCart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

const removeProductFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    // Remove the product from the user's cart
    const result = await UserCart.updateOne(
      { userId: userId },
      { $pull: { productDetails: { productId: productId } } }
    );

    if (result.modifiedCount > 0) {
      res
        .status(200)
        .json({ message: "Product removed from cart successfully" });
    } else {
      res.status(404).json({
        message: "Product not found in cart or user cart does not exist",
      });
    }
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

const removeAllProductsFromCart = async (req, res) => {
  try {
    const { userId } = req.body;

    // Update and return the updated document
    const updatedCart = await UserCart.findOneAndUpdate(
      { userId: userId },
      { $set: { productDetails: [] } },
      { new: true } // Return the modified document
    );

    console.log("Updated Cart:", updatedCart);

    if (updatedCart) {
      res.status(200).json({
        message: "All products removed from cart successfully",
        cart: updatedCart,
      });
    } else {
      res.status(404).json({ message: "User cart does not exist" });
    }
  } catch (error) {
    console.error("Error removing all products from cart:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

const getOrders = async (req, res) => {
  const userId = req.body.userId;
  let orders = await Orders.findOne({ userId: userId });

  // Iterate through each order and check delivery status
  orders.orderDetails = orders.orderDetails.map((order) => {
    order.orderMeta.isDelivered =
      new Date() > new Date(order.orderMeta.expectedDeliveryDate);
    return order;
  });

  return res.status(200).send(orders.orderDetails);
};

const placeTheOrder = async (req, res) => {
  try {
    const userId = req.body.userId;
    const orderDetails = req.body.orderDetails;
    const paymentDetails = req.body.paymentDetails;

    // Check if the user's cart already exists
    let orders = await Orders.findOne({ userId: userId });

    if (orders) {
      orders.orderDetails.push({
        orderInfo: orderDetails,
        paymentDetails: paymentDetails,
      });
    } else {
      // If the cart doesn't exist, create a new cart for the user
      orders = new Orders({
        userId: userId,
        orderDetails: [
          {
            orderInfo: orderDetails,
            paymentDetails: paymentDetails,
          },
        ],
      });
    }
    // Save the changes
    await orders.save();

    res
      .status(200)
      .json({ message: "Product added to cart successfully", orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

module.exports = {
  getProducts,
  getProduct,
  addProductToCart,
  removeProductFromCart,
  removeAllProductsFromCart,
  placeTheOrder,
  getOrders,
};
