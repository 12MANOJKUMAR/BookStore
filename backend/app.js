const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
require("./conn/conn");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",             // dev
  process.env.FRONTEND_URL,  // prod
];

// ✅ Middleware
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"], // allowed methods
    credentials: true, // cookies / headers allow karega
  })
);
app.use(express.json());
app.use(cookieParser());

// ✅ Import routes
const User = require("./routes/user");
const Books = require("./routes/book");
const Favourite = require("./routes/favourite");
const Cart = require("./routes/cart");
const Order = require("./routes/order");

// ✅ Use routes
app.use("/api/v1", User);
app.use("/api/v1", Books);
app.use("/api/v1", Favourite);
app.use("/api/v1", Cart);
app.use("/api/v1", Order);

// ✅ Server
const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
