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

  const existinguser = await collection.findOne({ name: data.name });
  if (existinguser) {
    res.send("User already exists, choose a different username.");
  } else {
    const userdata = await collection.insertMany(data);
    console.log(userdata);
  }
});


//Login logic

app.post("/login", async (req, res) => {
  try {
    const check = await collection.findOne({ name: req.body.username });
    if (!check) {
      res.send("Username not found");
    } else {
      // Comparing hashed password
      const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
      if (isPasswordMatch) {
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


const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
