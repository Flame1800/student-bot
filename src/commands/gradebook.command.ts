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
import { navigationMenu } from "./start.commandt";

export class GradebookCommand extends Command {
    periods: Period[] = []

    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
    }

    handle(): void {
        this.bot.action(navigationPattern.gradebook.value, async (ctx) => {

            if (!ctx.session.user_id) {
                return sendNoAuthWarning(ctx)
            }

            if (this.periods.length === 0) {
                try {
                    const periodsResponce = await getPeriods(ctx.session.user_id)
                    if (periodsResponce.data) {
                        const periods = periodsAdapter(periodsResponce.data.data)
                        this.periods = periods
                    }
                } catch (error) {
                    throw new Error(`Не удалось получить данные. ${error}`)
                }
            }

            const periodCards = this.periods.map((period) => {
                const button = Markup.button.callback(
                    `${period.name} ${period.isCurrent ? '- Текущий период' : ''}`,
                    `period:${period.id}`
                )

                return [button]
            })
            periodCards.push([navigationPattern.backToMenu.button])

            const title = "Выберите за какой период вы хотите увидеть информацию о зачетах:"
            ctx.editMessageText(title, {
                parse_mode: "HTML",
                reply_markup: {
                    inline_keyboard: periodCards
                }
            });
        })

        this.bot.action(/period:(.*)$/, async (ctx) => {
            const periodId: string = ctx.match.input.split(':')[1];
            const currPeriod: Period | undefined = this.periods.find((period: Period) => periodId === period.id)

            let messageOfCredits = ''
            let divCounter = 5
            let currentCount = 0

            try {
                if (currPeriod) {
                    const title = `<b>Информация о зачетах за ${currPeriod.name}</b>`
                    await ctx.replyWithHTML(title)

                    const creditsResponce = await getCredits(currPeriod.id, ctx.session.user_id)
                    const credits = creditAddapter(creditsResponce.data.data)

                    if (credits.length === 0) {
                        return ctx.reply("За этот период ничего не нашлось", Markup.inlineKeyboard([
                            [Markup.button.callback("⬅ Назад к списку семестров", navigationPattern.gradebook.value)],
                            [navigationPattern.backToMenu.button],
                        ]))
                    }

                    for (const credit of credits) {
                        currentCount++;

                        const date = new Date(credit.date)
                        const formattedDate = `${date.getDate()} ${new Intl.DateTimeFormat('ru-RU', { month: 'short' }).format(date)} ${date.getFullYear()}`
                        const nameDiscipline = `<b>${credit.disciplineName}</b>`
                        const typeOfControll = `<i>${credit.typeOfControll}</i>`
                        const approveValue = `<i>${credit.isApprove ? "✅ Зачёт" : "❌ Не зачёт"}</i>`;
                        const mark = `Оценка: <b>${credit.mark}</b>`;
                        const teacher = `<i>Преподаватель:</i> ${credit.teacher}`;
                        const divider = '\n➖➖➖➖➖➖➖➖➖'


                        messageOfCredits += `${nameDiscipline} \n${formattedDate}\n\n${typeOfControll}\n\n${teacher}\n\n${mark} — ${approveValue}\n${divider}\n`;

                        if (currentCount === divCounter) {
                            currentCount = 0;

                            await ctx.replyWithHTML(messageOfCredits)
                            messageOfCredits = ''
                        }
                    }
                    if (messageOfCredits.length !== 0) {
                        await ctx.replyWithHTML(messageOfCredits)
                    }

                    return ctx.reply('Навигация', Markup.inlineKeyboard([
                        [Markup.button.callback("⬅ Назад к списку семестров", navigationPattern.gradebook.value)],
                        [navigationPattern.backToMenu.button],
                    ]))
                }
            } catch (error) {
                throw new Error(`Не удалось получить данные. ${error}`)
            }
        })
    }
}