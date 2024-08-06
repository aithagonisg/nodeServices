const featureModel = require("../models/featureModel");

const getFeature = async (req, res) => {
  try {
    const userId = req.body.userId;
    const featureData = await featureModel.findOne({ userId });
    if (featureData) {
      res.status(200).json({
        success: true,
        data: featureData.featureList,
        message: "Features retrieved successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No features found for this user",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Something went wrong, please check...",
    });
  }
};

const addFeature = async (req, res) => {
  try {
    const { userId, ...newFeature } = req.body;

    let existingFeatureData = await featureModel.findOne({
      userId: userId,
    });

    if (existingFeatureData) {
      existingFeatureData.featureList.push(newFeature);
      await existingFeatureData.save();
    } else {
      existingFeatureData = await featureModel.create({
        userId: userId,
        featureList: [newFeature],
      });
    }

    res.status(201).json({
      success: true,
      data: newFeature,
      message: "New Feature Added Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Something went wrong, please check...",
    });
  }
};

const updateFeature = async (req, res) => {
  try {
    const userId = req.body.userId;
    const { _id, ...updatedFields } = req.body.featureInfo;

    const featureData = await featureModel.findOne({ userId });

    if (featureData) {
      const featureIndex = featureData.featureList.findIndex(
        (feature) => feature._id.toString() === featureId
      );

      if (featureIndex !== -1) {
        featureData.featureList[featureIndex] = {
          ...featureData.featureList[featureIndex],
          ...updatedFields,
        };
        await featureData.save();
        res.json({ success: true, message: "Feature updated successfully" });
      } else {
        res.json({ success: false, message: "Feature not found" });
      }
    } else {
      res.json({ success: false, message: "No features found for user" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Something went wrong, please check...",
    });
  }
};

const deleteFeature = async (req, res) => {
  try {
    const userId = req.body.userId;
    const featureId = req.body.featureId;

    const featureData = await themeModel.findOne({ userId });

    if (featureData) {
      const originalLength = featureData.themeList.length;
      featureData.themeList = featureData.themeList.filter(
        (theme) => theme._id.toString() !== featureId
      );

      if (featureData.themeList.length < originalLength) {
        await featureData.save();
        res.json({ success: true, message: "Theme deleted successfully" });
      } else {
        res.json({ success: false, message: "Theme not found" });
      }
    } else {
      res.json({ success: false, message: "No themes found for user" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Something went wrong, please check...",
    });
  }
};

module.exports = { getFeature, updateFeature, addFeature, deleteFeature };
