import { IBotContext } from "../context/context.interface";
import { Command } from "./command.class";
import {Telegraf, Markup } from "telegraf";

export class StartCommand extends Command {
    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
    }

    handle(): void {
        this.bot.start((ctx) => {
            ctx.reply("Добро пожаловать в личный кабинет студента!", Markup.keyboard([
                Markup.button.text("Профиль"),
                Markup.button.text("Статистика"),
                Markup.button.text("Расписание"),
            ]).resize());
        })
    }
}