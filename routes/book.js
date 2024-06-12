const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const bookControllers = require("../controllers/book");
const { validateBook } = require("../middleware/auth");

// create Book
router.post("/", validateBook, asyncHandler(bookControllers.createBook));
// get user Books
router.get("/user", asyncHandler(bookControllers.getUserBooks));
// book search
router.post("/search", asyncHandler(bookControllers.bookSearch));
//edit book
router.put("/editBook", asyncHandler(bookControllers.updateBook));
//delete book with all his version
router.delete("/:id",asyncHandler(bookControllers.deleteBook));
// delete a version of book
router.delete("/deleteOldBook", asyncHandler(bookControllers.deleteOldBook));
//get some statistic
router.get("/statistic", asyncHandler(bookControllers.getStatistic));
// switch book with a version
router.post("/switch", asyncHandler(bookControllers.switchBook));

module.exports = router;
