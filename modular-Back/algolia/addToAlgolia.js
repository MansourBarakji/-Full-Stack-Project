const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const Book = require("../models/book");
const Cart = require("../models/cart");
const Order = require("../models/order");

const { BookIndex } = require("./index");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB connection `);
  } catch (error) {
    console.error(` Error : ${error.message}`);
    process.exit(1);
  }
};
connectDB().then(async () => {
  try {
    const books = await Book.find({}).lean();

    const algoliaBook = books.map((book) => ({
      objectID: book._id,
      title: book.title,
      author: book.author,
      genre: book.genre,
      price: book.price,
      quantity: book.quantity,
      availability: book.availability,
    }));

    await BookIndex.clearObjects();
    await BookIndex.saveObjects(algoliaBook);
    console.log("Books added successfully to Algolia");
  } catch (error) {
    console.error("Error indexing Books to Algolia:", error);
  }
});

// connectDB().then(async () => {
//   try {
//     await Cart.deleteMany({})
//     await Order.deleteMany({})
//     console.log("done");

//   } catch (error) {
//     console.error("Error", error);
//   }
// });