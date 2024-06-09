const Book = require("../models/book");
const bookService = require("../service/bookService");

module.exports.getAllBooks = async (req, res) => {
  const books = await Book.find({ availability: true });
  res.status(200).json(books);
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

module.exports.getMyBooks = async (req, res) => {
  const userId = req.user._id;
  const booksWithVersions = await bookService.getMyBooks(userId);
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
