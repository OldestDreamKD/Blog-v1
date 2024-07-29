const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(bodyparser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

const mongousername = process.env.MONGO_USERNAME;
const mongopassword = process.env.MONGO_PASSWORD;
const url =
  "mongodb+srv://" +
  mongousername +
  ":" +
  mongopassword +
  "@cluster0.aqlnrgj.mongodb.net/entriesDB";
mongoose.connect(url);

const entryschema = new mongoose.Schema({
  title: String,
  entry: String,
});

const Entry = mongoose.model("Entry", entryschema);

app.get("/", function (req, res) {
  Entry.find().then(function (Entry) {
    res.render("home", {
      Entry: Entry,
    });
  });
});

app.post("/entry", function (req, res) {
  const entryID = req.body.entryID;
  Entry.find({ _id: entryID }).then(function (Entry) {
    res.render("entries", {
      Entry: Entry,
    });
  });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  console.log(req.body);
  const entry = new Entry({
    title: req.body.Title,
    entry: req.body.Post,
  });
  entry.save();
  res.redirect("/");
});

app.get("/entry/:PostID", function (req, res) {
  const PostID = req.params.PostID;
  Entry.find({ _id: PostID }).then(function (Entry) {
    res.render("post", {
      Entry: Entry,
    });
  });
});

app.get("/delete/:entryID", function (req, res) {
  const entryID = req.params.entryID;
  Entry.deleteOne({ _id: entryID }).then(function (response) {
    res.redirect("/");
  });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.get("/contact", function (req, res) {
  res.render("contact");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
