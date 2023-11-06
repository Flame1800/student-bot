import { IBotContext } from "../context/context.interface";
import { Command } from "./command.class";
import { Markup, Telegraf } from "telegraf";
import sendNoAuthWarning from "../utils/sendNoAuthWarning";
import getPeriods from "../endpoints/getPeriods";
import { Period } from "../types/period.type";
import getDisciplines from "../endpoints/getDisciplines";
import { Discipline } from "../types/discipline.type";
import periodsAdapter from "../utils/adapters/periods.adapter";
import disciplineAdapter from "../utils/adapters/discipline.adapter";
import navigationPattern from "../utils/navigationPattern";
import { navigationMenu } from "./start.commandt";
import renderMarkMessage from "../utils/renderMarkMessage";
import renderSubjectCards from "../utils/renderSubjectCards";
import logger from "../logger/logger";

const MSG_LENGTH_LIMIT = 4096

export class StatisticCommand extends Command {
    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
    }

    handle(): void {
        this.bot.action(navigationPattern.currentStatistic.value, async (ctx) => {
            if (!ctx.session.user?.user_id) {
                return sendNoAuthWarning(ctx)
            }

            const renderDisciplines = (disciplines: Discipline[]) => {
                const info = "Предметы показаны в формате: \n  <b>Средний балл — Предмет</b> \n  <b>н/о</b> - оценки ещё не выставлялись"
                const title = `<b>Ваши текущие предметы.</b>\n\n${info}\n\nВыберите предмет, чтобы увидеть вашу успеваемость по нему:`
                const subjectCards = renderSubjectCards(disciplines)
                subjectCards.push([navigationPattern.backToMenu.button])

                ctx.reply(title, {
                    parse_mode: "HTML",
                    reply_markup: {
                        inline_keyboard: subjectCards
                    }
                });
            }


            try {
                const periodsResponce = await getPeriods(ctx.session.user.user_id)

                if (periodsResponce.data) {
                    const periods = periodsAdapter(periodsResponce.data.data)
                    const currPeriod: Period | undefined = periods.find((period: Period) => period.isCurrent)

                    if (currPeriod) {
                        const disciplinesResponce = await getDisciplines(currPeriod.id, ctx.session.user.user_id)
                        const disciplines = disciplineAdapter(disciplinesResponce.data.data)

                        renderDisciplines(disciplines)
                        ctx.session.disciplines = disciplines
                    } else {
                        logger.log(navigationPattern.currentStatistic.value, ctx.session.user, false, 'noPeriods')
                        await ctx.reply("Ваши оценки не выгрузили в электронный журнал, обратитесь к куратору")
                        return ctx.reply('Чем еще я могу вам помочь?', navigationMenu)
                    }
                }

            } catch (error) {
                ctx.reply('Произошла какая-то ошибка! Чем еще я могу вам помочь?', navigationMenu)
                logger.log(navigationPattern.currentStatistic.value, ctx.session.user, false, 'noPeriods')

                throw new Error(`Не удалось получить данные. ${error}`)
            }
        });

        this.bot.action(/subject:(.*)$/, async (ctx) => {
            const disciplineId: string = ctx.match.input.split(':')[1];
            const discipline: Discipline | undefined = ctx.session.disciplines.find((discipline) => discipline.id === disciplineId);

            if (!discipline) {
                return ctx.reply("Не найдена дисциплина", {
                    parse_mode: "HTML",
                    reply_markup: {
                        inline_keyboard: [
                            [Markup.button.callback("⬅ Назад к списку дисциплин", navigationPattern.currentStatistic.value)],
                            [navigationPattern.backToMenu.button], 
                        ]
                    }
                });
            }

            const subjectName = `<b>${discipline.name}</b>`
            const avgMarkTitle = `✔️ <i>Средний балл: </i> <b>${discipline.avgMark}</b>`
            const info = `Обозначения: \n\n⏰ - Опоздание \n🚷 - Неявка`

            let message = `${subjectName}\n\n${avgMarkTitle}\n\n${info}\n\nОценки по предмету:\n\n`


            if (discipline.marks.length === 0) {
                return ctx.reply(`${message} \n\nНет текущих оценок`, {
                    parse_mode: "HTML",
                    reply_markup: {
                        inline_keyboard: [
                            [Markup.button.callback("⬅ Назад к списку дисциплин", navigationPattern.currentStatistic.value)],
                            [navigationPattern.backToMenu.button],
                        ]
                    }
                });
            }

            let isOverflow = false

            for (const mark of discipline.marks) {
                if (mark.value.length === 0) {
                    continue;
                }

                if (message.length > MSG_LENGTH_LIMIT - 100) {
                    await ctx.replyWithHTML(message)
                    isOverflow = true
                    message = ""
                }

                message += renderMarkMessage(mark)
            }

            logger.log(navigationPattern.currentStatistic.value, ctx.session.user, true)

            if (isOverflow) {
                return ctx.replyWithHTML(message, Markup.inlineKeyboard([
                    [Markup.button.callback("⬅ Назад к списку дисциплин", navigationPattern.currentStatistic.value)],
                    [navigationPattern.backToMenu.button],
                ]))
            }

            return ctx.reply(message, {
                parse_mode: "HTML",
                reply_markup: {
                    inline_keyboard: [
                        [Markup.button.callback("⬅ Назад к списку дисциплин", navigationPattern.currentStatistic.value)],
                        [navigationPattern.backToMenu.button],
                    ]
                }
            });
        });

    }
}