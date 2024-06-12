import { Link,useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import useAuth from '../../hooks/useAsync';
import '../../public/BookVersion.css'; 


const BookVersionPage = () => {

 const { switchBook, loading, error } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { version } = location.state; 
   const [message, setMessage] = useState('');

   
  const handleEditClick = async (id) => {
    const response = await switchBook(id);
    if (response && response.message) {
      setMessage(response.message);
       setTimeout(() => {
        navigate('/userBooks');
      }, 2000); 
     
    }
  };

  return (
    <div className="book-container">
      <div className="book-header">
        <Link to="/userBooks" className="back-link">Go Back</Link>
      </div>
      <h1>Old Book Version</h1>
      <div  className="book-item">
         <h2>Title: {version.title}</h2>
         <p>Author: {version.author}</p>
        <p>Genre: {version.genre}</p>
         <p>Price: ${version.price}</p>
         <p>Quantity: {version.quantity}</p>
          <p>Availble: {(version.availability)?('Yes'):('No')}</p>
          <p>Version Date: {new Date(version.versionDate).toLocaleString()}</p>
          <div className="book-actions">
            <p><strong> Do You Want to Use this Version ?</strong></p>
            <button className="edit-button" disabled={loading}  onClick={() => handleEditClick(version._id)}>
           {loading ? 'Switching...' : 'Use'}</button>
           </div>
           {error && <p className="error-message"> {error}</p>}
           {message && <p className="success-message">{message}</p>}
       
          </div>
    </div>
  );
};


export default BookVersionPage;
