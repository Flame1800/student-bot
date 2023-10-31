import mongoose from "mongoose";
import Bot from "./bot";
import { ConfigService } from "./config/config.service";
import express from "express";

const app = express();
const bot = new Bot(new ConfigService());

bot.init();

const connectToDb = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/schedule", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as mongoose.ConnectOptions);
    } catch (e) {
        console.log("Ошибка: ", e);
    }
};

connectToDb().then(() => {
    const port = 6000;
    app.listen(port);
    console.log(`Server is start on port ${port}`);
});
