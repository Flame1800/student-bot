import { IBotContext } from "../context/context.interface";
import getUser from "../endpoints/getUser";
import navigationPattern from "../utils/navigationPattern";
import { Command } from "./command.class";
import {Telegraf, Markup } from "telegraf";
import { navigationMenu } from "./start.commandt";
import { ConfigService } from "../config/config.service";
import adminIds from "../../data/admin_ids.json"
import { appendFile } from 'node:fs';
import { log } from "node:console";


const configService = new ConfigService()

export class LoginCommand extends Command {
    constructor(bot: Telegraf<IBotContext>) {
        super(bot); 
    }

    handle(): void {
        this.bot.action('login', (ctx) => {

            if (ctx.session.user_id) {
                ctx.reply("Вы успешно авторизованны! Давайте перейдем в меню", Markup.inlineKeyboard([
                    navigationPattern.navigationMenu.button
                ]))
                return
            }

            const message = `Я не могу предоставить доступ к данным пока не узнаю кто их просит. \nПожалуйста поделитесь своим контактом что бы я мог определить вас по вашему номеру телефона`
            ctx.reply(message, Markup.keyboard([
                Markup.button.contactRequest('Поделиться контактом')
            ]).resize().oneTime())
        })

        this.bot.action('logout', (ctx) => {
            if (!ctx.session.user_id) {
                ctx.reply("Вы не авторизованы!")
                return
            }

            ctx.session.user_id = ''
            ctx.session.user = null

            ctx.reply("Вы вышли из аккаунта", Markup.inlineKeyboard([
                Markup.button.callback('Авторизоваться', 'login')
            ]))
        })

        this.bot.command('tel', (ctx) => {
            const { id } = ctx.message.from

            if (adminIds.data.indexOf(id) === -1) {
                ctx.reply("Вам недоступна данная команда")
                return
            }

            ctx.reply("Введите телефон")

            this.bot.on('text', async (ctx) => {
                const phone = ctx.message.text 
                const currPhoneNum = phone.trim().replace("+7", "8")
                let logText = ''

                try {
                    const responce = await getUser(currPhoneNum)
                    logText = `command: /tel | user-phone: ${currPhoneNum} | user-name: ${responce?.data?.name ?? "null"}`

                } catch (error) {
                    logText = `command: /tel | user-phone: ${currPhoneNum} | error: ${error}`
                    console.log(`Ошибка: ${error}`)
                    throw new Error(`Не удалось авторизоваться. ${error}`)
                }
            })
        })

        this.bot.on('contact', async (ctx) => {

            let logText = ''

            const phoneNumber = configService.get('MOCK_PHONE') !== 'false' ? configService.get('MOCK_PHONE') : ctx.message.contact.phone_number


            let currPhoneNum = ""

            if (phoneNumber.startsWith("+7")) {
                currPhoneNum = phoneNumber.replace("+7", "8")
            }
            if (phoneNumber.startsWith("7")) {
                currPhoneNum = phoneNumber.replace("7", "8")
            }

            console.log(currPhoneNum)

            try {
                const responce = await getUser(currPhoneNum)
                logText = `command: /contact | user-phone: ${currPhoneNum} | user-name: ${responce?.data?.name ?? "null"} | `
 
                if (responce.data.user_id) {
                    ctx.session.user_id = responce.data.user_id
                    ctx.session.user = responce.data

                    await ctx.reply("Вы успешно авторизовались!", Markup.removeKeyboard())
                    await ctx.reply("Чем я могу вам помочь?", navigationMenu);

                    logText += `result: success`

                } else {
                    logText += `result: failed`

                    ctx.reply(`Кажется ваш телефон не зарегистрирован в системе. Обратитесь к куратору.`, Markup.inlineKeyboard([
                        Markup.button.callback('Авторизоваться', 'login')
                    ]))
                }
            } catch (error) {
                logText += `result: failed`
                throw new Error(`Не удалось авторизоваться. ${error}`)
            } 

            appendFile("./data/log.txt", `${logText}\n`, 'utf-8', (err) => {
                if (err) {
                    console.log(`Write log file error: ${err}`)
                }
            })
            return null;
        })
    }
} 