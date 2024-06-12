const bookService = require("../service/bookService");
const ExpressError = require("../utils/express_error");

module.exports.getAllBooks = async (req, res) => {
  const { pageNumber } = req.body;
  const response = await bookService.getAllBooks(pageNumber);
  res.status(200).json(response);
};

module.exports.createBook = async (req, res) => {
  const { title, author, genre, price, availability, quantity } = req.body;
  const userId = req.user._id;
  const bookInfo = {
    title,
    author,
    genre,
    price,
    availability,
    userId,
    quantity,
  };
  const book = await bookService.createBook(bookInfo);
  if (!book) {
    throw new ExpressError("Book not found", 404);
  }
  res.status(200).json({ message: "Book Created Succesfully" });
};

module.exports.getUserBooks = async (req, res) => {
  const { pageNumber } = req.body;
  const userId = req.user._id;
  const info = { pageNumber, userId };
  const booksWithVersions = await bookService.getUserBooks(info);
  res.status(200).json(booksWithVersions);
};

module.exports.deleteOldBook = async (req, res) => {
  const { id } = req.body;
  const userId = req.user._id;
  const info = { userId, id };
  await bookService.deleteOldBook(info);
  res.status(200).json({ message: " This Version is deleted succesfully" });
};
module.exports.getBookInfo = async (req, res) => {
  const bookId = req.params.id;
  const book = await bookService.getBook(bookId);
  res.status(200).json(book);
};

module.exports.updateBook = async (req, res) => {
  const { title, author, genre, price, availability, quantity, id } = req.body;
  const userId = req.user._id;
  const bookInfo = {
    title,
    author,
    genre,
    price,
    availability,
    quantity,
    userId,
    id,
  };
  const book = await bookService.editBook(bookInfo);
  if (!book) {
    throw new ExpressError("Book not updated", 404);
  }
  res.status(200).json({ message: "Book Updated succesful" });
};

module.exports.deleteBook = async (req, res) => {
  const bookId = req.body.id;
  const userId = req.user._id;
  const bookInfo = {
    userId,
    bookId,
  };
  await bookService.deleteBook(bookInfo);
  res
    .status(200)
    .json({ message: "book with all version is deleted delete succesful" });
};

module.exports.getStatistic = async (req, res) => {
  const userId = req.user._id;
  const statistic = await bookService.getStatistic(userId);
  res.status(200).json(statistic);
};

module.exports.bookSearch = async (req, res) => {
  const { query, sort, pageNumber } = req.body;
  const searchInfo = { query, sort, pageNumber };
  const response = await bookService.search(searchInfo);
  res.status(200).json(response);
};

module.exports.switchBook = async (req, res) => {
  const { id } = req.body;
  const userId = req.user._id;
  const switchInfo = { userId, id };
  const book = await bookService.switchBook(switchInfo);
  if (!book) {
    throw new ExpressError("This Book is not switched", 404);
  }
  res.status(200).json({ message: "Book Switch Succesfully" });
};
