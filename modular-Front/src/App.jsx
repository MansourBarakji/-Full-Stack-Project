import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home';
import LoginPage from './pages/user/Login';
import RegisterPage from './pages/user/Register';
import VerifyPage from './pages/user/Verify';
import ProfilePage from './pages/user/Profile';
import EditProfilePage from './pages/user/EditProfile';
import ResetPasswordPage from './pages/user/ResetPassword';
import ForgotPasswordPage from './pages/user/ForgotPassword';
import BooksPage from './pages/book/AllBooks';
import UserBooksPage from './pages/book/UserBooks';
import EditBookPage from './pages/book/EditBook';
import CreateBookPage from './pages/book/CreateBook';
import CartPage from './pages/order/Cart';
import CompleteOrderPage from './pages/order/CreateOrder';
import OrderInfoPage from './pages/order/OrderDetails'
import UserOrdersPage from './pages/order/UserOrders';
import StatisticsPage from './pages/book/Statistics';
import BookVersionPage from './pages/book/BookVersion';
import ManageOrderPage from './pages/order/ManageOrder';
import NotFoundPage from './pages/NotFound';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify/:token" element={<VerifyPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/editProfile" element={<EditProfilePage />} />
        <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
        <Route path="/resetPassword/:resetToken" element={<ResetPasswordPage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/userBooks" element={<UserBooksPage />} />
        <Route path="/editBook" element={<EditBookPage />} />
        <Route path="/createBook" element={<CreateBookPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/completeOrder" element={<CompleteOrderPage />} />
        <Route path="/orderInfo" element={<OrderInfoPage />} />
        <Route path="/userOrders" element={<UserOrdersPage />} />
        <Route path="/userStatistics" element={<StatisticsPage />} />
        <Route path="/bookVersion" element={<BookVersionPage />} />
        <Route path="/admin" element={<ManageOrderPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
