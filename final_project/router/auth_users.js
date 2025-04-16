const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
if(users.find(user => user.username === username)){
  return false;
}
return true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
if((users.find(user => user.username === username)) && (users.find(user => user.password === password))){
  return true;
}
return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  let { username , password } = req.body;
  if(authenticatedUser(username,password)){
    let accessToken = jwt.sign({data: password}, "access", { expiresIn : '1h'});
    req.session.authorization = {
      accessToken,
      username
    }
    return res.status(202).json({message: "Sucessfully logged in", accessToken});
  }
  return res.status(401).json({message: "Invalid credentials"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const username = req.session.authorization?.username;
  const isbn = req.params.isbn;
  const review = req.body.review;
  
  if(!books[isbn]){
    return res.status(404).json({message: "Book not found"})
  }
  if(!review){
    return res.status(400).json({message: "There is no review. Please add a review"})
  }

  books[isbn].reviews[username] = review;
  return res.status(200).json({message: "Review added successfully"})

});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization?.username;
  const book = books[isbn];

  if(!book){
    return res.status(404).json({message: "Book not found"})
  }
  if(book.reviews[username]){
    delete book.reviews[username];
    return res.status(200).json({message: "Review has been deleted successfully"})
  }
  else{
    return res.status(404).json({message: "No review found"})
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
