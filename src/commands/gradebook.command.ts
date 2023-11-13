import { IBotContext } from "../context/context.interface";
import getCredits from "../endpoints/getCredits";
import getPeriods from "../endpoints/getPeriods";
import { Period } from "../types/period.type";
import creditAddapter from "../utils/adapters/credit.addapter";
import periodsAdapter from "../utils/adapters/periods.adapter";
import navigationPattern from "../utils/navigationPattern";
import sendNoAuthWarning from "../utils/sendNoAuthWarning";
import { Command } from "./command.class";
import { Telegraf, Markup } from "telegraf";
import { Credit } from "../types/credit.type";
import logger from "../utils/logger/logger";

export class GradebookCommand extends Command {
  constructor(bot: Telegraf<IBotContext>) {
    super(bot);
  }

  handle(): void {
    this.bot.action(navigationPattern.gradebook.value, async (ctx) => {
      if (!ctx.session.user?.user_id) {
        return sendNoAuthWarning(ctx);
      }

      try {
        const periodsResponce = await getPeriods(ctx.session.user.user_id);
        if (periodsResponce.data) {
          const periods = periodsAdapter(periodsResponce.data.data);
          ctx.session.periods = periods;
        }
      } catch (error) {
        logger.error(ctx, "Не удалось получить данные в /grabebook/periods");
        throw new Error(`Не удалось получить данные. ${error}`);
      }

      const periodCards = ctx.session.periods.map((period) => {
        const button = Markup.button.callback(
          `${period.name} ${period.isCurrent ? "- Текущий период" : ""}`,
          `period:${period.id}`
        );

        return [button];
      });
      periodCards.push([navigationPattern.backToMenu.button]);

      const title =
        "Выберите за какой период вы хотите увидеть информацию о зачетах:";
      ctx.editMessageText(title, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: periodCards,
        },
      });
    });

    this.bot.action(/period:(.*)$/, async (ctx) => {
      const periodId: string = ctx.match.input.split(":")[1];
      const currPeriod: Period | undefined = ctx.session.periods.find(
        (period: Period) => periodId === period.id
      );

      ctx.session.currPeriodLink = `period:${periodId}`;

      try {
        if (ctx.session.user && currPeriod) {
          const title = `<b>Информация о зачетах за ${currPeriod.name}</b>`;

          const creditsResponce = await getCredits(
            currPeriod.id,
            ctx.session.user.user_id
          );
          const credits = creditAddapter(creditsResponce.data.data);

          if (credits.length === 0) {
            return ctx.editMessageText("За этот период ничего не нашлось", {
              reply_markup: {
                inline_keyboard: [
                  [
                    Markup.button.callback(
                      "⬅ Назад к списку семестров",
                      navigationPattern.gradebook.value
                    ),
                  ],
                  [navigationPattern.backToMenu.button],
                ],
              },
            });
          }

          ctx.session.credits = credits;

          const creditsButtons = credits.map((credit) => {
            const nameDiscipline = `${credit.disciplineName}`;
            const approveValue = `${
              credit.isApprove ? "✅ Зачёт" : "❌ Не зачёт"
            }`;

            const messageOfCredit = `${nameDiscipline} — ${approveValue}`;
            return [
              Markup.button.callback(messageOfCredit, `credit:${credit.id}`),
            ];
          });

          return ctx.editMessageText(title, {
            parse_mode: "HTML",
            reply_markup: {
              inline_keyboard: [
                ...creditsButtons,
                [
                  Markup.button.callback(
                    "⬅ Назад к списку семестров",
                    navigationPattern.gradebook.value
                  ),
                ],
                [navigationPattern.backToMenu.button],
              ],
            },
          });
        }
      } catch (error) {
        logger.error(ctx, "Не удалось получить данные в /gradebook.");
        throw new Error(`Не удалось получить данные. ${error}`);
      }
    });

    this.bot.action(/credit:(.*)$/, async (ctx) => {
      const creditId: string = ctx.match.input.split(":")[1];
      const credit = ctx.session.credits.find(
        (credit: Credit) => credit.id === creditId
      );
      ctx.session.credits = [];

      if (!credit) {
        return ctx.editMessageText("Не найдено информации о предмете", {
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [
              [
                Markup.button.callback(
                  "⬅ Назад к списку семестров",
                  navigationPattern.gradebook.value
                ),
              ],
              [navigationPattern.backToMenu.button],
            ],
          },
        });
      }

      const date = new Date(credit.date);
      const formattedDate = `${date.getDate()} ${new Intl.DateTimeFormat(
        "ru-RU",
        { month: "short" }
      ).format(date)} ${date.getFullYear()}`;
      const nameDiscipline = `<b>${credit.disciplineName}</b>`;
      const typeOfControll = `<i>${credit.typeOfControll}</i>`;
      const approveValue = `<i>${
        credit.isApprove ? "✅ Зачёт" : "❌ Не зачёт"
      }</i>`;
      const mark = `Оценка: <b>${credit.mark}</b>`;
      const teacher = `<i>Преподаватель:</i>\n${credit.teacher}`;

      const messageOfCredits = `${nameDiscipline} \n${formattedDate}\n\n${typeOfControll}\n\n${teacher}\n\n${mark} — ${approveValue}`;

      const link = ctx.session.currPeriodLink;
      ctx.session.currPeriodLink = "";

      return ctx.editMessageText(messageOfCredits, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [Markup.button.callback("⬅ Назад к списку предметов", link)],
            [
              Markup.button.callback(
                "⬅ Назад к списку семестров",
                navigationPattern.gradebook.value
              ),
            ],
            [navigationPattern.backToMenu.button],
          ],
        },
      });
    });
  }
}
