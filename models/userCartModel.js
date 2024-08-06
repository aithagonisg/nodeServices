const mongoose = require("mongoose");

const productDetailsSchema = new mongoose.Schema({
  productId: String,
  title: String,
  description: String,
  price: Number,
  discountPercentage: Number,
  rating: Number,
  stock: Number,
  brand: String,
  category: String,
  image_url: String,
  quantity: Number,
  totalPrice: Number,
  inCart: Boolean,
  colors: String,
  sizes: String,
});

const userCartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    productDetails: [productDetailsSchema],
  },
  { versionKey: false }
);

const usersCart = mongoose.model("usercart", userCartSchema, "usercart");

module.exports = usersCart;
