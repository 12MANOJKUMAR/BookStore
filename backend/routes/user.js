const router = require("express").Router();
const user = require("../models/user");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {AuthenticateToken} = require("./userAuth");

// sign up
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password, address } = req.body; //
    //
    // check username length is more than 4
    if (username.length < 4) {
      return res
        .status(400)
        .json({ message: "Username must be at least 4 characters long" });
    }
    // check username is already exists
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      return res.status(400).json({ message: "username already exists" });
    }

    // check email is already exists
    const existingEmail = await User.findOne({ email: email });
    if (existingEmail) {
      return res.status(400).json({ message: "email already exists" });
    }

    // check password length is more than 6
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // hash password before the creation of new user
    const hashedPass = await bcrypt.hash(password, 10);
    // create new user
    const newUser = new User({
      username: username,
      email: email,
      password: hashedPass,
      address: address,
    });

    await newUser.save(); // save user to database
    return res
      .status(200)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// sign-in
router.post("/sign-in", async (req, res) => {
  try {
    const { username, password } = req.body;

    // check that its already a user or not?
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // if it is user
    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
     const payload = {
      id: existingUser._id,
      username: existingUser.username,
      role: existingUser.role
    };

    // Create JWT
    const token = jwt.sign(payload, process.env.SECRET, {
      expiresIn: process.env.TIME // e.g. "1h"
    });
    return res
      .status(200)
      .json({ id: existingUser._id, role: existingUser.role, token: token });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
// get-user-information
router.get("/get-user-information", AuthenticateToken, async(req, res)=>{
 try{
    const {id} = req.headers;
    const data = await User.findById(id).select('-password'); //isase password display nhi hoga
    return res.status(200).json(data); 
 }
 catch(error){
  return res.status(500).json({message : "Internal Server Error"}); 
 }
})

// update user address
router.put("/update-address",AuthenticateToken, async(req, res)=>{
try{
     const {id} =req.headers;
     const {address}= req.body;
     await User.findByIdAndUpdate(id, {address:address});
     return res.status(200).json({message: "address updated successfully"}); 
}catch(error){
  return res.status(500).json({message: "Internal server error"});
}
})


module.exports = router;