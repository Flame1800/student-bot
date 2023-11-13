import { IBotContext } from "../context/context.interface";
import navigationPattern from "../utils/navigationPattern";
import { Command } from "./command.class";
import { Telegraf } from "telegraf";
import sendNoAuthWarning from "../utils/sendNoAuthWarning";
import errorWraper from "../utils/errorWraper";
import logger from "../utils/logger/logger";

export const navigationMenuMarkup = [
  [navigationPattern.profile.button],
  [navigationPattern.currentStatistic.button],
  [navigationPattern.schedule.button],
  [navigationPattern.gradebook.button],
  [navigationPattern.feedback.button],
  [navigationPattern.logout.button],
];

export class MenuCommand extends Command {
  constructor(bot: Telegraf<IBotContext>) {
    super(bot);
  }

  handle(): void {
    this.bot.action(navigationPattern.navigationMenu.value, errorWraper((ctx: IBotContext) => {
      ctx.session.credits = [];
      ctx.session.periods = [];
      ctx.session.disciplines = [];
      ctx.session.currPeriodLink = "";
      ctx.session.awaitingFeedback = false;

      ctx
        .editMessageText("Чем я могу вам помочь?", {
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: navigationMenuMarkup,
          },
        })
        .catch((err) => {
          logger.error(ctx, `Ошибка в /menu: ${err}`)
        });
    }));
  }
}
