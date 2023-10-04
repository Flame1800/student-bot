import { IBotContext } from "../context/context.interface";
import { Command } from "./command.class";
import { Telegraf } from "telegraf";
import mockData from "../../data/db.json"
import sendNoAuthWarning from "../utils/sendNoAuthWarning";
import navigationPattern from "../utils/navigationPattern";

export class ProfileCommand extends Command {
    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
    }

    handle(): void {
        const data = mockData
        const {firstName, lastName, group, course} = data.profile


        // this.bot.hears(navigationPattern.profile, (ctx) => {
        //     if (!ctx.session.user_id) {
        //         return sendNoAuthWarning(ctx)
        //     }
            
        //     ctx.replyWithHTML(`Id: <b>${ctx.session.user_id}</b> \nВаш профиль: \n${firstName} ${lastName}. ${group} группа, ${course} курс`);
        // }); 
    } 
}