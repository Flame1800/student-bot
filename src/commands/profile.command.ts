import { IBotContext } from "../context/context.interface";
import { Command } from "./command.class";
import { Telegraf } from "telegraf";
import mockData from "../../data/db.json"

export class ProfileCommand extends Command {
    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
    }

    handle(): void {
        const data = mockData
        const {firstName, lastName, group, course} = data.profile

        this.bot.hears("Профиль", (ctx) => {
            // Обработка текстовых сообщений
            ctx.reply(`Ваш профиль: \n${firstName} ${lastName}. ${group} группа, ${course} курс`);
        }); 
    }
}