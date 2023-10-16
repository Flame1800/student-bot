import { IBotContext } from "../context/context.interface";
import navigationPattern from "../utils/navigationPattern";
import { Command } from "./command.class";
import {Telegraf } from "telegraf";
import { navigationMenu } from "./start.commandt";
import sendNoAuthWarning from "../utils/sendNoAuthWarning";

export class MenuCommand extends Command {
    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
    }

    handle(): void {
        this.bot.action(navigationPattern.navigationMenu.value, (ctx) => {
            if (!ctx.session.user_id) {
                return sendNoAuthWarning(ctx)
            }

            ctx.reply("Чем я могу вам помочь? ", navigationMenu);
        })
        
        this.bot.command("menu", (ctx) => {
            if (!ctx.session.user_id) {
                return sendNoAuthWarning(ctx)
            }

            ctx.reply("Чем я могу вам помочь? ", navigationMenu);
        })
    }
}