//import express
const express = require("express");

//import mongodb
const { MongoClient, ServerApiVersion } = require("mongodb");

//import dotenv
require("dotenv").config();

const fetch = require("node-fetch");

const request = require("request");

//initialize express app
const app = express();

//import middleware
const cors = require("cors");
const res = require("express/lib/response");
app.use(cors());

//body parser
app.use(express.json());

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gmdfr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("siciliamia");
    const searchHistoryCollection = database.collection("search_history");

    //get search history from our api
    app.get("/history", async (req, res) => {
      //finds the search history from mongodb server
      const cursor = searchHistoryCollection.find({});
      const history = await cursor.toArray();
      res.send(history);
    });

    // post search history to our api
    app.post("/history", async (req, res) => {
      const newHistory = req.body;
      //post data to mongodb
      const addHistory = await searchHistoryCollection.insertOne(newHistory);
      console.log(req.body);
      res.json(addHistory);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

//fetching public API and getting all the entries
app.get("/", async (req, res) => {
  const url = "https://api.publicapis.org/entries";
  try {
    await fetch(url)
      .then((res) => res.json())
      .then((data) => res.send(data));
  } catch (err) {
    console.log(err);
  }
});

//get response from index
app.get("/", (req, res) => {
  res.send("Hello Siciliamia Family");
});

//listen to port 5000
app.listen(port, () => {
  console.log("listening to port", port);
});
