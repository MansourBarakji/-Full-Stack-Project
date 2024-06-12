const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const bookControllers = require("../controllers/book");
const { validateBook ,isAuthenticated } = require("../middleware/auth");

// create Book
router.post("/",isAuthenticated, validateBook, asyncHandler(bookControllers.createBook));
// get user Books
router.get("/user",isAuthenticated, asyncHandler(bookControllers.getUserBooks));
// book search
router.post("/search", asyncHandler(bookControllers.bookSearch));
//edit book
router.put("/editBook",isAuthenticated, asyncHandler(bookControllers.updateBook));
//delete book with all his version
router.delete("/:id",isAuthenticated,asyncHandler(bookControllers.deleteBook));
// delete a version of book
router.delete("/deleteOldBook",isAuthenticated, asyncHandler(bookControllers.deleteOldBook));
//get some statistic
router.get("/statistic",isAuthenticated, asyncHandler(bookControllers.getStatistic));
// switch book with a version
router.post("/switch",isAuthenticated, asyncHandler(bookControllers.switchBook));

module.exports = router;
