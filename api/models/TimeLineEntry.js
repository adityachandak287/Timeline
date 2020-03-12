const mongoose = require("mongoose");

const { Schema } = mongoose;

const TimeLineEntrySchema = new Schema(
  {
    itemName: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    locationURL: String,
    note: String,
    count: {
      type: Number,
      min: 0,
      default: 0,
      required: true
    },
    date: {
      required: true,
      type: Date
    }
  },
  {
    timestamps: true
  }
);

const TimeLineEntry = mongoose.model("TimeLineEntry", TimeLineEntrySchema);

module.exports = TimeLineEntry;
