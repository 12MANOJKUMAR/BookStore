const router = require("express").Router();
const User = require("../models/user");
const Book = require("../models/book");
const jwt = require("jsonwebtoken");
const {AuthenticateToken} = require("./userAuth");

// add book - admin
router.post("/add-book", AuthenticateToken, async(req, res)=>{
  try{
      //  check the user is admin or not--
      const {id}= req.headers;
      const user = await User.findById(id);
      if(user.role!=="admin"){
        return res.status(400).json({message :"You do not have admin access..."})
      }
    const book = new Book({
      url: req.body.url,
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      desc: req.body.desc,
      language: req.body.language
    });

    await book.save();
    return res.status(200).json({message:"book added..."})

  }
  catch(error){
  console.error(error);
   return res.status(500).json({message:"Internal Server Error"});
  }
})

// update-book- admin

router.put("/update-book",AuthenticateToken, async(req, res)=>{
  try{
    const {bookId}= req.headers;
    await Book.findByIdAndUpdate(bookId,{
      url: req.body.url,
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      desc: req.body.desc,
      language: req.body.language
    })

    return res.status(200).json({message: "book updated successfully..."})
  }
  catch(error){
    console.error(error);
    return res.status(500).json({message: "Internal Server Error"});
  }
})

// delete-book(admin)
router.delete("/delete-book",AuthenticateToken, async(req, res)=>{
  try{
    const {bookId} = req.headers;
    await Book.findByIdAndDelete(bookId);
    return res.status(200).json({message: "Book is deleted"});

  }
  catch(error){
    console.error(error);
    res.status(500).json({message:"An error occured"});
  }
})

// get all books
router.get("/get-all-books",  async(req, res)=>{
  try{
    const books = await Book.find().sort({createdAt:-1});
    return res.json({
      status:"success",
      data : books
    })
  }catch(error){
    console.error(error);
    return res.status(500).json({message:"an error occured..."})
  }
})

// get-recently-added-books
router.get("/recent-books",  async(req, res)=>{
  try{
     const books = await Book.find().sort({createdAt:-1 }).limit(4);
     return res.json({
      status:"success",
      data : books
     })
  }catch(error){
    console.error(error);
    return res.status(500).json({message:"An error occured"});
  }
})

// get the details of a particular book

router.get("/get-book/:id", async(req, res)=>{
  try{
    const {id}= req.params;
    const book = await Book.findById(id);
    return res.json({
      status:"success",
      data:book
    })
  }catch(error){
    console.log(error);
    return res.status(500).json({message:"An error occured..."})
  }
})
module.exports = router;
