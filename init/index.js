const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const Mongo_URL = "mongodb://127.0.0.1:27017/wanderLust";

main()
  .then(() => {
    console.log("Connected to MongoDB successfully");
  }).catch((err) => {
    console.log("Error connecting to MongoDB:", err);
  });

async function main() {
    await mongoose.connect(Mongo_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj => ({
      ...obj, 
      owner: "69beef5930b1c0f4fcda4e04",
    })));
    await Listing.insertMany(initData.data);
    console.log("Database initialized with sample data.");
}

initDB();

