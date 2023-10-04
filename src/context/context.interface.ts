import { Context } from "telegraf";

export interface SessionData {
  user_id: string;
}

export interface IBotContext extends Context {
    session: SessionData; 
}