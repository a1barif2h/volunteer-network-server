const express = require("express");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const bodyParser = require("body-parser");
const ObjectID = require("mongodb").ObjectID;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.znbod.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = 5000;

app.get("/", (req, res) => {
  res.send("Hello db it's working");
});

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const volunteerTaskCollection = client
    .db("volunteerdb")
    .collection("volunteerTask");

  const registeredEvents = client.db("volunteerdb").collection("registered");

  app.post("/addVolunteerTask", (req, res) => {
    const newVolunteerTask = req.body;
    volunteerTaskCollection.insertMany(newVolunteerTask).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/add-event", (req, res) => {
    volunteerTaskCollection.insertOne(req.body).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/submit-register", (req, res) => {
    const newRegisterEvent = req.body;
    registeredEvents.insertOne(newRegisterEvent).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/volunteerTasks", (req, res) => {
    volunteerTaskCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/user-events", (req, res) => {
    registeredEvents
      .find({ email: req.headers.email })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  app.get("/registered-events", (req, res) => {
    registeredEvents.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.delete("/cancel-event", (req, res) => {
    registeredEvents
      .deleteOne({ _id: ObjectID(req.headers.id) })
      .then((result) => {
        res.send(result.deletedCount > 0);
      });
  });
});

app.listen(process.env.PORT || port);
