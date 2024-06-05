const Book = require('../models/book');
const bookService = require('../service/bookService')
module.exports.getAllBooks = async(req,res)=>{
const books = await Book.find()
if (books.length === 0) {
    return res.status(404).json({ message: 'No books found' });
  }
  res.status(200).json(books);
};

module.exports.createBook = async(req,res)=>{
    const {title , author ,genre ,price,availability }= req.body;
    const userId = req.user._id
    const bookInfo ={
    title , author ,genre ,price,availability ,userId
    }
    const book = await bookService.createBook(bookInfo)
    res.status(200).json(book)
};

module.exports.getBookInfo = async(req,res)=>{
    const bookId= req.params.id;
    const book = await bookService.getBook(bookId)
    res.status(200).json(book)
};

module.exports.updateBook = async(req,res)=>{
    const bookId= req.params.id;
    const {title , author ,genre ,price,availability }= req.body;
    const userId = req.user._id;
    const bookInfo ={
        title , author ,genre ,price,availability ,userId,bookId
        }
    const book = await bookService.editBook(bookInfo)
    res.status(200).json(book)
};


module.exports.deleteBook = async(req,res)=>{
    const bookId= req.params.id;
    const userId = req.user._id;
    const bookInfo ={
       userId,bookId
        }
     await bookService.deleteBook(bookInfo)
     res.status(200).json({message:'book delete succesful'})
}