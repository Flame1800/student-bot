import { IBotContext } from "../context/context.interface";
import getUser from "../endpoints/getUser";
import navigationPattern from "../utils/navigationPattern";
import { Command } from "./command.class";
import {Telegraf, Markup } from "telegraf";
import { navigationMenu } from "./start.commandt";
import { ConfigService } from "../config/config.service";
import adminIds from "../../data/admin_ids.json"
import logger from "../logger/logger";
import User from "../schemes/user"
import errorWraper from "../utils/errorWraper";

const configService = new ConfigService()

export class LoginCommand extends Command {
    constructor(bot: Telegraf<IBotContext>) {
        super(bot); 
    }

    handle(): void {
        this.bot.action('login', (ctx: IBotContext) => {
            try {
                if (ctx.session.user) {
                    ctx.reply("Вы успешно авторизованны! Давайте перейдем в меню", Markup.inlineKeyboard([
                        navigationPattern.navigationMenu.button
                    ]))
                    return
                }
    
                const message = `Я не могу предоставить доступ к данным пока не узнаю кто их просит. \nПожалуйста поделитесь своим контактом что бы я мог определить вас по вашему номеру телефона \n\nКнопка снизу ввода ссобщений, если у вас ее не появилось нажмите на кнопку 🎛`
                ctx.reply(message, Markup.keyboard([
                    Markup.button.contactRequest('Поделиться контактом')
                ]).resize().oneTime())  
            } catch (error) {
                console.error(error)
            }
        })

        this.bot.action('logout', (ctx) => {
            try {
                if (!ctx.session.user?.user_id) {
                    errorWraper(() => ctx.reply("Вы не авторизованы!"))
                    return
                }
    
                ctx.session.user = null
                ctx.reply("Вы вышли из аккаунта", Markup.inlineKeyboard([
                    Markup.button.callback('Авторизоваться', 'login')
                ]))
            } catch (error) {
                console.error(error)
            }
        })

        this.bot.command('tel', async (ctx) => {
            const { id } = ctx.message.from

            if (adminIds.data.indexOf(id) === -1) {
                await ctx.reply("Вам недоступна данная команда")
                return
            }

            ctx.reply("Введите телефон")

            this.bot.on('text', async (ctx) => {
                const phone = ctx.message.text 
                const currPhoneNum = phone.trim().replace("+7", "8")

                try {
                    const responce = await getUser(currPhoneNum)

                    if (!responce.data.user_id) {
                        logger.log('/tel', null, true, 'login')
                        return ctx.reply("Не удалось авторизоваться.")
                    } 

                    ctx.session.user = responce.data

                    const newUser = await new User(responce.data)
                    await newUser.save()

                    ctx.reply(`Вы успешно авторизовались!\nЧем я могу вам помочь?`, navigationMenu)

                    const user = ctx.session.user ? {...ctx.session.user, userPhone: currPhoneNum} : null
                    logger.log('/tel', user, true, 'login')

                } catch (error) {
                    logger.log('/tel', ctx.session.user, false, 'login')
                    console.log(`Ошибка: ${error}`)
                    throw new Error(`Не удалось авторизоваться. ${error}`)
                }
            })
        })

        this.bot.on('contact', async (ctx) => {

            const phoneNumber = configService.get('MOCK_PHONE') !== 'false' ? configService.get('MOCK_PHONE') : ctx.message.contact.phone_number
            let userPhone = ""

            if (phoneNumber.startsWith("+7")) {
                userPhone = phoneNumber.replace("+7", "8")
            }
            else if (phoneNumber.startsWith("7")) {
                userPhone = phoneNumber.replace("7", "8")
            }

            try {
                const responce = await getUser(userPhone)
 
                if (responce.data.user_id) {
                    ctx.session.user = responce.data

                    ctx.reply(`Вы успешно авторизовались!\nЧем я могу вам помочь?`, navigationMenu)
                    
                    const user = ctx.session.user ? {...ctx.session.user, userPhone} : null
                    logger.log('/login', user, true, 'login')

                } else {
                    ctx.reply(`Кажется ваш телефон не зарегистрирован в системе. Обратитесь к куратору.`, Markup.inlineKeyboard([
                        Markup.button.callback('Авторизоваться', 'login')
                    ]))
                    logger.guestLog('/login', phoneNumber, false, 'login')

                }
            } catch (error) {
                logger.guestLog('/login', phoneNumber, false, 'login')
                throw new Error(`Не удалось авторизоваться. ${error}`)
            } 

            return null;
        })
    }
} 