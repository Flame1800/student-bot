import { Context } from "telegraf";
import { User } from "../types/user.type";
import { Discipline } from "../types/discipline.type";
import { Period } from "../types/period.type";
import { Credit } from "../types/credit.type";

export interface SessionData {
  user: User | null;
  disciplines: Discipline[]
  periods: Period[]
  credits: Credit[]
  currPeriodLink: string
}

export interface IBotContext extends Context {
    session: SessionData; 
}