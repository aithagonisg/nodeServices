// controllers/userController.js
const User = require("../models/userAddressModel");

// Add a new address to the user's address list
const addAddress = async (req, res) => {
  try {
    const { userId, address } = req.body;

    let user = await User.findOne({ userId });

    if (!user) {
      // If user is not found, create a new user with the given userId and address
      user = new User({
        userId,
        addresses: [address],
      });
    } else {
      // If user is found, push the new address to the addresses array
      user.addresses.push(address);
    }

    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error adding address", error });
  }
};

// Update an existing address in the user's address list
const updateAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const user = await User.findOne({ userId });

    if (!user) return res.status(404).json({ message: "User not found" });

    const address = user.addresses.id(addressId);
    if (!address) return res.status(404).json({ message: "Address not found" });

    Object.assign(address, req.body); // Update the address fields
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error updating address", error });
  }
};

// Delete an address from the user's address list
const deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const user = await User.findOne({ userId });

    if (!user) return res.status(404).json({ message: "User not found" });

    const address = user.addresses.id(addressId);
    if (!address) return res.status(404).json({ message: "Address not found" });

    address.remove(); // Remove the address
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error deleting address", error });
  }
};

// Set an address as the active one
const makeAsActiveAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const user = await User.findOne({ userId });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Set all addresses as inactive
    user.addresses.forEach((address) => {
      address.active = false;
    });

    const address = user.addresses.id(addressId);
    if (!address) return res.status(404).json({ message: "Address not found" });

    // Set the selected address as active
    address.active = true;
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error setting active address", error });
  }
};

const getAddressList = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findOne({ userId });

    if (!user)
      return res.status(200).json({ message: "No Data", addressList: [] });
    if (user)
      return res
        .status(200)
        .json({ message: "All Addresses", addressList: user.addresses });
  } catch (error) {
    res.status(500).json({ message: "something went wrong", error });
  }
};

module.exports = {
  addAddress,
  updateAddress,
  deleteAddress,
  makeAsActiveAddress,
  getAddressList,
};
