const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const usersSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  mobile: { type: String, required: false },
  role: { type: String, required: true },
  profileImage: {
    type: String,
    required: false,
  },
});

module.exports = usersSchema;
