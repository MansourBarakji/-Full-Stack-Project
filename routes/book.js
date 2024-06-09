const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const bookControllers = require("../controllers/book");
const { isLogin, validateBook } = require("../middleware/auth");

// get All Books
router.get("/", asyncHandler(bookControllers.getAllBooks));
// get User Books
router.get("/myBook", isLogin, asyncHandler(bookControllers.getMyBooks));
// create Book
router.post(
  "/createBook",
  isLogin,
  validateBook,
  asyncHandler(bookControllers.createBook)
);
// delete an old version of book
router.post(
  "/deleteOldBook",
  isLogin,
  asyncHandler(bookControllers.deleteOldBook)
);
// delete book with all versions
router.post("/deleteBook", isLogin, asyncHandler(bookControllers.deleteBook));
//edit book
router.put(
  "/editBook",
  isLogin,
  validateBook,
  asyncHandler(bookControllers.updateBook)
);
//get some statistic
router.get("/statistic", isLogin, asyncHandler(bookControllers.getStatistic));

module.exports = router;
