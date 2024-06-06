const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const bookControllers = require("../controllers/book");
const { isLogin } = require("../middleware/auth");

// get All Book
router.get("/", asyncHandler(bookControllers.getAllBooks));
// create Book
router.post("/createBook", isLogin, asyncHandler(bookControllers.createBook));

router
  .route("/:id")
  .get(isLogin, asyncHandler(bookControllers.getBookInfo)) // Update book information
  .put(isLogin, asyncHandler(bookControllers.updateBook)) // Update book information
  .delete(isLogin, asyncHandler(bookControllers.deleteBook)); // delete book

module.exports = router;
