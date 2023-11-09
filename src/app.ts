import mongoose from "mongoose";
import Bot from "./bot";
import { ConfigService } from "./config/config.service";
import express from "express";
import { MongoClient } from "mongodb";

const app = express();

mongoose.connect("mongodb://localhost:27017/schedule")

MongoClient.connect("mongodb://localhost:27017/schedule").then((client) => {
  const db = client.db();
  const bot = new Bot(db, new ConfigService());
  bot.init();

  const port = 6001;
  app.listen(port);

  console.log(`Server is start on port ${port}`);
});
