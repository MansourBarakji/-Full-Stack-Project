/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import useApi from "../../hooks/useApi";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import "../../public/UserOrders.css";

const UserOrdersPage = () => {
  const { getMyOrders, deleteOrder, loading } = useApi();
  const [orders, setOrders] = useState([]);
  const [cart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await getMyOrders();
      if (response) {
        setOrders(response);
      }
    };
    fetchOrders();
  }, [getMyOrders]);

  const handleDeleteOrder = async (id) => {
    await deleteOrder(id);
    setOrders((preOrders) => preOrders.filter((order) => order._id !== id));
  };

  const handleViewClick = (order) => {
    navigate("/orderInfo", { state: { order } });
  };

  const renderOrders = (status) => {
    const filteredOrders = orders.filter(
      (order) => order.orderStatus === status
    );
    if (filteredOrders.length === 0) {
      return (
        <p className="no-orders-message">
          You don't have any {status.toLowerCase()} orders.
        </p>
      );
    }
    return filteredOrders.map((order, index) => (
      <div key={index} className="order-item">
        <h3>Order For: {order.user.fullName}</h3>
        <p>Address: {order.address}</p>
        <p>Total Price: ${order.totalPrice}</p>
        <div className="order-actions">
          <button
            onClick={() => handleViewClick(order)}
            className="view-button"
          >
            View
          </button>
          <button
            onClick={() => handleDeleteOrder(order._id)}
            className="delete-button"
          >
            Delete
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div>
      <NavBar cart={cart} />
      <div className="my-orders-container">
        <h1>My Orders</h1>
        {loading && <p>Loading...</p>}
        {!loading && orders.length === 0 && <p>You don't have any orders.</p>}
        {orders.length > 0 && (
          <>
            <div className="orders-section">
              <h2>Processed Orders</h2>
              <div className="orders-list">{renderOrders("Processed")}</div>
            </div>
            <div className="orders-section">
              <h2>Confirmed Orders</h2>
              <div className="orders-list">{renderOrders("Confirmed")}</div>
            </div>
            <div className="orders-section">
              <h2>Cancelled Orders</h2>
              <div className="orders-list">{renderOrders("Cancelled")}</div>
            </div>
            <div className="orders-section">
              <h2>Denied Orders</h2>
              <div className="orders-list">
                {renderOrders('Denied')}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserOrdersPage;
