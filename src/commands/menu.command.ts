import { IBotContext } from "../context/context.interface";
import navigationPattern from "../utils/navigationPattern";
import { Command } from "./command.class";
import {Telegraf } from "telegraf";
import { navigationMenu } from "./start.commandt";

export class MenuCommand extends Command {
    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
    }

    handle(): void {
        this.bot.action(navigationPattern.navigationMenu.value, (ctx) => {
            ctx.reply("Чем я могу вам помочь? ", navigationMenu);
        })
    }
}