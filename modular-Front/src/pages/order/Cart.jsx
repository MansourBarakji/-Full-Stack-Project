import {  useNavigate } from 'react-router-dom';
import { useState ,useEffect } from 'react';
import useAuth from '../../hooks/useAsync';
import NavBar from '../../components/NavBar';
import '../../public/Cart.css'; 

const CartPage = () => {
  const { createOrder, loading, error } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  })

  useEffect(() => {
    if (error === "You must be logged in first") {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 2000); 
      return () => clearTimeout(timer); 
    }
  }, [error, navigate]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const handleQuantityChange = (bookId, newQuantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.bookId === bookId ? { ...item, quantity: newQuantity } : item
      )
    );
  };
 
  const handleRemoveBook = (bookId) => {
    setCart((prevCart) => prevCart.filter((item) => item.bookId !== bookId));
  };
 
  const handleCheckout = async (e) => {
    e.preventDefault();
    const items = cart.map((item) => ({
      bookId: item.bookId,
      quantity: item.quantity,
    }));
    const response = await createOrder({ items });
    if (response ) {
      navigate('/completeOrder', { state: { order:response }});
     
    }
  };
 
  return (
    <div>
    <NavBar />
    <div className="cart-content">
      <h1>Cart</h1>
      {cart.length === 0 && <p  className="mess">No items in the cart...</p>}
      {cart.length > 0 && (
        <div>
          {cart.map((book, index) => (
            <div key={index} className="cart-item">
              <h2>{book.title}</h2>
              <p>Price: ${book.price}</p>
              <div className="quantity-input">
                <label>Quantity:</label>
                <input
                  type="number"
                  value={book.quantity}
                  onChange={(e) =>
                    handleQuantityChange(
                      book.bookId,
                      parseInt(e.target.value, 10)
                    )
                  }
                  min="1"
                />
              </div>
              <button
                onClick={() => handleRemoveBook(book.bookId)}
                className="remove-button"
              >
                Remove
              </button>
            </div>
          ))}
           {error && <p> {error}</p>}
          <button onClick={handleCheckout} disabled={loading} className="checkout-button">
            {loading ? 'Processing...' : 'Checkout'}
          </button>
        </div>
      )}
     
    </div>
  </div>
);
};

export default CartPage;
