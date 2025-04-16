const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username or Password haven't been provided." });
  }
  if (isValid(username)) {
    const user = { username, password };
    users.push(user);
    console.log(users);
    return res.status(201).json({ message: "User has been created" })
  }
  return res.status(400).json({ message: "Username already exists" });
});

function getBooks(){
  return new Promise((reolve,reject) =>{
    setTimeout(() =>{
      reolve(books)
    },1000)
  })
}

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  //return res.json(books);
  //return res.status(300).json({message: "Yet to be implemented"});
  getBooks().then((allBooks) => {
    res.status(200).send(allBooks)
  })
});

function getBooksByIsbn(isbn) {
  return new Promise((resolve, reject) =>{
    setTimeout(() =>{
      const book = books[isbn];

      if (book) {
        resolve(book);
      } else {
        reject("Book not found");
      }
    }, 1000)
  })
}
// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  // if (book) {
  //   
  // } else {
  //   return res.status(404).json({ message: "Book not found" });
  // }
  getBooksByIsbn(isbn).then((book) => {
    return res.status(200).json(book);
  })
  .catch((error) =>{
    return res.status(404).json({ message: error});
  })
});

function getBooksByAuthor(author){
  return new Promise((resolve, reject) =>{
    setTimeout(() => {
      const filteredBooks = Object.values(books).filter(book =>
        book.author.toLowerCase().includes(author)
      );
    
      if (filteredBooks.length > 0) {
        resolve(filteredBooks);
      } else {
       reject("No books found for this author");
      }
    },1000)
  })
}
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here

   const author = req.params.author.toLowerCase();
   getBooksByAuthor(author).then((books) =>{
    res.status(200).send(books)
   })
   .catch((error) => {
    res.status(404).json({message : error})
   })
  // const filteredBooks = Object.values(books).filter(book =>
  //   book.author.toLowerCase().includes(author)
  // );

  // if (filteredBooks.length > 0) {
  //   return res.status(200).json(filteredBooks);
  // } else {
  //   return res.status(404).json({ message: "No books found for this author" });
  // }

});

function getBooksByTitle(title){
  return new Promise((resolve, reject) =>{
    setTimeout(() =>{
      const filteredBooks = Object.values(books).filter(book =>
        book.title.toLowerCase().includes(title)
      );
    
      if (filteredBooks.length > 0) {
        resolve(filteredBooks);
      } else {
        reject("No books found with this title" );
      }
    },1000)
  })
}

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here

  const title = req.params.title.toLowerCase();
  getBooksByTitle(title).then((book) =>{
    res.status(200).json(book);
  })
  .catch((error) =>{
    res.status(404).json({ message: error});
  })
  // const filteredBooks = Object.values(books).filter(book =>
  //   book.title.toLowerCase().includes(title)
  // );

  // if (filteredBooks.length > 0) {
  //   return res.status(200).json(filteredBooks);
  // } else {
  //   return res.status(404).json({ message: "No books found with this title" });
  // }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }

});

module.exports.general = public_users;
