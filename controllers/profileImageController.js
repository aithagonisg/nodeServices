const usersModel = require("../models/usersModel");
const fs = require("fs").promises;

const addImagePath = async (userId, imagePath) => {
  const user = await usersModel.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  const updatedUser = await usersModel.findByIdAndUpdate(
    userId,
    {
      profileImage: `/uploads/${imagePath}`,
    },
    { new: true }
  );

  if (!updatedUser) {
    throw new Error("User not found or update failed");
  }
  return updatedUser.profileImage;
};

const deleteImagePath = async (userId) => {
  try {
    const user = await usersModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (user.profileImage) {
      const profilePath = user.profileImage.split("/uploads/")[1];
      await fs.unlink(`uploads/${profilePath}`);
      user.profileImage = "";
      await user.save();
      return "Profile image removed successfully";
    } else {
      return "No profile image to remove";
    }
  } catch (error) {
    console.error("Error removing profile image:", error);
    throw error;
  }
};

module.exports = {
  deleteImagePath,
  addImagePath,
};
