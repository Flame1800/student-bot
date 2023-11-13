import { IBotContext } from "../context/context.interface";
import logger from "./logger/logger";
import sendNoAuthWarning from "./sendNoAuthWarning";

export default (fn: Function) => {
  return async function (ctx: IBotContext, next: Function) {
    if (!ctx.session.user?.user_id) {
      return sendNoAuthWarning(ctx);
    }

    try {
      return await fn(ctx);
    } catch (error) {
      logger.error(ctx, `asyncWrapper error: ${error}`);
      console.error(`Ошибка: `, error);
      return next();
    }
  };
};
