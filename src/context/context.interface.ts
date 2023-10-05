import { Context } from "telegraf";
import { User } from "../types/user.type";

export interface SessionData {
  user_id: string;
  user: User;
}

export interface IBotContext extends Context {
    session: SessionData; 
}