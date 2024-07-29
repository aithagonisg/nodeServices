const mongoose = require("mongoose");
const userSchema = require("../schemas/usersSchema");

const usersModel = mongoose.model("users", userSchema, "users");

module.exports = usersModel;
