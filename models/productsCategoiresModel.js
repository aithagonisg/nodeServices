const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {},
  { strict: false, versionKey: false }
);

const categoryModel = mongoose.model(
  "productscategory",
  categorySchema,
  "productscategory"
);

module.exports = categoryModel;
