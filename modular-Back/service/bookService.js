const Book = require("../models/book");
const BookVersion = require("../models/bookVersion");
const ExpressError = require("../utils/expressError");
const Order = require("../models/order");
const {
  BookIndex,
  ASCbookPriceIndex,
  DESCbookPriceIndex,
} = require("../algolia/index");
const { redisClient } = require("../setup/redis");

/**
 *
 * @param {Object} bookInfo
 * @param {String} bookInfo.title
 * @param {String} bookInfo.author
 * @param {String} bookInfo.genre
 * @param {Number} bookInfo.price
 * @param {Boolean} bookInfo.availability
 * @param {Number} bookInfo.quantity
 * @param {String} bookInfo.user
 *
 * @returns {Object} book
 */
const createBook = async (bookInfo) => {
  const book = await Book.create({
    ...bookInfo,
  });

  return book;
};

/**
 *
 * @param {String} userId
 * @param {Integer} pageNumber
 * @returns {Array} books
 */
const getUserBooks = async (userId, pageNumber = 1) => {
  const page = parseInt(pageNumber) || 1;
  const pageSize = 4;
  const [books, count] = await Promise.all([
    Book.find({ user: userId })
      .limit(pageSize)
      .skip((page - 1) * pageSize),
    Book.countDocuments({ user: userId }),
  ]);
  if (!books || books.length === 0) {
    return null;
  }
  const booksWithVersions = await Promise.all(
    books.map(async (book) => {
      const versions = await BookVersion.find({ book: book._id });
      return { ...book._doc, versions };
    })
  );
  const totalPages = Math.ceil(count / pageSize);

  return {
    books: booksWithVersions,
    pagination: {
      totalBooks: count,
      currentPage: page,
      totalPages,
      pageSize,
    },
  };
};


const deleteOldBook = async (info) => {
  const { userId, id } = info;
  const oldBook = await BookVersion.findById(id);
  if (!oldBook) {
    throw new ExpressError("Book not found", 404);
  }

  if (oldBook.user.toString() !== userId.toString()) {
    throw new ExpressError(
      "Unauthorized access to delete this book version",
      403
    );
  }

  await oldBook.delete();
};


/**
 *
 * @param {Object} bookVersionInfo
 * @param {String} bookVersionInfo.bookId
 * @param {String} bookVersionInfo.title
 * @param {String} bookVersionInfo.author
 * @param {String} bookVersionInfo.genre
 * @param {Number} bookVersionInfo.price
 * @param {Boolean} bookVersionInfo.availability
 * @param {Number} bookVersionInfo.quantity
 * @param {String} bookVersionInfo.userId
 * @returns {Promise}
 */

const createBookVersion = async (bookVersionInfo) => {
  const bookVersion = await BookVersion.create({
    ...bookVersionInfo,
  });

  return bookVersion;
};

/**
 *
 * @param {Object} bookInfo
 * @param {String} bookInfo.title
 * @param {String} bookInfo.author
 * @param {String} bookInfo.genre
 * @param {Number} bookInfo.price
 * @param {Boolean} bookInfo.availability
 * @param {Number} bookInfo.quantity
 * @param {String} bookInfo.userId
 * @param {String} bookInfo.id
 *
 * @throws {ExpressError} if book not found
 * @throws {ExpressError} if unauthorized access to edit this book
 *
 * @returns {Object} book
 */

const updateBook = async (bookInfo) => {
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
    book: book._id,
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
  // await createBookVersion({
  //   ...bookInfo,
  //   book: id,
  //   user: userId,
  // });

  await book.updateOne({
    title,
    author,
    genre,
    price,
    availability,
    quantity,
  });

  return book;
};

/**
 *
 * @param {Object} bookInfo
 * @param {String} bookInfo.userId
 * @param {String} bookInfo.bookId
 *
 * @throws {ExpressError} if book not found
 * @throws {ExpressError} if unauthorized access to delete this book
 */

const deleteBook = async (bookInfo) => {
  const { userId, bookId } = bookInfo;
  const book = await Book.findById(bookId);
  if (!book) {
    throw new ExpressError("Book not found", 404);
  }
  console.log(book)
  console.log({userId})
  if (book?.user?.toString() !== userId?.toString()) {
    throw new ExpressError("Unauthorized access to delete this book", 403);
  }
  await BookVersion.deleteMany({ book: book._id });
  await book.deleteOne();
};

