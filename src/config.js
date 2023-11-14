const mongoose = require("mongoose");

const connect =mongoose.connect("mongodb://0.0.0.0:27017/PesaFastDb");

// Check if the connection is established or not
connect.then(() => {
  console.log("Database connected successfully");
}).catch((error) => {
  console.error("Connection to database failed:", error.message);
});

// create a schema
const LoginSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// collection is a table part, i.e., creating the model
const collection = mongoose.model("users", LoginSchema);

module.exports = collection;
