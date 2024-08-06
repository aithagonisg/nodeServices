const mongoose = require("mongoose");

const themeItemSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  themeName: String,
  themeValue: String,
});

const themeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    themeList: [themeItemSchema],
  },
  { strict: false, versionKey: false }
);

const themeModel = mongoose.model("theme", themeSchema, "theme");

module.exports = themeModel;
