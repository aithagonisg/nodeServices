// controllers/cardController.js
const User = require("../models/cardDetailsModel");

// Add a new card to the user's card list
const addCard = async (req, res) => {
  try {
    const { userId, card } = req.body;

    let user = await User.findOne({ userId });

    if (!user) {
      // If user is not found, create a new user with the given userId and card
      user = new User({
        userId,
        cardsList: [card],
      });
    } else {
      // If user is found, push the new card to the cardsList array
      user.cardsList.push(card);
    }

    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error adding card", error });
  }
};

// Update an existing card in the user's card list
const updateCard = async (req, res) => {
  try {
    const { userId, cardId } = req.params;
    const user = await User.findOne({ userId });

    if (!user) return res.status(404).json({ message: "User not found" });

    const card = user.cardsList.id(cardId);
    if (!card) return res.status(404).json({ message: "Card not found" });

    Object.assign(card, req.body); // Update the card fields
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error updating card", error });
  }
};

// Delete a card from the user's card list
const deleteCard = async (req, res) => {
  try {
    const { userId, cardId } = req.params;
    const user = await User.findOne({ userId });

    if (!user) return res.status(404).json({ message: "User not found" });

    const card = user.cardsList.id(cardId);
    if (!card) return res.status(404).json({ message: "Card not found" });

    card.remove(); // Remove the card
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error deleting card", error });
  }
};

// Set a card as the active one
const makeAsActiveCard = async (req, res) => {
  try {
    const { userId, cardId } = req.params;
    const user = await User.findOne({ userId });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Set all cards as inactive
    user.cardsList.forEach((card) => {
      card.isActive = false;
    });

    const card = user.cardsList.id(cardId);
    if (!card) return res.status(404).json({ message: "Card not found" });

    // Set the selected card as active
    card.isActive = true;
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error setting active card", error });
  }
};

const getCardsList = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ userId });

    if (!user)
      return res.status(200).json({ message: "No Data", cardsList: [] });
    if (user)
      return res
        .status(200)
        .json({ message: "No Data", cardsList: user.cardsList });
  } catch {
    res.status(500).json({ message: "Error getting cardsList", error });
  }
};
module.exports = {
  addCard,
  updateCard,
  deleteCard,
  makeAsActiveCard,
  getCardsList,
};
