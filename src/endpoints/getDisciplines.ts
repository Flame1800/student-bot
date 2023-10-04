import { User } from "../types/user.type";
import server from "./instance";

export default (periodId: string, userId: string) => server.get(`/assessment/assessment/${periodId}/${userId}`) 