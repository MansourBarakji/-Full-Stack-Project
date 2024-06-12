import { Link,useNavigate } from 'react-router-dom';
import { useState,useEffect } from 'react';
import useAuth from '../../hooks/useAsync';
import '../../public/CreateBook.css'; 


const CreateBookPage = () => {

 const { createBook, loading, error } = useAuth();
  const navigate = useNavigate(); 

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [availability, setAvailability] = useState(false);
  const [message, setMessage] = useState('');
 

  useEffect(() => {
    if (error === "You must be logged in first") {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 2000); 
      return () => clearTimeout(timer); 
    }
  }, [error, navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await createBook({
        title,
        author,
        genre,
        quantity: parseInt(quantity, 10),
         price: parseFloat(price), 
        availability,
      });
    if (response && response.message) {
      setMessage(response.message);
       setTimeout(() => {
        navigate('/userBooks');
      }, 2000); 
     
    }
  };

  return (
    <div className="create-book-container">
      <div className="create-book-header">
        <Link to="/userBooks" className="back-link">My Books</Link>
      </div>
      <h1>Create Book</h1>
      <form onSubmit={handleSubmit} className="create-book-form">
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="title"
            required
          />
        </div>
        <div className="form-group">
          <label>Author:</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="author"
            required
          />
        </div>
        <div className="form-group">
          <label>Genre:</label>
          <input
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            placeholder="genre"
            required
          />
        </div>
        <div className="form-group">
          <label>Price:</label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="price"
            required
          />
        </div>
        <div className="form-group">
          <label>Quantity:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            min="0"
          />
        </div>
        <div className="form-group">
          <label>Availability:</label>
          <input
            type="checkbox"
            checked={availability}
            onChange={(e) => setAvailability(e.target.checked)}
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Creating...' : 'Create Book'}
        </button>
      </form>
     
    </div>
  );
};


export default CreateBookPage;
