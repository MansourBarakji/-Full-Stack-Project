const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const bookControllers = require("../controllers/book");
const { validateBook } = require("../middleware/auth");

// get user Books
router.get("/user", asyncHandler(bookControllers.getUserBooks));

// create Book
router.post("/", validateBook, asyncHandler(bookControllers.createBook));

// book search
router.post("/search", asyncHandler(bookControllers.bookSearch));

router.put("/", asyncHandler(bookControllers.updateBook));

router
  .route("/:id")
  // get book info
  .get(asyncHandler(bookControllers.getBookInfo))
  // update book
  // delete book
  .delete(asyncHandler(bookControllers.deleteBook));

// delete a version of book
router.delete("/version/:id", asyncHandler(bookControllers.deleteOldBook));

//get some statistic
router.get("/statistic", asyncHandler(bookControllers.getStatistic));

// switch book with a version
router.post("/switch", asyncHandler(bookControllers.switchBook));

module.exports = router;
