const algoliasearch = require("algoliasearch");

const AlgoliaClient = algoliasearch(
  process.env.ALGOLIA_APPLICATION_ID,
  process.env.ALGOLIA_ADMIN_API_KEY
);

const BookIndex = AlgoliaClient.initIndex("books");
const ASCbookPriceIndex = AlgoliaClient.initIndex("books_price_asc");
const DESCbookPriceIndex = AlgoliaClient.initIndex("books_price_desc");

module.exports = {
  AlgoliaClient,
  BookIndex,
  ASCbookPriceIndex,
  DESCbookPriceIndex,
};
