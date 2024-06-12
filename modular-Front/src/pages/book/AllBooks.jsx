import { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAsync';
import NavBar from '../../components/NavBar';
import '../../public/Books.css'; 

const BooksPage = () => {
  const { search, loading, error } = useAuth();
  const [books, setBooks] = useState([]);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  })
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 4,
    totalBooks: 0,
    totalPages: 0,
  });

useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await search({ query, sort, pageNumber: pagination.currentPage });
      if (response) {
        setBooks(response.books);
        setPagination(response.pagination);
      }
    };
    fetchBooks();
  }, [search, query, sort, pagination.currentPage]);
 
  const handlePageChange = (newPage) => {
     setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };
  const handleSearchChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  const addToCart = (book) => {
    setCart((prevCart) => {
      const existingBook = prevCart.find((item) => item.bookId === book._id);
      if (existingBook) {
        return prevCart.map((item) =>
          item.bookId === book._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { bookId: book._id, title: book.title, price: book.price, quantity: 1 }];
      }
    });
   
  };

  return (
    <div>
      <NavBar cart={cart} />
      <div className="search-container">
        <input
          type="text"
          placeholder="Search books..."
          value={query}
          onChange={handleSearchChange}
          className="search-input"
        />
        <select value={sort} onChange={handleSortChange} className="sort-select">
          <option value="">Sort by</option>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>
      <h1>Books</h1>
      <div className="books-container">
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {!loading && books.length === 0 && <p>No books available.</p>}
        {books.length > 0 && (
          <div className="books-list">
            {books.map((book, index) => (
              <div key={index} className="book-item">
                <h2>{book.title}</h2>
                <p>Author: {book.author}</p>
                <p>Genre: {book.genre}</p>
                <p>Price: ${book.price}</p>
                <button onClick={() => addToCart(book)}>
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
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
      </div>
    </div>
  );
};

export default BooksPage;
