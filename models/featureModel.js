const mongoose = require("mongoose");

const featureItemSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  featureName: String,
  featureValue: Boolean,
});

const featureSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    featureList: [featureItemSchema],
  },
  { strict: false, versionKey: false }
);

// Define the model for the theme schema
const featureModel = mongoose.model(
  "featurerights",
  featureSchema,
  "featurerights"
);

module.exports = featureModel;
