const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const collection = require('./config'); // Assuming this is a MongoDB collection

const app = express();

// convert data into json format
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

// Use EJS as the view engine
app.set('view engine', 'ejs');

// Adding static file to link style.css
app.use(express.static("public"));

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

  try {
    const userdata = await collection.insertMany(data);
   // const userdata = await collection.create(data, { wtimeout: 3000});
    console.log(userdata);
    res.status(201).send('User registered successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error:');
  }
});


const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
