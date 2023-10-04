import { User } from "@sentry/nextjs";
import { IBotContext } from "../context/context.interface";
import { Telegraf } from "telegraf"

export abstract class Command {
    constructor(public bot: Telegraf<IBotContext>) { } 

    abstract handle(): void;
}