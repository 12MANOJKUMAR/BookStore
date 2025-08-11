const express= require('express');
const app = express();
require('dotenv').config();
require('./conn/conn');
const User = require("./routes/user")
const Books = require("./routes/book");
const Favourite = require("./routes/favourite");

app.use(express.json());

// routes
app.use("/api/v1" , User);
app.use("/api/v1", Books);
app.use("/api/v1", Favourite);



//creating port
app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
}) 