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
import { Mark } from "../types/mark.type";
import navigationPattern from "../utils/navigationPattern";
import { navigationMenu } from "./start.commandt";




const markColors: { [key: string]: string } = {
    "#1BB018": "🟢",
    "#ffff00": "🟡",
    "#F39302": "🟠",
    "#ff0000": "🔴",
    "#000000": "⚫️"
}

// const maxMessageLength = 4096;


export class StatisticCommand extends Command {
    disciplines: Discipline[] = []

    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
    }

    handle(): void {
        this.bot.action(navigationPattern.currentStatistic.value, async (ctx) => {
            if (!ctx.session.user_id) {
                return sendNoAuthWarning(ctx)
            }

            if (this.disciplines.length === 0) {


                try {
                    const periodsResponce = await getPeriods(ctx.session.user_id)
                    if (periodsResponce.data) {
                        const periods = periodsAdapter(periodsResponce.data.data)
                        const currPeriod: Period | undefined = periods.find((period: Period) => period.isCurrent)

                        if (currPeriod) {
                            const disciplinesResponce = await getDisciplines(currPeriod.id, ctx.session.user_id)
                            const disciplines = disciplineAdapter(disciplinesResponce.data.data)

                            this.disciplines = disciplines ?? []
                        }
                    }

                } catch (error) {
                    throw new Error(`Не удалось получить данные. ${error}`)
                }
            }

            const title = "<b>Ваши текущие предметы.</b>\nВыберите предмет что бы увидеть вашу успеваемость по нему: "

            const subjectCards = this.disciplines.map((subject) => {
                const button = Markup.button.callback(
                    `${subject.name}`,
                    `subject:${subject.id}`
                )

                return [button]
            })

            ctx.replyWithHTML(title, Markup.inlineKeyboard(subjectCards));
        });


        this.bot.action(/subject:(.*)$/, async (ctx) => {

            const disciplineId: string = ctx.match.input.split(':')[1];
            const discipline: Discipline | undefined = this.disciplines.find((discipline) => discipline.id === disciplineId);

            if (discipline) {
                const subjectName = `<b>${discipline.name}</b>`
                const avgMarkTitle = `✔️ <i>Средний балл: </i> <b>${discipline.avgMark}</b>`
                const info = `Обозначения: \n\n⏰ - Опоздание \n🚷 - Неявка`

                let message = `${subjectName}\n\n${avgMarkTitle}\n\n${info}\n\nОценки по предмету:`
                await ctx.replyWithHTML(message)

                let messageOfMarks = ''
                let divCounter = 20
                let currentCount = 0

                if (discipline.marks.length === 0) {
                    await ctx.reply("Нет оценок")
                } else {
                    for (const mark of discipline.marks) {
                        if (mark.value.length === 0) {
                            continue;
                        }

                        currentCount++;

                        const date = new Date(mark.date)
                        const formattedDate = `<i>${date.getDate()} ${new Intl.DateTimeFormat('ru-RU', { month: 'short' }).format(date)}</i>`
                        const attendance = !mark.tornout ? " | 🚷" : '';
                        const late = mark.isLate ? " | ⏰" : '';
                        const markValue = `${markColors[mark.colorMark] ?? ''} <b>${mark.value.length ? mark.value : "x"}</b>`;

                        messageOfMarks += `${markValue} | ${formattedDate}${attendance}${late} \n\n`;


                        if (currentCount === divCounter) {
                            currentCount = 0;

                            await ctx.replyWithHTML(messageOfMarks)
                            messageOfMarks = ''
                        }
                    }

                    if (messageOfMarks.length !== 0) {
                        await ctx.replyWithHTML(messageOfMarks)
                    }
                }

                await ctx.reply('Вы можете посмотреть другие дисциплины или вернуться в меню', navigationMenu)
            }
        });
    }
}