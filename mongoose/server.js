const express = require("express");
const mongoose = require("mongoose");
const Router = require("./routes")
const app = express();

app.use(express.json());

const username = "tuhin";
const password = "PpRIHkB27zHVmRcP";
const cluster = "cluster0.kiwerfr";
const dbname = "test";

mongoose.connect(
  `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

const db = mongoose.connection;

db.on("error", error => {
  console.log('Error in MongoDb connection: ' + error)
});
db.once("open", function () {
  console.log("Connected successfully");
});

app.use(Router);

app.listen(5000, () => {
  console.log("Server is running at port 5000");
});