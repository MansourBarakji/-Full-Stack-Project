import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import useApi from "../../hooks/useApi";
import "../../public/EditBook.css";

const EditBookPage = () => {
  const { editBook, loading, error } = useApi();
  const location = useLocation();
  const navigate = useNavigate();
  const { book } = location.state;

  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [genre, setGenre] = useState(book.genre);
  const [quantity, setQuantity] = useState(book.quantity);
  const [price, setPrice] = useState(book.price);
  const [availability, setAvailability] = useState(book.availability);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await editBook({
      id: book._id,
      title,
      author,
      genre,
      quantity: parseInt(quantity, 10), // Ensure quantity is a number
      price: parseFloat(price), // Ensure price is a number with decimals
      availability,
    });
    if (response && response.message) {
      setMessage(response.message);
      setTimeout(() => {
        navigate("/userBooks");
      }, 2000);
    }
  };

  return (
    <div className="edit-book-container">
      <div className="edit-book-header">
        <Link to="/userBooks" className="back-link">
          Go Back
        </Link>
      </div>
      <h1>Edit Book</h1>
      <form onSubmit={handleSubmit} className="edit-book-form">
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Author:</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Genre:</label>
          <input
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Price:</label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
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
        {error && <p className="error-message"> {error}</p>}
        {message && <p className="success-message">{message}</p>}
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? "Updating..." : "Update Book"}
        </button>
      </form>
    </div>
  );
};

export default EditBookPage;
