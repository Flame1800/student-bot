import Bot from "./bot";
import { ConfigService } from "./config/config.service";
import express from "express";

const app = express();

const bot = new Bot(new ConfigService());
bot.init();

app.listen(6000, () => console.log("Listening on port", 6000));