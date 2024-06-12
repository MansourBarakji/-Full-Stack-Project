import NavBar from '../components/NavBar';
import  { useState } from 'react';

import '../public/Statistics.css'; 

const Home = () => {
  const [cart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  })  
  return (
    <div> 
       <NavBar cart={cart}  />
    <div  className="container">
    
      <h2>Welcome to the Home Page</h2>
      
    </div>
    </div>
  );
};

export default Home;
