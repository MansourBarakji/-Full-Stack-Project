import { useNavigate } from 'react-router-dom';
import { useState,useEffect } from 'react';
import useAuth from '../../hooks/useAsync';
import '../../public/BookVersion.css'; 
import NavBar from '../../components/NavBar';
import '../../public/ManageOrder.css'; 


const ManageOrderPage = () => {

 const { manageOrder,getOrdersToManage, loading, error } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
 const [message, setMessage] = useState('');
 const [cart] = useState(() => {
  const savedCart = localStorage.getItem('cart');
  return savedCart ? JSON.parse(savedCart) : [];
})

 useEffect(() => {
  const fetchOrders = async () => {
    const response = await getOrdersToManage();
    if (response) {
      console.log({response})
      setOrders(response);
    }
  };
  fetchOrders();
}, [getOrdersToManage]);

const handleActionClick = async (id, action) => {
  const response = await manageOrder({
    orderId: id,
    action: action
  });
  if (response && response.message) {
    setMessage(response.message);
    setTimeout(() => {
      navigate('/');
    }, 2000); 
  }
};

const handledenyClick = async (id, action) => {
  const response = await manageOrder({
    orderId: id,
    action: action
  });
  if (response && response.message) {
    setMessage(response.message);
    setTimeout(() => {
      navigate('/');
    }, 2000); 
  }
};
return (
  <div>
    <NavBar cart={cart} />
    <div className="manage-orders-container">
      <h1>Manage Orders</h1>
      {loading && <p className="loading-message">Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}
      {!loading && orders.length === 0 ? (
        <p>No orders to manage.</p>
      ) : (
        <ul className="order-list">
          {orders.map(order => (
            <li key={order._id}>
              <h3>Order For: {order.user.fullName}</h3>
              <p>Address: {order.address}</p>
              <p>Order Status: {order.orderStatus}</p>
              <p>Phone Number: {order.phoneNumber}</p>
              <h3>Books:</h3>
              <ul className="books-list">
                {order.cart.map(cartItem => (
                  cartItem.book && (
                    <li key={cartItem._id}>
                      <p>Title: {cartItem.book.title}</p>
                      <p>Author: {cartItem.book.author}</p>
                      <p>Quantity: {cartItem.quantity}</p>
                      <p>Price: ${cartItem.price}</p>
                    </li>
                  )
                ))}
              </ul>
              <button
                className="confirm"
                onClick={() => handleActionClick(order._id, 'confirm')}
                disabled={loading}
              >
                {loading ? 'Confirming...' : 'Confirm Order'}
              </button>
              <button
                className="deny"
                onClick={() => handledenyClick(order._id, 'deny')}
                disabled={loading}
              >
                {loading ? 'Denying...' : 'Deny Order'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
);
};


export default ManageOrderPage;
