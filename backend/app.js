const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
require("./conn/conn");

const app = express();

// ✅ Allowed Origins
const allowedOrigins = [
  "http://localhost:5173",                  // Dev frontend
  "https://book-store-two-sage.vercel.app", // Prod frontend
  process.env.FRONTEND_URL                  // Fallback from env
];

// ✅ Middleware
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
const User = require("../routes/user");
const Books = require("../routes/book");
const Favourite = require("../routes/favourite");
const Cart = require("../routes/cart");
const Order = require("../routes/order");

app.use("/api/v1", User);
app.use("/api/v1", Books);
app.use("/api/v1", Favourite);
app.use("/api/v1", Cart);
app.use("/api/v1", Order);

// ❌ No app.listen() in Vercel
// ✅ Export app
module.exports = app;
