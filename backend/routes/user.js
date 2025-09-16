const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { AuthenticateToken } = require("./userAuth");

// signup
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password, address } = req.body;

    if (username.length < 4) {
      return res.status(400).json({ message: "Username must be at least 4 characters long" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: "Username already exists" });

    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(400).json({ message: "Email already exists" });

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPass,
      address,
    });

    await newUser.save();
    return res.status(200).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// sign-in
router.post("/sign-in", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (!existingUser) return res.status(400).json({ message: "Invalid Credentials" });

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

    const payload = {
      id: existingUser._id,
      username: existingUser.username,
      role: existingUser.role,
    };

    const token = jwt.sign(payload, process.env.SECRET, {
      expiresIn: process.env.TIME || "7d",
    });

    // ✅ set cookie
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: true,        // only works on https
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      id: existingUser._id,
      role: existingUser.role,
      message: "Login successful",
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// get-user-information
router.get("/get-user-information", AuthenticateToken, async (req, res) => {
  try {
    const data = await User.findById(req.user.id).select("-password");
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// update user address
router.put("/update-address", AuthenticateToken, async (req, res) => {
  try {
    const { address } = req.body;
    await User.findByIdAndUpdate(req.user.id, { address });
    return res.status(200).json({ message: "Address updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// logout
router.post("/logout", (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });
  return res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;
