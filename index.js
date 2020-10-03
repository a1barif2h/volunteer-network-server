const express = require("express");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const bodyParser = require("body-parser");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.znbod.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = 5000;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const volunteerTaskCollection = client
    .db("volunteerdb")
    .collection("volunteerTask");

  app.post("/addVolunteerTask", (req, res) => {
    const newVolunteerTask = req.body;
    volunteerTaskCollection.insertMany(newVolunteerTask).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/volunteerTasks", (req, res) => {
    volunteerTaskCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port);
