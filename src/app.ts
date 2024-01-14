import mongoose from "mongoose";
import Bot from "./bot";
import { ConfigService } from "./config/config.service";
import { MongoClient } from "mongodb";
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "https://789945f4cd37574f89de241e06f2d997@o4505945796575232.ingest.sentry.io/4506559641288704",

  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
});

const transaction = Sentry.startTransaction({
  op: "test",
  name: "My First Test Transaction",
});

setTimeout(() => {
  try {
    Sentry.captureException('test');
  } catch (e) {
  } finally {
    transaction.finish();
  }
}, 99);


mongoose.connect("mongodb://localhost:27017/schedule")

MongoClient.connect("mongodb://localhost:27017/schedule").then((client) => {
  const db = client.db();
  const bot = new Bot(db, new ConfigService());
  bot.init();
});
