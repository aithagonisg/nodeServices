const themeModel = require("../models/themeModel");
const getTheme = async (req, res) => {
  try {
    const userId = req.body.userId;
    const themeData = await themeModel.findOne({ userId });

    if (themeData) {
      res.json(themeData.themeList);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Something went wrong, please check...",
    });
  }
};

const addTheme = async (req, res) => {
  try {
    const { userId, ...newTheme } = req.body;

    let themeData = await themeModel.findOne({ userId });

    if (themeData) {
      themeData.themeList.push(newTheme);
      await themeData.save();
    } else {
      themeData = await themeModel.create({
        userId,
        themeList: [newTheme],
      });
    }

    res.status(201).json({
      success: true,
      data: newTheme,
      message: "New Theme Added Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Something went wrong, please check...",
    });
  }
};

const updateTheme = async (req, res) => {
  try {
    const userId = req.body.userId;
    const { _id, ...updatedFields } = req.body.themeInfo;
    const themeData = await themeModel.findOne({ userId });
    if (themeData) {
      const themeIndex = themeData.themeList.findIndex(
        (theme) => theme._id.toString() === _id
      );

      if (themeIndex !== -1) {
        themeData.themeList[themeIndex] = {
          ...themeData.themeList[themeIndex],
          ...updatedFields,
        };

        await themeData.save();
        res.json({ success: true, message: "Theme updated successfully" });
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

const deleteTheme = async (req, res) => {
  try {
    const userId = req.body.userId;
    const themeId = req.body.themeId;

    const themeData = await themeModel.findOne({ userId });

    if (themeData) {
      const originalLength = themeData.themeList.length;
      themeData.themeList = themeData.themeList.filter(
        (theme) => theme._id.toString() !== themeId
      );

      if (themeData.themeList.length < originalLength) {
        await themeData.save();
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

module.exports = { getTheme, updateTheme, addTheme, deleteTheme };
