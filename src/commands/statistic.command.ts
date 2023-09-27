import { IBotContext } from "../context/context.interface";
import { Command } from "./command.class";
import { Markup, Telegraf } from "telegraf";
import mockData from "../../data/db.json"
import { Subject } from "../types/subject.type";
import { Mark } from "../types/mark.type";

export class StatisticCommand extends Command {
    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
    }

    handle(): void {
        const data = mockData

        this.bot.hears("Статистика", (ctx) => {
            // Обработка текстовых сообщений
            ctx.reply("Ваши текущие предметы: ")

            data.subjects.forEach(subject => {
                const message = `▪️ <b>${subject.name}</b> \n\n🕐 Длительность: <i>${subject.duration} ч.</i> \n\n ${subject.course} Курс. ${subject.semestr} Семестр. \n\n👤 Преподаватель:  ${subject.teacher}`
                ctx.replyWithHTML(message, Markup.inlineKeyboard([
                    Markup.button.callback('Открыть предмет', `subject:${subject.id}`)
                ]));
            })
        });



        this.bot.action(/subject:(\d+)/, async (ctx) => {

            const subjectId: number = parseInt(ctx.match[1]);
            const subject: Subject | undefined = data.subjects.find(s => s.id === subjectId);

            if (subject) {
                const markSigns = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"];
                const currentMarks: Mark[] = data.marks.filter(mark => +mark.subjectId === +subjectId);
                const avgMark = currentMarks.reduce((acc, curr) => curr.value + acc, 0) / currentMarks.length;

                let message = `▪️ <b>${subject.name}</b> \n ${subject.course} Курс. ${subject.semestr} Семестр. \n\n👤 Преподаватель:  ${subject.teacher}\n\n ℹ️ Средний балл: ${avgMark.toFixed(2)} \n🔹 Оценки по предмету: \n`
                currentMarks.forEach(mark => {
                    message += `------------------------------\n ${mark.date} \n ${mark.lessonNumber} пара: ${markSigns[mark.value - 1]}\n `;
                  }); 
                
                ctx.replyWithHTML(message, Markup.inlineKeyboard([
                    Markup.button.callback('Закрыть', 'close')
                ]));
            }
        });
    }
}