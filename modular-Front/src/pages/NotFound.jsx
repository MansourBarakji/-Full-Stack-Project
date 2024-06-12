import { Link } from 'react-router-dom';
import  { useState } from 'react';
import '../public/NotFoundPage.css'; 
import NavBar from '../components/NavBar';

const NotFoundPage = () => {
    const [cart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
      })
  return (
    <div>
      <NavBar cart={cart} />
    <div className="not-found-container">
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link to="/">Go back to the homepage</Link>
    </div>
    </div>
  );
};

export default NotFoundPage;
