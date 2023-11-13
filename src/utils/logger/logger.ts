import winston, { format } from "winston";
import { IBotContext } from "../../context/context.interface";

class Logger {
  logger;

  constructor() {
    const { combine, timestamp, printf } = format;
    const logFormat = printf((info) => {
      return `[${info.timestamp}] [${info.level}]${info.message}`;
    });

    this.logger = winston.createLogger({
      level: "info",
      transports: [
        new winston.transports.File({ filename: "error.log", level: "error" }),
        new winston.transports.File({
          filename: "error.log",
          level: "error",
        }),
        new winston.transports.File({
          filename: "debug.log",
          level: "debug",
        }),
        new winston.transports.File({ filename: "info.log", level: "info" }),
      ],
      format: combine(timestamp(), format.splat(), format.simple(), logFormat),
    });
  }

  prepareMessage(ctx: IBotContext, msg: string, ...data: any[]) {
    // const formattedMessage = data.length ? util.format(msg, ...data) : msg;
    const userPhone = ctx.session.user?.userPhone
      ? `/${ctx.session.user?.userPhone}`
      : "";

    if (ctx && ctx.from) {
      return `[ id: ${ctx.from.id}/ login: ${ctx.from.username}/ phone: ${userPhone}]: ${msg}`;
    }

    return `msg: ${msg}`;
  }

  debug(ctx: IBotContext, msg: string) {
    this.logger.debug(this.prepareMessage(ctx, msg));
  }

  error(ctx: IBotContext, msg: string) {
    this.logger.error(this.prepareMessage(ctx, msg));
  }

  info(ctx: IBotContext, msg: string) {
    this.logger.info(this.prepareMessage(ctx, msg));
  }
}

export default new Logger();
