import { IBotContext } from "../context/context.interface";
import { Telegraf } from "telegraf"

export abstract class Scene {
    constructor(public bot: Telegraf<IBotContext>) { } 

    abstract handle(): void;
}