import { IBotContext } from "../context/context.interface";
import getGroups from "../endpoints/getGroups";
import navigationPattern from "../utils/navigationPattern";
import sendNoAuthWarning from "../utils/sendNoAuthWarning";
import { Command } from "./command.class";
import {Markup, Telegraf } from "telegraf";

export class ScheduleCommand extends Command {
    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
    }

    handle(): void {
        this.bot.action(navigationPattern.schedule.value, async (ctx) => {
            if (!ctx.session.user_id && !ctx.session.user) {
                return sendNoAuthWarning(ctx); 
            }

            ctx.reply(`Рассписание для группы ${ctx.session.user?.group}`, Markup.inlineKeyboard([
                Markup.button.webApp('Открыть', `https://sielom.ru/timetable/group/${ctx.session.user?.group_id}?week=curr`)
            ]))
        })
    }
} 