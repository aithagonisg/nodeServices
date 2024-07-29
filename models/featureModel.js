const mongoose = require("mongoose");

const featureSchema = new mongoose.Schema(
  {},
  { strict: false, versionKey: false }
);

// Define the model for the theme schema
const featureModel = mongoose.model(
  "featurerights",
  featureSchema,
  "featurerights"
);

module.exports = featureModel;
