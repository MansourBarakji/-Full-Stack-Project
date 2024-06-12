import {Link, useLocation ,useNavigate} from 'react-router-dom';
import useAuth from '../../hooks/useAsync';
import { useState } from 'react';
import '../../public/OrderInfo.css'; 

const OrderInfoPage = () => {
  const {restoreOrder,cancelOrder, loading ,error } = useAuth();
  const location = useLocation();
  const { order } = location.state; 
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); 

  const handleCancelOrder = async (id) => {
    const response = await cancelOrder(id);
    if (response && response.message) {
      setMessage(response.message);
       setTimeout(() => {
        navigate('/userOrders');
      }, 2000); 
    }
    };
    const handleRestoreOrder = async (id) => {
      const response = await restoreOrder(id);
      if (response && response.message) {
        setMessage(response.message);
         setTimeout(() => {
          navigate('/userOrders');
        }, 2000); 
      }
      };
       const renderOrderStatus = () => {
    switch (order.orderStatus) {
      case 'Confirmed':
        return 'We will get to you soon';
      case 'Processed':
        return 'Your order is under processing';
      case 'Cancelled':
        return 'This order is cancelled';
     case 'Denied':
    return 'This order is Deined by the Book Owner';
      default:
        return 'Unknown status';
    }
  };
  return (
    <div className="order-info-container">
      <div className="navigation">
        <Link to="/userOrders" className="back-link">My Orders</Link>
      </div>
      <div className="order-details">
        <h1>Order Info</h1>
        <div className="order-section">
          <h3>Order For: {order.user.fullName}</h3>
          {order.cart.length > 0 && (
            <div className="cart-items">
              {order.cart.map((item, index) => (
                <div key={index} className="cart-item">
                  <p>Book Title: {item.book.title}</p>
                  <p>Book Price: ${item.price}</p>
                  <p>Selected Quantity: {item.quantity}</p>
                </div>
              ))}
            </div>
          )}
          <p>Address: {order.address}</p>
          <p>Phone Number: {order.phoneNumber}</p>
          <p>Payment Method: {order.paymentMethod}</p>
          <p>Total Price: ${order.totalPrice}</p>
          <p>Date Ordered: {new Date(order.dateOrdered).toLocaleString()}</p>
          <p className={`order-status ${order.orderStatus.toLowerCase()}`}>
            {renderOrderStatus()}
          </p>
          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}
          {order.orderStatus === 'Processed' && (
            <button 
              disabled={loading} 
              onClick={() => handleCancelOrder(order._id)} 
              className="cancel-button"
            >
              {loading ? 'Canceling..' : 'Cancel Order'}
            </button>
          )}
          {order.orderStatus === 'Cancelled' && (
            <button 
              disabled={loading} 
              onClick={() => handleRestoreOrder(order._id)} 
              className="restore-button"
            >
              {loading ? 'Restoring..' : 'Restore Order'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderInfoPage;
