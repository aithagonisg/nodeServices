const mongoose = require("mongoose");

const themeSchema = new mongoose.Schema(
  {},
  { strict: false, versionKey: false }
);

const themeModel = mongoose.model("theme", themeSchema, "theme");

module.exports = themeModel;
