/* eslint-disable react/no-unescaped-entities */
import  { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAsync';
import {Link, useNavigate  } from 'react-router-dom'; 
import NavBar from '../../components/NavBar';
import '../../public/UserBooks.css'; 

const UserBooksPage = () => {
  const { getUserBooks,deleteOldBook,deleteBook, loading } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [cart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 4,
    totalBooks: 0,
    totalPages: 0,
  });
  

  useEffect(() => {
    const fetchBooks = async (pageNumber) => {
      const response = await getUserBooks(pageNumber);
      if (response) {
        setBooks(response.books);
        setPagination(response.pagination);
      }
    };
    fetchBooks(pagination.currentPage);
  }, [getUserBooks, pagination.currentPage]);

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  const handleDeleteOldBook = async (id) => {
    await deleteOldBook(id);
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.versions
          ? {
              ...book,
              versions: book.versions.filter((version) => version._id !== id),
            }
          : book
      )
    );
  };

  const handleDeleteBook = async (id) => {
    await deleteBook(id);
    setBooks((prevBooks) => prevBooks.filter((book) => book._id !== id));
  };

  const handleViewClick = (version) => {
    navigate('/bookVersion', { state: { version } });
  };
  const handleEditClick = (book) => {
    navigate('/editBook', { state: { book } });
  };
  return (
    <div>
      <NavBar cart={cart} />
      <div className="my-books-container">
        <h1>My Books</h1>
        {loading && <p>Loading...</p>}
        {!loading && books.length === 0 && <p>You don't have any books.</p>}
        <div className="create-link">
          <Link to="/createBook">Create</Link>
        </div>
         <div className="pagination">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              disabled={page === pagination.currentPage}
            >
              {page}
            </button>
          ))}
        </div>
        {books.length > 0 && (
        <div className="books-list">
        {books.map((book, index) => (
       <div key={index} className="book-item">
        <h2>{book.title}</h2>
        <p>Author: {book.author}</p>
        <p>Genre: {book.genre}</p>
        <p>Price: ${book.price}</p>
        <p>Quantity: {book.quantity}</p>
        <p>Availble: {(book.availability) ? ('Yes') : ('No')}</p>
        <button className="edit-button" onClick={() => handleEditClick(book)}>Edit</button>
        <button className="delete-button" onClick={() => handleDeleteBook(book._id)}>Delete</button>
        <div className="book-versions">
          {book.versions && book.versions.length > 0 ? (
            <>
              <h3>Old Versions</h3>
              {book.versions.map((version, versionIndex) => (
                <div key={versionIndex} className="version-item">
                  <p><strong>Title:</strong> {version.title}</p>
                  <p><strong>Version Date:</strong> {new Date(version.versionDate).toLocaleString()}</p>
                  <button className="view-button" onClick={() => handleViewClick(version)}>View</button>
                  <button className="delete-button" onClick={() => handleDeleteOldBook(version._id)}>Delete</button>
                </div>
              ))}
            </>
          ) : (
            <p className="no-old-version">This book has no old versions.</p>
          )}
        </div>
      </div>
    ))}
  </div>
)}
        
      </div>
    </div>
  );
};
 
export default UserBooksPage;
