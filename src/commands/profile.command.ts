import { IBotContext } from "../context/context.interface";
import { Command } from "./command.class";
import { Telegraf } from "telegraf";
import sendNoAuthWarning from "../utils/sendNoAuthWarning";
import navigationPattern from "../utils/navigationPattern";

export class ProfileCommand extends Command {
    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
    }

    handle(): void {
        this.bot.action(navigationPattern.profile.value, (ctx) => {
            if (!ctx.session.user_id) {
                return sendNoAuthWarning(ctx)
            }
            
            const {name, group} = ctx.session.user

            ctx.replyWithHTML(`Ваш профиль: \n\n<b>${name}</b> \n<i>${group} группа</i>`);
        }); 
    } 
}