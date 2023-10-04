import { IBotContext } from "../context/context.interface";
import getUser from "../endpoints/getUser";
import navigationPattern from "../utils/navigationPattern";
import { Command } from "./command.class";
import {Telegraf, Markup } from "telegraf";

export class LoginCommand extends Command {
    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
    }

    handle(): void {
        this.bot.action('login', (ctx) => {

            if (ctx.session.user_id) {
                ctx.reply("Вы успешно авторизованны!, Давайте перейдем в меню", Markup.inlineKeyboard([
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
            // const phoneNumber = ctx.message.contact.phone_number
            const phoneNumber = '89227683894'

            try {
                const responce = await getUser(phoneNumber)
                if (responce.data.user_id) {
                    ctx.session.user_id = responce.data.user_id

                    ctx.reply("Вы успешно авторизовались! Давайте перейдем в меню", Markup.inlineKeyboard([
                        navigationPattern.navigationMenu.button
                    ]));

                } else {
                    ctx.reply(`Кажется вас нет в списках студентов или сотрудников института. Если это какая-то ошибка, обратитесь в поддержку. \nМожете вернуться в меню`)
                }
            } catch (error) {
                throw new Error(`Не удалось авторизоваться. ${error}`)
            }

            return null;
        })
    }
}