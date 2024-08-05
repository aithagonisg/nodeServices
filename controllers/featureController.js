const featureModel = require("../models/featureModel");

const getFeature = async (req, res) => {
  const feature = await featureModel.find({});
  res.json(feature);
};

const addFeature = async (req, res) => {
  try {
    const newFeature = await featureModel.create(req.body);
    res.status(201).json({
      success: true,
      data: newFeature,
      message: "New right Added successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Something went wrong please check...",
    });
  }
};

const updateFeature = async (req, res) => {
  try {
    const featuresToUpdate = req.body;
    const updatePromises = featuresToUpdate.map(async (feature) => {
      const featureId = feature._id;
      const updateResult = await featureModel.findOneAndUpdate(
        { _id: featureId },
        { $set: feature },
        { new: true }
      );
      return updateResult;
    });
    const results = await Promise.all(updatePromises);

    const modifiedFeatures = results.filter((result) => result);
    if (modifiedFeatures.length > 0) {
      res.json({ success: true, message: "Features updated successfully" });
    } else {
      res.json({ success: false, message: "No features were updated" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Something went wrong please check...",
    });
  }
};

const deleteFeature = async (req, res) => {
  try {
    const deleteResult = await featureModel.deleteOne({
      _id: req.body._id,
    });
    if (deleteResult.deletedCount > 0) {
      res.json({ success: true, message: "Feature deleted successfully" });
    } else {
      res.json({ success: false, message: "Feature not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Something went wrong please check...",
    });
  }
};

module.exports = { getFeature, updateFeature, addFeature, deleteFeature };
