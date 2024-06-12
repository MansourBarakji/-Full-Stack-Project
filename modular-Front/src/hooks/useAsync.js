import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import userApi from "../api/user/index";
import bookApi from "../api/book/index";
import orderApi from "../api/order/index";

export default function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [token]);

  const login = useCallback(async (data) => {
    setLoading(true);
    try {
      const response = await userApi.loginUser(data);
      const { token } = response;
      localStorage.setItem("token", token);
      setToken(token);
      setIsAuthenticated(true);
      setError(null);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data) => {
    setLoading(true);
    try {
      const response = await userApi.registerUser(data);
      const { token } = response;
      localStorage.setItem("token", token);
      setToken(token);
      setIsAuthenticated(true);
      setError(null);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyUser = useCallback(async (token) => {
    setLoading(true);
    try {
      const response = await userApi.verifyUser(token);
      setError(null);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await userApi.getUserProfile();
      setError(null);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch user profile");
    } finally {
      setLoading(false);
    }
  }, []);

  const editUserProfile = useCallback(async (data) => {
    setLoading(true);
    try {
      const response = await userApi.editUserProfile(data);
      setError(null);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to edit profile");
    } finally {
      setLoading(false);
    }
  }, []);

  const sendResetPasswordEmail = useCallback(async (email) => {
    setLoading(true);
    try {
      const response = await userApi.sendResetPasswordEmail(email);
      setError(null);
      return response;
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to send reset password email"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (resetToken, newPassword) => {
    setLoading(true);
    try {
      const response = await userApi.resetPassword(resetToken, newPassword);
      setError(null);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
    setToken("");
    setIsAuthenticated(false);
    navigate("/");
  };

  const getbooks = useCallback(async (pageNumber) => {
    setLoading(true);
    try {
      const response = await bookApi.getBooks(pageNumber);
      setError(null);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch Books");
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserBooks = useCallback(async (pageNumber) => {
    setLoading(true);
    try {
      const response = await bookApi.getUserBooks(pageNumber);
      setError(null);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch Books");
    } finally {
      setLoading(false);
    }
  }, []);

  const getMyStatistic = useCallback(async () => {
    setLoading(true);
    try {
      const response = await bookApi.getMyStatistic();
      setError(null);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch Your Statistic");
    } finally {
      setLoading(false);
    }
  }, []);
  const deleteOldBook = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await bookApi.deleteOldBook(id);
      setError(null);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete this version");
    } finally {
      setLoading(false);
    }
  }, []);

  const switchBook = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await bookApi.switchBook(id);
      setError(null);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to Switch this Version");
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteBook = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await bookApi.deleteBook(id);
      setError(null);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete this Books");
    } finally {
      setLoading(false);
    }
  }, []);

  const editBook = useCallback(async (data) => {
    setLoading(true);
    try {
      const response = await bookApi.editBook(data);
      setError(null);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to edit Book");
    } finally {
      setLoading(false);
    }
  }, []);

  const createBook = useCallback(async (data) => {
    setLoading(true);
    try {
      const response = await bookApi.createBook(data);
      setError(null);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create Book");
    } finally {
      setLoading(false);
    }
  }, []);

  const search = useCallback(async (data) => {
    setLoading(true);
    try {
      const response = await bookApi.search(data);
      setError(null);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to get books");
    } finally {
      setLoading(false);
    }
  }, []);

  const createOrder = useCallback(async (data) => {
    setLoading(true);
    try {
      const response = await orderApi.createOrder(data);
      setError(null);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create Order");
    } finally {
      setLoading(false);
    }
  }, []);

  const completeOrder = useCallback(async (data) => {
    setLoading(true);
    try {
      const response = await orderApi.completeOrder(data);
      setError(null);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create Order");
    } finally {
      setLoading(false);
    }
  }, []);

  const manageOrder = useCallback(async (data) => {
    setLoading(true);
    try {
      const response = await orderApi.manageOrder(data);
      setError(null);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch Orders");
    } finally {
      setLoading(false);
    }
  }, []);


  const getOrdersToManage = useCallback(async () => {
    setLoading(true);
    try {
      const response = await orderApi.getOrdersToManage();
      setError(null);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch Orders");
    } finally {
      setLoading(false);
    }
  }, []);

  const getMyOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await orderApi.getMyOrders();
      setError(null);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch Orders");
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelOrder = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await orderApi.cancelOrder(id);
      setError(null);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete this Books");
    } finally {
      setLoading(false);
    }
  }, []);

  const restoreOrder = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await orderApi.restoreOrder(id);
      setError(null);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete this Books");
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteOrder = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await orderApi.deleteOrder(id);
      setError(null);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete this Books");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    isAuthenticated,
    loading,
    error,
    login,
    register,
    verifyUser,
    getUserProfile,
    editUserProfile,
    sendResetPasswordEmail,
    resetPassword,
    logout,
    getbooks,
    getUserBooks,
    getMyStatistic,
    deleteOldBook,
    deleteBook,
    switchBook,
    editBook,
    createBook,
    createOrder,
    completeOrder,
    getMyOrders,
    cancelOrder,
    restoreOrder,
    deleteOrder,
    search,
    getOrdersToManage,
    manageOrder
  };
}
