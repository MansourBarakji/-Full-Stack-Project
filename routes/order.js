const express = require("express");
const router = express.Router();
const cartControllers = require("../controllers/order");
const asyncHandler = require("express-async-handler");
const { isLogin } = require("../middleware/auth");

// create Book
router.post("/", isLogin, asyncHandler(cartControllers.createCart));
//get User Orders
router.get("/userOrders", isLogin, asyncHandler(cartControllers.getUserOrders));
//complete Order
router.put("/processed", isLogin, asyncHandler(cartControllers.completeOrder));
//delete Order
router.post("/deleteOrder", isLogin, asyncHandler(cartControllers.deleteOrder));

module.exports = router;
