const express = require("express");
const router = express.Router();
const cartControllers = require("../controllers/order");
const asyncHandler = require("express-async-handler");
const { isAuthenticated } = require("../middleware/auth");

// create Cart
router.post("/", asyncHandler(cartControllers.createCart));

//get User Orders
router.get("/user", asyncHandler(cartControllers.getUserOrders));
//complete Order
router.put("/processed", asyncHandler(cartControllers.completeOrder));
//cancel Order
router.post("/cancelled", asyncHandler(cartControllers.cancelOrder));
//restore Order
router.post("/restored", asyncHandler(cartControllers.restoreOrder));
//delete Order
<<<<<<< HEAD
router.post("/deleteOrder", asyncHandler(cartControllers.deleteOrder));
=======
router.post("/deleteOrder", isLogin, asyncHandler(cartControllers.deleteOrder));
//Confirm or deny order
router.post("/action", isLogin, asyncHandler(cartControllers.confirmOrder));
//Het Order to manage
router.get(
  "/getOrdersToManage",
  isLogin,
  asyncHandler(cartControllers.getOrderToMange)
);
>>>>>>> master

module.exports = router;
