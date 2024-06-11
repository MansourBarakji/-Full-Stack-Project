const Book = require("../models/book");
const BookVersion = require("../models/bookVersion");
const ExpressError = require("../utils/express_error");
const Order = require("../models/order");
const {
  BookIndex,
  ASCbookPriceIndex,
  DESCbookPriceIndex,
} = require("../algolia/index");
const { createAlgoliaBookObject } = require("../algolia/algoliaObject");

const getAllBooks = async (pageNumber) => {
  const page = parseInt(pageNumber) || 1;
  const pageSize = 4;
  const [books, count] = await Promise.all([
    Book.find({ availability: true, quantity: { $gt: 0 } })
      .limit(pageSize)
      .skip((page - 1) * pageSize),
    Book.countDocuments({ availability: true, quantity: { $gt: 0 } }),
  ]);

  const totalPages = Math.ceil(count / pageSize);

  const response = {
    books,
    pagination: {
      totalBooks: count,
      currentPage: page,
      totalPages: totalPages,
      pageSize: pageSize,
    },
  };
  return response;
};

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
  const algoliaBook = createAlgoliaBookObject(book);
  await BookIndex.saveObject(algoliaBook);

  return book;
};

const getUserBooks = async (info) => {
  const { pageNumber, userId } = info;
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
      const versions = await BookVersion.find({ bookId: book._id });
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

  const algoliaBook = createAlgoliaBookObject(book);
  await BookIndex.partialUpdateObject(algoliaBook);

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
  await BookIndex.deleteObject(book._id);
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

const search = async (searchInfo) => {
  const { query, sort, pageNumber } = searchInfo;
  const page = parseInt(pageNumber) || 1;
  const pageSize = 8;
  let results = [];
  let count = 0;
  let indexToSearch;
  let totalPages = 1;
  if (!query && !sort) {
    const [r, c] = await Promise.all([
      Book.find({ availability: true, quantity: { $gt: 0 } })
        .limit(pageSize)
        .skip((page - 1) * pageSize),
      Book.countDocuments({ availability: true, quantity: { $gt: 0 } }),
    ]);
    results = r;
    count = c;
    totalPages = Math.ceil(count / pageSize);
  } else {
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

const switchBook =async(switchInfo)=>{
  const {userId,id}=switchInfo
  const bookVersion = await BookVersion.findById(id);
  if (!bookVersion) {
    throw new ExpressError("This Book Version is not found", 404);
  }
  if (bookVersion.user.toString() !== userId.toString()) {
    throw new ExpressError("Unauthorized access to switch this book", 403);
  }
  const book = await Book.findById(bookVersion.bookId)
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
  getAllBooks,
  createBook,
  getBook,
  editBook,
  deleteBook,
  getUserBooks,
  deleteOldBook,
  getStatistic,
  search,
  switchBook
};

module.exports = bookService;
