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
  (err, db) => {
    if (err) {
      console.log(err);
      return;
    }

    console.log("mongoDB connected.");

    async function getWakaData() {
      const overlapDays = 1;

      const jsonData = await fetch(process.env.WAKADATA_URL);
      const wakaDataJSON = await jsonData.json();
      const wakaData = wakaDataJSON.data;

      const timeline = db.db("timeline");
      const mongoData = await timeline
        .collection("waka-data")
        .find({
          "waka.range.date": { $gte: wakaData[0].range.date }
        })
        .toArray();
      const upsertData = wakaData.slice(mongoData.length - overlapDays);

      var ind = mongoData.length - overlapDays;
      for (let i = 0; i < upsertData.length; i++) {
        try {
          if (ind < mongoData.length) {
            //upsert
            const id = mongoData[ind]._id;
            const upsertRes = await timeline
              .collection("waka-data")
              .replaceOne(
                { _id: id },
                { waka: upsertData[i] },
                { upsert: true }
              );
          } else {
            //insert
            const insertRes = await timeline
              .collection("waka-data")
              .insertOne({ waka: upsertData[i] });
          }
          ind++;
        } catch (e) {
          console.log(e);
        }
      }
      return upsertData;
    }

    async function trackWakaTime() {
      const updatedDocs = await getWakaData();
      console.log(`${updatedDocs.length} documents updated.`);
    }

    console.log("Starting setInterval for wakatime stats");
    (() => trackWakaTime())();
    setInterval(trackWakaTime, 1000 * 60 * 60 * 6);

    // async function removeExtraWakaData() {
    //   const timeline = db.db("timeline");
    //   const mongoData = await timeline
    //     .collection("waka-data")
    //     .find()
    //     .toArray();

    //   var deleteObjs = [];
    //   for (let i = 0; i < mongoData.length; i++) {
    //     if (i >= 30) {
    //       // deleteObjs.push({ _id: mongoData[i]._id });
    //       const deletion = await timeline
    //         .collection("waka-data")
    //         .deleteMany({ _id: mongoData[i]._id });
    //       console.log(deletion);
    //     }
    //   }
    //   return mongoData;
    // }

    app.get("/", (req, res) => {
      res.json({
        message: "Test!"
      });
    });

    app.get("/waka", async (req, res) => {
      const timeline = db.db("timeline");

      const wakaCollection = timeline.collection("waka-data");
      var mongoData = await wakaCollection.find().toArray();

      res.send(
        JSON.stringify({
          wakaStats: mongoData
        })
      );
    });

    app.get("/test", async (req, res) => {
      const data = await getWakaData();
      res.json(JSON.stringify({ test: data }));
    });
  }
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
