const router = require('express').Router();
const User = require('../models/user');

// sign up
router.post('/signup', async (req, res) => {
try{
const {username, email, password, address} = req.body;
// 
// check username length is more than 4
if(username.length <4){
    return res.status(400).json({ message: "Username must be at least 4 characters long" });
}
// check username is already exists
const existingUser = await User.find({username: username});
if(existingUser){
  return res.status(400).json({message : "username already exists"});
}

// check email is already exists
const existingEmail = await User.find({email: email});
if(existingEmail){
  return res.status(400).json({message : "email already exists"});
}

// check password length is more than 6
if(password.length < 6){
    return res.status(400).json({ message: "Password must be at least 6 characters long" });    
}

// create new user
const newUser = new User({
    username: username,
    email: email,
    password: password,
    address: address
});

await newUser.save();  // save user to database
return res.status(200).json({message: "User created successfully", user: newUser});
}
catch(error){
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})
module.exports = router;
