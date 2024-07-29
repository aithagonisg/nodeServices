const themeModel = require("../models/themeModel");
const getTheme = async (req, res) => {
  const theme = await themeModel.find({});
  res.json(theme);
};

const addTheme = async (req, res) => {
  try {
    const newTheme = await themeModel.create(req.body);
    res.status(201).json({ success: true, data: newTheme });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateTheme = async (req, res) => {
  try {
    const themesToUpdate = req.body;
    const updatePromises = themesToUpdate.map(async (theme) => {
      const featureId = theme._id;
      const updateResult = await themeModel.findOneAndUpdate(
        { _id: featureId },
        { $set: theme },
        { new: true }
      );
      return updateResult;
    });

    const results = await Promise.all(updatePromises);

    const modifiedThemes = results.filter((result) => result);

    if (modifiedThemes.length > 0) {
      res.json({ success: true, message: "Themes updated successfully" });
    } else {
      res.json({ success: false, message: "No themes were updated" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteTheme = async (req, res) => {
  try {
    const deleteResult = await themeModel.deleteOne({
      _id: req.body._id,
    });
    if (deleteResult.deletedCount > 0) {
      res.json({ success: true, message: "Feature deleted successfully" });
    } else {
      res.json({ success: false, message: "Feature not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = { getTheme, updateTheme, addTheme, deleteTheme };