/**
 *
 * @param {String} userId
 * @returns {Object} statistics
 * @returns {Number} statistics.availableBooks
 * @returns {Number} statistics.unavailableBooks
 * @returns {Number} statistics.orders
 *
 * @throws {ExpressError} if user not found
 * @throws {ExpressError} if user has no books
 */
const getStatistic = async (userId) => {
  const [availableBooks, unavailableBooks, orders] = await Promise.all([
    Book.countDocuments({ availability: true, user: userId }),
    Book.countDocuments({ availability: false, user: userId }),
    Order.countDocuments({ user: userId }),
  ]);

  return {
    availableBooks,
    unavailableBooks,
    orders,
  };
};

/**
 *
 * @param {Object} searchInfo
 * @param {String} searchInfo.query
 * @param {String} searchInfo.sort
 * @param {Number} searchInfo.pageNumber
 * @returns {Object} response
 */

const search = async (searchInfo) => {
  const { query, sort, pageNumber } = searchInfo;
  const page = parseInt(pageNumber) || 1;
  const pageSize = 8;
  let results = [];
  let count = 0;
  let totalPages = 1;

  if (!query) {
    let sortObject = {};
    if (sort === "asc") {
      sortObject = { price: 1, _id: -1 };
    } else if (sort === "desc") {
      sortObject = { price: -1, _id: -1 };
    } else {
      sortObject = { _id: -1 };
    }
    const [r, c] = await Promise.all([
      Book.find({ availability: true, quantity: { $gt: 0 } })
        .limit(pageSize)
        .skip((page - 1) * pageSize)
        .sort(sortObject),
      Book.countDocuments({ availability: true, quantity: { $gt: 0 } }),
    ]);
    results = r;
    count = c;
    totalPages = Math.ceil(count / pageSize);
  } else {
    let indexToSearch;
    if (sort === "asc") {
      indexToSearch = ASCbookPriceIndex;
    } else if (sort === "desc") {
      indexToSearch = DESCbookPriceIndex;
    } else {
      indexToSearch = BookIndex;
    }
    const { hits } = await indexToSearch.search(query);
    const filteredHits = hits.filter(
      (hit) => hit.availability === true && hit.quantity > 0
    );
    results = filteredHits;
    count = filteredHits.length;
  }
  const response = {
    books: results,
    pagination: {
      totalBooks: count,
      currentPage: page,
      totalPages: totalPages,
      pageSize: pageSize,
    },
  };
  return response;
};

const switchBook = async (switchInfo) => {
  const { userId, id } = switchInfo;
  const bookVersion = await BookVersion.findById(id);
  if (!bookVersion) {
    throw new ExpressError("This Book Version is not found", 404);
  }
  if (bookVersion.user.toString() !== userId.toString()) {
    throw new ExpressError("Unauthorized access to switch this book", 403);
  }
  const book = await Book.findById(bookVersion.book);
  if (!book) {
    throw new ExpressError("The main Book is not found", 404);
  }
  const {
    title: bookTitle,
    author: bookAuthor,
    genre: bookGenre,
    price: bookPrice,
    availability: bookAvailability,
    quantity: bookQuantity,
  } = book;


  book.title = bookVersion.title;
  book.author = bookVersion.author;
  book.genre = bookVersion.genre;
  book.price = bookVersion.price;
  book.availability = bookVersion.availability;
  book.quantity = bookVersion.quantity;

  bookVersion.title = bookTitle;
  bookVersion.author = bookAuthor;
  bookVersion.genre = bookGenre;
  bookVersion.price = bookPrice;
  bookVersion.availability = bookAvailability;
  bookVersion.quantity = bookQuantity;
  bookVersion.versionDate = new Date();


  await book.save();
  await bookVersion.save();
  return book;
};

const bookService = {
  createBook,
  updateBook,
  createBookVersion,
  deleteOldBook,
  deleteBook,
  getUserBooks,
  getStatistic,
  search,
  switchBook,
};

module.exports = bookService;
