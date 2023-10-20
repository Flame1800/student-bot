import { IBotContext } from "../context/context.interface";
import navigationPattern from "../utils/navigationPattern";
import { Command } from "./command.class";
import { Telegraf } from "telegraf";
import { writeFile, readFile } from 'node:fs';
import { navigationMenu } from "./start.commandt";
import adminIds from "../../data/admin_ids.json";


export class FeedbackCommand extends Command {
    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
    }

    handle(): void {
        this.bot.action(navigationPattern.feedback.value, (ctx) => {
            ctx.editMessageText("Напишите, какую функцию вы хотели бы получить в личном кабинете?", {
                reply_markup: {
                    inline_keyboard: [[navigationPattern.backToMenu.button]]
                }
            });
            this.bot.on('text', (ctx) => {
                readFile('./data/suggestions.json', 'utf-8', (err, data) => {
                    if (err) {
                        ctx.reply(`Произошла какая то ошибка - ${err} \nЧем еще я могу вам помочь?`, navigationMenu)
                        return
                    }

                    const dataFile = JSON.parse(data)
                    const newData = { data: [...dataFile.data, `${ctx.session.user?.name} ${ctx.session.user?.group}:\n${ctx.message.text.trim()}`] }

                    writeFile('./data/suggestions.json', JSON.stringify(newData), 'utf-8', (err) => {
                        if (err) {
                            ctx.reply(`Произошла какая то ошибка - ${err} \n Чем еще я могу вам помочь?`, navigationMenu)
                            return
                        }

                        ctx.reply("Ваше предложение принято! Чем еще я могу вам помочь?", navigationMenu)
                    })
                })
            })
        })

        this.bot.command('suggestions', (ctx) => {
            const { id } = ctx.message.from

            if (adminIds.data.indexOf(id) === -1) {
                ctx.reply("Вам недоступна данная команда")
                return
            }


            let message = '';

            readFile('./data/suggestions.json', 'utf-8', async (err, data) => {
                if (err) {
                    ctx.reply(`Произошла какая то ошибка при открытии файла - ${err}\n`)
                    return
                }

                const dataFile = JSON.parse(data)
                await ctx.reply(`Вот предложения которые пришли от пользователей. ${dataFile.data.length} сообщений`)

                const suggestions = dataFile.data
                let count = 0
                
                for (let i = 0; i < suggestions.length; i++) {
                    message += `• ${suggestions[i]} \n\n`
                    count++

                    if (count === 40) {
                        await ctx.reply(message)
                        message = ''
                        count = 0
                    }
                }

                if (message.length === 0) {
                    ctx.reply("Тут еще нету предложений", navigationMenu)
                    return
                }

                ctx.reply("Чем еще я могу вам помочь?", navigationMenu)
            })
        })


    }
}