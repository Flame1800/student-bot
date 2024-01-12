import mongoose from "mongoose";
import Bot from "./bot";
import { ConfigService } from "./config/config.service";
import { MongoClient } from "mongodb";

mongoose.connect("mongodb://localhost:27017/schedule")

MongoClient.connect("mongodb://localhost:27017/schedule").then((client) => {
  const db = client.db();
  const bot = new Bot(db, new ConfigService());
  bot.init();
});
