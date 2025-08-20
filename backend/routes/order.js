const router = require("express").Router();
const { AuthenticateToken } = require("./userAuth");
const User = require("../models/user");
const Book = require("../models/book");
const Order = require("../models/order");

// place order ...
router.post("/order", AuthenticateToken, async (req, res) => {
  try {
    const id = req.user.id;
    const { order } = req.body;

    if (!order || !Array.isArray(order) || order.length === 0) {
      return res.status(400).json({ message: "Order data is required" });
    }

    const savedOrders = [];

    for (const orderData of order) {
      const newOrder = new Order({
        user: id,
        book: [orderData._id], // Assuming _id is bookId
        totalAmount: orderData.price || 0
      });

      const orderDataFromDb = await newOrder.save();
      savedOrders.push(orderDataFromDb);

      // Save order reference in User model
      await User.findByIdAndUpdate(id, {
        $push: { orders: orderDataFromDb._id },
      });
    }

    // Clear the ordered books from the cart in one go
    await User.findByIdAndUpdate(id, {
      $pull: { cart: { $in: order.map((o) => o._id) } },
    });

    return res.json({
      status: "success",
      message: "Order placed successfully",
      orders: savedOrders,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred...",
    });
  }
});

// get order history of a particular user...

router.get("/get-order-history", AuthenticateToken, async (req, res) => {
  try {
    const id = req.user.id;
    const userData =  await User.findById(id).populate({
      path: "orders",
      populate: { path: "books" },
    });

    const orderData = userData.orders.reverse();
    return res.json({
      status: "success",
      data: orderData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "an error occured...",
    });
  }
});

// get all orders --admin

router.get("/get-all-history", AuthenticateToken, async (req, res) => {
  try {
    const userData = await Order.find()
      .populate({
        path: "books",
      })
      .populate({
        path: "user",
      })
      .sort({ createdAt: -1 });
    return res.json({
      status: "success",
      data: userData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "an error occured...",
    });
  }
});

// update order status -- admin
router.put('/update-status/:id', AuthenticateToken, async(req, res)=>{
  try{
    const {id} = req.params;
    await Order.findByIdAndUpdate(id, {status: req.body.status});
    return res.json({
      status: "success",
      message : "status updated successfully..."
    })

  }
  catch(error){
    console.log(error);
    return res.status(500).json({
      message: "an error occured..."
    })
  }
})

module.exports = router;
