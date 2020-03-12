const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
var mongo = require("mongodb").MongoClient;
const fetch = require("node-fetch");

require("dotenv").config();

const app = express();
app.use(morgan("common"));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN
  })
);
app.use(express.json());

mongo.connect(
  process.env.DATABASE_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  (err, client) => {
    if (err) {
      console.log(err);
      return;
    }

    console.log("mongoDB connected.");

    app.get("/", (req, res) => {
      res.json({
        message: "Test!"
      });
    });

    app.get("/waka", async (req, res) => {
      // const db = client.db("timeline");
      // const wakaCollection = db.collection("waka");
      // docs = await wakaCollection.find();
      // docsArray = docs.toArray();

      jsonData = await fetch(process.env.WAKADATA_URL);

      wakaData = await jsonData.json();

      res.send(
        JSON.stringify({
          wakaStats: wakaData.data
        })
      );
    });
  }
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
