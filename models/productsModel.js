const mongoose = require("mongoose");
const productSchema = require("../schemas/productSchema");

module.exports = mongoose.model("products", productSchema, "products");
