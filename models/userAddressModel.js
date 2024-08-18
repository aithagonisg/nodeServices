// models/user.js
const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  hno: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  country: { type: String, required: true },
  active: { type: Boolean, default: false },
  mobile: { type: String, required: true },
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Unique _id for each address
});

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  addresses: [addressSchema],
});

const UserAddress = mongoose.model("useraddresses", userSchema);

module.exports = UserAddress;
