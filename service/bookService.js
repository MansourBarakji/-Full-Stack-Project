const Book = require("../models/book");
const BookVersion = require("../models/bookVersion");
const ExpressError = require("../utils/express_error");
const Order = require("../models/order");

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

const getMyBooks = async (userId) => {
  const books = await Book.find({ user: userId });
  if (!books || books.length === 0) {
    return null;
  }

  const booksWithVersions = await Promise.all(
    books.map(async (book) => {
      const versions = await BookVersion.find({ bookId: book._id });
      return { ...book._doc, versions };
    })
  );

  return booksWithVersions;
};

const deleteOldBook = async (info) => {
  const { userId, id } = info;
  const oldBook = await BookVersion.findById(id);
  if (!oldBook) {
    throw new ExpressError("Book not found", 404);
  }
  if (oldBook.user.toString() !== userId.toString()) {
    throw new ExpressError("Unauthorized access to edit this book", 403);
  }
  await BookVersion.findByIdAndDelete(id);
};

const getBook = async (bookId) => {
  const book = await Book.findById(bookId).populate("user");
  if (!book) {
    throw new ExpressError("Book not found", 404);
  }
  return book;
};

const editBook = async (bookInfo) => {
  const { title, author, genre, price, availability, quantity, userId, id } =
    bookInfo;
  const book = await Book.findById(id);
  if (!book) {
    throw new ExpressError("Book not found", 404);
  }

  if (book.user.toString() !== userId.toString()) {
    throw new ExpressError("Unauthorized access to edit this book", 403);
  }
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
    throw new ExpressError("Unauthorized access to delete this book", 403);
  }

  await BookVersion.deleteMany({ bookId: book._id });
  await Book.findByIdAndDelete(bookId);
};

const getStatistic = async (userId) => {
  const [availableBook, UnAvailableBook, MyOrders] = await Promise.all([
    Book.countDocuments({ availability: true, user: userId }),
    Book.countDocuments({ availability: false, user: userId }),
    Order.countDocuments({ user: userId }),
  ]);

  const statistic = {
    availableBook,
    UnAvailableBook,
    MyOrders,
  };
  return statistic;
};
const bookService = {
  createBook,
  getBook,
  editBook,
  deleteBook,
  getMyBooks,
  deleteOldBook,
  getStatistic,
};

module.exports = bookService;
