require('dotenv').config();
const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const session = require('express-session'); // Add express-session
const collection = require('./config'); // Assuming this is a MongoDB collection

const app = express();

// Generate a random string of 32 characters for a sessesion key
 const dotenv = require('dotenv');

const fs = require('fs');

// Load environment variables from .env file
dotenv.config();

const generateSecretKey = () => {
  // Check if SESSION_SECRET is defined in .env
  if (process.env.SESSION_SECRET) {
    return process.env.SESSION_SECRET;
  }

  // If not defined, generate a new secret key
  const newSecret = crypto.randomBytes(16).toString('hex');

  // Save the new secret key to .env file
  fs.appendFileSync('.env', `\nSESSION_SECRET=${newSecret}`);

  return newSecret;
};


// console.log(generateSecretKey());

// convert data into json format
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

// Use EJS as the view engine
app.set('view engine', 'ejs');

// Adding static file to link style.css
app.use(express.static("public"));

// Add express-session middleware and ensuring https encryption on data on transit
// added .env to manage secretckey

const sessionSecret = process.env.SESSION_SECRET || generateSecretKey();
console.log('Session Secret:', sessionSecret);
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
   cookie: {
    secure: true
}

}));


// Rendering login page
app.get('/login', (req, res) => {
  res.render('login');
});

// Rendering signup page
app.get('/signup', (req, res) => {
  res.render('signup');
});

// Register User
app.post("/signup", async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).send('Username and password are required');
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const data = {
    name: req.body.username,
    password: hashedPassword,
  };

  const existingUser = await collection.findOne({ name: data.name });
  if (existingUser) {
    res.send("User already exists, choose a different username.");
  } else {
    const userData = await collection.insertMany(data);
    console.log(userData);
    res.render("home");
  }
});

// Login logic
app.post("/login", async (req, res) => {
  try {
    const check = await collection.findOne({ name: req.body.username });
    if (!check) {
      res.send("Username not found");
    } else {
      // Comparing hashed password
      const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
      if (isPasswordMatch) {
        // Set user as authenticated in the session
        req.session.user = check;
         console.log('Session Object:', req.session);
        res.render("home");
      } else {
        res.send("Wrong password");
      }
    }
  } catch (error) {
    console.error(error);
    res.send("Error in login process");
  }
});

// Logout logic
app.get('/logout', (req, res) => {
  // Destroy the session to log out the user
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.send("Error in logout process");
    } else {
      res.redirect('/login'); // Redirect to login page after logout
    }
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
