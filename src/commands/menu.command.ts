import { IBotContext } from "../context/context.interface";
import { Command } from "./command.class";
import {Telegraf, Markup } from "telegraf";

export class MenuCommand extends Command {
    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
    }

    handle(): void {
        this.bot.command("menu", (ctx) => {
            console.log(ctx.session);
            
            ctx.reply("Меню: ", Markup.keyboard([
                Markup.button.text("Профиль"),
                Markup.button.text("Статистика"),
                Markup.button.text("Расписание"),
            ]).resize());
        })
    }
}