export const BOOK_API_ROUTES = {
    POST: {
      CREATE_BOOK: "/book",
      DELETE_OLD_BOOK: "/book/deleteOldBook",
  
      ALL_BOOK: "/book",
  
      SWITCH_BOOK: "/book/switch",
      SEARCH: "/book/search",
    },
    GET: {
      User_BOOK: "/book/user",
      MY_STATISTIC: "/book/statistic",
    },
    PUT: {
      EDIT_BOOK: "/book/editBook",
    },
    DELETE: {
      DELETE_BOOK: (bookId) => `/book/${bookId}`,
    },
  };
  

