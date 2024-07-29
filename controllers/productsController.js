// controllers/productController.js

const Product = require("../models/productsModel");

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
    if (categories.length > 0) {
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

module.exports = { getProducts, getProduct };
