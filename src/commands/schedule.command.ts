import { IBotContext } from "../context/context.interface";
import navigationPattern from "../utils/navigationPattern";
import sendNoAuthWarning from "../utils/sendNoAuthWarning";
import { Command } from "./command.class";
import { Markup, Telegraf } from "telegraf";

export class ScheduleCommand extends Command {
    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
    }

    handle(): void {
        this.bot.action(navigationPattern.schedule.value, async (ctx) => {
            if (!ctx.session.user_id && !ctx.session.user) {
                return sendNoAuthWarning(ctx);
            }



            ctx.editMessageText(`Расписание для группы ${ctx.session.user?.group}`, {
                parse_mode: "HTML",
                reply_markup: {
                    inline_keyboard: [
                        [Markup.button.webApp('Открыть', `https://sielom.ru/timetable/group/${ctx.session.user?.group_id}?week=curr`)],
                        [navigationPattern.backToMenu.button]
                    ]
                }
            });
        })
    }
} 