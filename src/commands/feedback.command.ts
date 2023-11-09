import { IBotContext } from "../context/context.interface";
import navigationPattern from "../utils/navigationPattern";
import { Command } from "./command.class";
import { Telegraf } from "telegraf";
import { navigationMenu } from "./start.commandt";
import adminIds from "../../data/admin_ids.json";
import errorWraper from "../utils/errorWraper";
import Suggestion from "../schemes/suggestion";

export class FeedbackCommand extends Command {
  constructor(bot: Telegraf<IBotContext>) {
    super(bot);
  }

  handle(): void {
    this.bot.action(
      navigationPattern.feedback.value,
      errorWraper((ctx: IBotContext) => {
        ctx.editMessageText(
          "Напишите, какую функцию вы хотели бы получить в личном кабинете?",
          {
            reply_markup: {
              inline_keyboard: [[navigationPattern.backToMenu.button]],
            },
          }
        );
        ctx.session.awaitingFeedback = true;

        this.bot.on("text", async (ctx) => {
          if (!ctx.session.awaitingFeedback) {
            return;
          }
          try {
            const newSuggestion = new Suggestion({
              user: ctx.session.user?.name ?? "Гость",
              suggestion: ctx.message.text.trim(),
            });
            await newSuggestion.save();

            await this.bot.telegram.deleteMessage(
              ctx.chat.id,
              ctx.message.message_id
            );

            return ctx.reply(
              "Ваше предложение принято! Чем еще я могу вам помочь?",
              navigationMenu
            );
          } catch (error) {
            return ctx.reply(
              `Произошла какая то ошибка - ${error} \n Чем еще я могу вам помочь?`,
              navigationMenu
            );
          } finally {
            ctx.session.awaitingFeedback = false;
          }
        });
      })
    );

    this.bot.command("suggestions", async (ctx) => {
      const { id } = ctx.message.from;

      if (adminIds.data.indexOf(id) === -1) {
        ctx.reply("Вам недоступна данная команда");
        return;
      }

      const suggestions = await Suggestion.find();
      let message = "";

      await ctx.reply(
        `Вот предложения которые пришли от пользователей. ${suggestions.length} сообщений`
      );

      let count = 0;

      for (let i = 0; i < suggestions.length; i++) {
        const value =  `• ${suggestions[i].user}: ${suggestions[i].suggestion} \n\n`
        message += value;
        count++;

        if (suggestions.length >= 10 && count === 10) {
          await ctx.reply(message);
          message = "";
          count = 0;
        } 
      }


      if (message.length !== 0) {
        await ctx.reply(message);
        // ctx.reply("Тут еще нету предложений", navigationMenu);
      }

      ctx.reply("Чем еще я могу вам помочь?", navigationMenu);
    });
  }
}
