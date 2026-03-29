require("dotenv").config(); // ⭐ ADD THIS LINE

const mongoose = require("mongoose");
const Listing = require("../models/listing");
const initData = require("./data");

const dbUrl = process.env.ATLASDB_URL;

async function main() {
  await mongoose.connect(dbUrl);
  console.log("Connected to Atlas");
}

main();

const initDB = async () => {
  await Listing.deleteMany({});

  const data = initData.data.map((obj) => ({
    ...obj,
    owner: new mongoose.Types.ObjectId("69c91624447020a85b18a693"),
  }));

  await Listing.insertMany(data);

  console.log("Data inserted into Atlas");
};

initDB();


