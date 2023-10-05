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
    "#F39302": "🟡",
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

                // TODO: Message is too long: Математика
                let message = `${subjectName}\n\n${avgMarkTitle}\n\n Оценки по предмету:`
                await ctx.replyWithHTML(message)

                let messageOfMarks = ''
                let divCounter = 5
                let currentCount = 0

                for (const mark of discipline.marks) {
                    currentCount++;

                    const date = new Date(mark.date)
                    const formattedDate = `🕑 <i>${date.getDate()} ${new Intl.DateTimeFormat('ru-RU', { month: 'long' }).format(date)} ${date.getFullYear()}</i>`
                    const attendance = !mark.tornout ? "\n❌ Неявка" : '';
                    const late = mark.isLate ? "\n❌ Опоздание" : '';
                    const markValue = `${markColors[mark.colorMark] ?? ''} <b>${mark.value}</b>`;
                    const divider = '\n➖➖➖➖➖➖➖➖➖'

                    messageOfMarks += `\n\n${formattedDate}\n${attendance}${late}\n\n${markValue}\n ${divider}`;


                    if (currentCount === divCounter) {
                        currentCount = 0;

                        await ctx.replyWithHTML(messageOfMarks)
                        messageOfMarks = ''
                    }
                }

                if (messageOfMarks.length !== 0) {
                    await ctx.replyWithHTML(messageOfMarks)
                }
                
                await ctx.reply('Вы можете посмотреть другие дисциплины или вернуться в меню', navigationMenu)
            }
        });
    }
}