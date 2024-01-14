import { Markup } from "telegraf";
import { IBotContext } from "../context/context.interface";

export default async (ctx: IBotContext) => {
  try {
    await ctx
      .reply(
        "Вы не авторизованны!",
        Markup.inlineKeyboard([
          Markup.button.callback("Авторизоваться", "login"),
        ])
      )
  } catch (error) {
    ctx.reply(`Произошла ошибка: \n\n ${error}`);
  }
};
