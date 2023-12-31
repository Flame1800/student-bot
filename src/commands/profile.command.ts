import { IBotContext } from "../context/context.interface";
import { Command } from "./command.class";
import { Telegraf } from "telegraf";
import navigationPattern from "../utils/navigationPattern";
import errorWraper from "../utils/errorWraper";

export class ProfileCommand extends Command {
  constructor(bot: Telegraf<IBotContext>) {
    super(bot);
  }

  handle(): void {
    this.bot.action(
      navigationPattern.profile.value,
      errorWraper((ctx: IBotContext) => {
        ctx.editMessageText(
          `Ваш профиль: \n\n<b>${ctx.session.user?.name}</b> \n<i>${ctx.session.user?.group} группа</i>`,
          {
            parse_mode: "HTML",
            reply_markup: {
              inline_keyboard: [[navigationPattern.backToMenu.button]],
            },
          }
        );
      })
    );
  }
}
