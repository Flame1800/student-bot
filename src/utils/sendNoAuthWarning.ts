import { Markup } from "telegraf";
import { IBotContext } from "../context/context.interface";

export default (ctx: IBotContext) => {
        ctx.reply("Вы не авторизованны!", Markup.inlineKeyboard([
            Markup.button.callback('Авторизоваться', 'login')
        ]));
}