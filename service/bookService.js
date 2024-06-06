const Book = require("../models/book");
const BookVersion = require("../models/bookVersion");
const ExpressError = require("../utils/express_error");

const createBook = async (bookInfo) => {
  const { title, author, genre, price, availability, quantity, userId } =
    bookInfo;

  const book = await Book.create({
    title,
    author,
    genre,
    price,
    availability,
    quantity,
    user: userId,
  });
  if (!book) {
    throw new ExpressError("Invalid Book Data", 400);
  }
  return book;
};

const getBook = async (bookId) => {
  const book = await Book.findById(bookId).populate("user");
  if (!book) {
    throw new ExpressError("Book not found", 404);
  }
  return book;
};

const editBook = async (bookInfo) => {
  const {
    title,
    author,
    genre,
    price,
    availability,
    quantity,
    userId,
    bookId,
  } = bookInfo;
  const book = await Book.findById(bookId);
  if (!book) {
    throw new ExpressError("Book not found", 404);
  }

  if (book.user.toString() !== userId.toString()) {
    throw new ExpressError("Unauthorized access to edit this shop", 403);
  }
  // Save the current version to BookVersion
  const bookVersion = new BookVersion({
    bookId: book._id,
    title: book.title,
    author: book.author,
    genre: book.genre,
    price: book.price,
    availability: book.availability,
    quantity: book.quantity,
    user: book.user,
    versionDate: new Date(),
  });
  await bookVersion.save();

  book.title = title;
  book.author = author;
  book.genre = genre;
  book.price = price;
  book.quantity = quantity;
  book.availability = availability;
  await book.save();
  return book;
};

const deleteBook = async (bookInfo) => {
  const { userId, bookId } = bookInfo;
  const book = await Book.findById(bookId);
  if (!book) {
    throw new ExpressError("Book not found", 404);
  }
  if (book.user.toString() !== userId.toString()) {
    throw new ExpressError("Unauthorized access to delete this shop", 403);
  }
  // Delete all versions of the book
  await BookVersion.deleteMany({ bookId: book._id });
  // Delete the main book
  await Book.findByIdAndDelete(bookId);
};

const bookService = {
  createBook,
  getBook,
  editBook,
  deleteBook,
};

module.exports = bookService;
