import Axios from "../lib/axios";
import { BOOK_API_ROUTES } from "./routes";

const getBooks = async (pageNumber) => {
  const res = await Axios.post(BOOK_API_ROUTES.POST.ALL_BOOK, { pageNumber });
  return res.data;
};

const getUserBooks = async (pageNumber) => {
  const res = await Axios.get(BOOK_API_ROUTES.GET.User_BOOK, {
    params: { pageNumber },
  });
  return res.data;
};

const getUserStatistic = async () => {
  const res = await Axios.get(BOOK_API_ROUTES.GET.MY_STATISTIC);
  return res.data;
};

const deleteOldBook = async (id) => {
  const res = await Axios.delete(BOOK_API_ROUTES.POST.DELETE_OLD_BOOK, { id });
  return res.data;
};

const switchBook = async (id) => {
  const res = await Axios.post(BOOK_API_ROUTES.POST.SWITCH_BOOK, { id });
  return res.data;
};

const deleteBook = async (id) => {
  const res = await Axios.delete(BOOK_API_ROUTES.DELETE.DELETE_BOOK(id));
  return res.data;
};

const createBook = async (data = {}) => {
  const res = await Axios.post(BOOK_API_ROUTES.POST.CREATE_BOOK, data);
  return res.data;
};

const editBook = async (data = {}) => {
  const res = await Axios.put(BOOK_API_ROUTES.PUT.EDIT_BOOK, data);
  return res.data;
};

const search = async (data = {}) => {
  const res = await Axios.post(BOOK_API_ROUTES.POST.SEARCH, data);
  return res.data;
};

const bookApi = {
  getBooks,
  getUserBooks,
  deleteOldBook,
  deleteBook,
  editBook,
  createBook,
  getUserStatistic,
  search,
  switchBook,
};
export default bookApi;
