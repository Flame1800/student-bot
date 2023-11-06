import { Telegraf, session } from "telegraf";
import { IConfigService } from "./config/config.interface";
import { IBotContext } from "./context/context.interface";
import { Command } from "./commands/command.class";
import { StartCommand } from "./commands/start.commandt";
import { StatisticCommand } from "./commands/statistic.command";
import { User } from "./types/user.type";
import { MenuCommand } from "./commands/menu.command";
import { LoginCommand } from "./commands/login.command";
import { GradebookCommand } from "./commands/gradebook.command";
import { ProfileCommand } from "./commands/profile.command";
import { FeedbackCommand } from "./commands/feedback.command";
import { ScheduleCommand } from "./commands/schedule.command";
import LocalSession from "telegraf-session-local";


class Bot {
    bot: Telegraf<IBotContext>;
    commands: Command[] = [];
    user: User | null = null;

    constructor(private readonly configService: IConfigService) {
        this.bot = new Telegraf<IBotContext>(this.configService.get('TOKEN'))
        this.bot.use((new LocalSession({ database: 'sessions.json' })).middleware())

        this.bot.catch((err, ctx) => {
            console.error('Ошибка:', err);
            // Обработайте ошибку или отправьте сообщение об ошибке пользователю
            // ctx.reply('Упс! Что-то пошло не так.');
        });

    }

    init() {
        this.commands = [
            new ProfileCommand(this.bot),
            new StartCommand(this.bot),
            new LoginCommand(this.bot),
            new MenuCommand(this.bot),
            new StatisticCommand(this.bot),
            new GradebookCommand(this.bot),
            new FeedbackCommand(this.bot),
            new ScheduleCommand(this.bot)
        ]

        for (const command of this.commands) {
            try {
                command.handle();
            } catch (err) {
                console.error("Error:", err)
            }
        }
  

        this.bot.launch()
    }

}

export default Bot
