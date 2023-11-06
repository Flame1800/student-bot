import { IBotContext } from "../context/context.interface";
import sendNoAuthWarning from "./sendNoAuthWarning";

export default (fn: Function) => {
  return async function (ctx: IBotContext, next: Function) {
    if (!ctx.session.user?.user_id) {
      return sendNoAuthWarning(ctx);
    }

    try {
      return await fn(ctx);
    } catch (error) {
      //   logger.log(ctx, 'asyncWrapper error, %O', error);
      console.error(`Ошибка: `, error);
      return next();
    }
  };
};
