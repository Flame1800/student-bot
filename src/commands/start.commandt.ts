import { IBotContext } from "../context/context.interface";
import errorWraper from "../utils/errorWraper";
import navigationPattern from "../utils/navigationPattern";
import sendNoAuthWarning from "../utils/sendNoAuthWarning";
import { Command } from "./command.class";
import { Telegraf, Markup } from "telegraf";

export const navigationMenu = Markup.inlineKeyboard([
    [navigationPattern.profile.button],
    [navigationPattern.currentStatistic.button],
    [navigationPattern.schedule.button],
    [navigationPattern.gradebook.button],
    [navigationPattern.feedback.button],
    [navigationPattern.logout.button],
])



export class StartCommand extends Command {
    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
    }

    handle(): void {
        const greeting = `Добро пожаловать в бот Sielom!`
        this.bot.start(errorWraper((ctx: IBotContext) => ctx.replyWithHTML(greeting, navigationMenu)))
    }
}