import server from "./instance";

export default (periodId: string, userId: string) => {
    return server.get(`/assessment/assessment/${periodId}/${userId}`)
} 