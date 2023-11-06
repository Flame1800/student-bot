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
      .catch((err) => console.log("Ошибка", err));
  } catch (error) {
    console.error(`Ошибка: `, error);
  }
};
