const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const config = require("./utils/config");
const notesRouter = require("./controllers/blogs");
const logger = require("./utils/logger");

const app = express();

mongoose
  .connect(config.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    logger.info("Connected to MongoDB!");
  })
  .catch((error) => {
    logger.error("Error connecting to MongoDB: ", error);
  });

app.use(cors());
app.use(express.json());
app.use("/api/blogs", notesRouter);

module.exports = app;
