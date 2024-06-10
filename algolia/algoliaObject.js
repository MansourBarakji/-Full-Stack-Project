module.exports.createAlgoliaBookObject = (book) => {
  return {
    objectID: book._id,
    title: book.title,
    author: book.author,
    genre: book.genre,
    price: book.price,
    availability: book.availability,
  };
};
