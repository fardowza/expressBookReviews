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
  const { username , password } = req.body;
  if(authenticatedUser(username,password)){
    const accessToken = jwt.sign({ username}, "SomeNonsense", { expiresIn : '1h'});;
    return res.status(202).json({message: "Sucessfully logged in", accessToken});
  }
  return res.status(401).json({message: "Invalid credentials"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
