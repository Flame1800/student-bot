import server from "./instance";

export default (periodId: string, userId: string) => {
    console.log(`get Disciplines api: /assessment/assessment/${periodId}/${userId}`)
    return server.get(`/assessment/assessment/${periodId}/${userId}`)
} 