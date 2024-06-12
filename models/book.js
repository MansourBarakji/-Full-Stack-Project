const mongoose = require("mongoose");
const { BookIndex } = require("../algolia");
const { redisClient } = require("../setup/redis");
const Schema = mongoose.Schema;

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    genre: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// index books which optimize searching
bookSchema.index({ user: 1, availability: 1, createdAt: 1, updatedAt: 1 });

bookSchema.post("createCollection", async function () {
  // index book in Algolia
  const book = this.toObject();
  book.objectID = this._id.toString();

  // index book in Algolia
  await BookIndex.saveObject(book);

  // cache book in Redis
  await redisClient.setex(book, 3600, JSON.stringify(book));
});

bookSchema.post("updateOne", async function (doc) {
  const book = await this.model.findOne(this.getQuery()).lean().exec(); // Retrieve the updated document
  book.objectID = book._id.toString();

  // update book in Algolia
  await BookIndex.saveObject(book);

  // cache book in Redis
  await redisClient.setex(book._id.toString(), 3600, JSON.stringify(book)); // cache book in Redis
});

bookSchema.post("save", async function () {
  // update book in Algolia
  const book = this.toObject();
  book.objectID = this._id.toString();
  await BookIndex.saveObject(book);

  // cache book in Redis
  await redisClient.setex(book, 3600, JSON.stringify(book));
});

bookSchema.post(
  "deleteOne",
  { document: true, query: false },
  async function (doc) {
    if (doc) {
      let objectID = doc._id.toString();
      // delete book from Algolia
      await BookIndex.deleteObject(objectID);

      // delete book from Redis
      await redisClient.del(objectID);
    }
  }
);

module.exports = mongoose.model("Book", bookSchema);
