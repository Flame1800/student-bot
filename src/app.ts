import { Telegraf } from "telegraf";
import { IConfigService } from "./config/config.interface";
import { ConfigService } from "./config/config.service";
import { IBotContext } from "./context/context.interface";
import { Command } from "./commands/command.class";
import { StartCommand } from "./commands/start.commandt";
import LocalSession from "telegraf-session-local";
import { ProfileCommand } from "./commands/profile.command";
import { StatisticCommand } from "./commands/statistic.command";
import { User } from "./types/user.type";
import { MenuCommand } from "./commands/menu.command";
import { LoginCommand } from "./commands/login.command";
import { GradebookCommand } from "./commands/gradebook.command";

class Bot {
    bot: Telegraf<IBotContext>;
    commands: Command[] = [];
    user: User | null = null;

    constructor(private readonly configService: IConfigService) {
        this.bot = new Telegraf<IBotContext>(this.configService.get('TOKEN'))
        this.bot.use((new LocalSession({ database: 'sessions.json' })).middleware())
    }

    init() {
        this.commands = [
            new StartCommand(this.bot),
            new LoginCommand(this.bot),
            new MenuCommand(this.bot),
            new StatisticCommand(this.bot),
            new GradebookCommand(this.bot)
        ]

        for (const command of this.commands) {
            command.handle();
        }

        this.bot.launch()
    }

}

const bot = new Bot(new ConfigService());
bot.init();
