const express = require("express");
const router = express.Router();
const cartControllers = require("../controllers/order");
const asyncHandler = require("express-async-handler");
const { isLogin } = require("../middleware/auth");

// create Book
router.post("/", isLogin, asyncHandler(cartControllers.createCart));

router.put(
  "/:id/processed",
  isLogin,
  asyncHandler(cartControllers.completeOrder)
);

router.delete(
  "/:id/delete",
  isLogin,
  asyncHandler(cartControllers.deleteOrder)
);

module.exports = router;
