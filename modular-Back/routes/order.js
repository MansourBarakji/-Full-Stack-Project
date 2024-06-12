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
//cancel Order
router.post("/cancelled", isLogin, asyncHandler(cartControllers.cancelOrder));
//restore Order
router.post("/restored", isLogin, asyncHandler(cartControllers.restoreOrder));
//delete Order
router.post("/deleteOrder", isLogin, asyncHandler(cartControllers.deleteOrder));
//Confirm or deny order
router.post("/action", isLogin, asyncHandler(cartControllers.confirmOrder));
//Het Order to manage
router.get(
  "/getOrdersToManage",
  isLogin,
  asyncHandler(cartControllers.getOrderToMange)
);

module.exports = router;
