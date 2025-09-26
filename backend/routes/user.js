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

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      id: existingUser._id,
      role: existingUser.role,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Sign-in error:", error);
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

// update user profile
router.put("/update-profile", AuthenticateToken, async (req, res) => {
  try {
    const { username, email, address, avatar } = req.body;
    const userId = req.user.id;

    // Check if username is already taken by another user
    if (username) {
      const existingUser = await User.findOne({ username, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
    }

    // Check if email is already taken by another user
    if (email) {
      const existingEmail = await User.findOne({ email, _id: { $ne: userId } });
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (address) updateData.address = address;
    if (avatar) updateData.avatar = avatar;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// change password
router.put("/change-password", AuthenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current password and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters long" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(userId, { password: hashedNewPassword });

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// delete account
router.delete("/delete-account", AuthenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Delete user and all associated data
    await User.findByIdAndDelete(userId);
    
    // Clear the cookie (match options used when setting the cookie)
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      path: "/",
      // Do NOT set domain here; let it default to the current host so it matches the cookie that was set
    });

    return res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// logout
router.post("/logout", (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    path: "/",
    // Do NOT set domain; default to current host so it matches the cookie scope used on login
  });
  return res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;
