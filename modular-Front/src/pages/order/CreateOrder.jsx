import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import useApi from "../../hooks/useApi";
import NavBar from "../../components/NavBar";
import "../../public/CompleteOrder.css";

const CompleteOrderPage = () => {
  const { completeOrder, loading, error } = useApi();
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state;
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await completeOrder({
      orderId: order._id,
      address,
      phoneNumber,
      paymentMethod,
    });
    if (response) {
      localStorage.setItem("cart", []);
      navigate("/orderInfo", { state: { order: response } });
    }
  };

  return (
    <div>
      <NavBar cart={cart} />
      <div className="complete-order-container">
        <h1>Complete Order</h1>
        <form onSubmit={handleSubmit} className="complete-order-form">
          <div className="form-group">
            <label>Address:</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone Number:</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Payment Method:</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              required
            >
              <option value="" disabled>
                Select payment method
              </option>
              <option value="Cash on Delivery">Cash on Delivery</option>
              <option value="Card">Card</option>
            </select>
          </div>
          {error && <p className="error-message"> {error}</p>}
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? "Completing..." : "Complete Order"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteOrderPage;
