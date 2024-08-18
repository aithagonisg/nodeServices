// models/userCardModel.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const cardSchema = new Schema({
  cardNumber: {
    type: String,
    required: true,
  },
  cvv: {
    type: String,
    required: true,
  },
  expireDate: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});

const userCardSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  cardsList: [cardSchema],
});

const User = mongoose.model("UserCard", userCardSchema);

module.exports = User;
