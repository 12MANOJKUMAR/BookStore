const express = require("express");
const router = express.Router();
const { AuthenticateToken } = require("./userAuth");
const User = require("../models/user");

// ✅ Get current user's cart
router.get("/cart", AuthenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("cart"); // populate if you want book details
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ cart: user.cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Add to cart
router.put("/cart", AuthenticateToken, async (req, res) => {
  try {
    const { bookId } = req.body;
    if (!bookId) {
      return res.status(400).json({ message: "Book ID is required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.cart.includes(bookId)) {
      return res.status(200).json({ message: "Book already in cart" });
    }

    user.cart.push(bookId);
    await user.save();

    res.status(201).json({ message: "Book added to cart", cart: user.cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Remove from cart
router.put("/cart/:bookId", AuthenticateToken, async (req, res) => {
  try {
    const { bookId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.cart.includes(bookId)) {
      return res.status(400).json({ message: "Book is not in cart" });
    }

    await User.findByIdAndUpdate(req.user.id, { $pull: { cart: bookId } });

    res.status(200).json({ message: "Book removed from cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
