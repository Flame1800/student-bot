import { IBotContext } from "../context/context.interface";
import getUser from "../endpoints/getUser";
import navigationPattern from "../utils/navigationPattern";
import { Command } from "./command.class";
import {Telegraf, Markup } from "telegraf";
import { navigationMenu } from "./start.commandt";
import { ConfigService } from "../config/config.service";

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
            ]).resize())
        })

        this.bot.on('contact', async (ctx) => {
            const phoneNumber = configService.get('MOCK_PHONE') === 'true' ? '89227683894' : ctx.message.contact.phone_number
            const currPhoneNum = phoneNumber.replace("+7", "8")

            try {
                const responce = await getUser(currPhoneNum)

                if (responce.data.user_id) {

                    ctx.session.user_id = responce.data.user_id
                    ctx.session.user = responce.data

                    await ctx.reply("Вы успешно авторизовались!", Markup.keyboard([
                        [responce.data.name ? responce.data.name : '...']
                    ]).resize())

                    await ctx.reply("Чем я могу вам помочь?", navigationMenu);

                } else {
                    ctx.reply(`Кажется ваш телефон не зарегистрирован в системе. Обратитесь к куратору.`, Markup.inlineKeyboard([
                        navigationPattern.navigationMenu.button
                    ]))
                }
            } catch (error) {
                throw new Error(`Не удалось авторизоваться. ${error}`)
            } 

            return null;
        })
    }
} 