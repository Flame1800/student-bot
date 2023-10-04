import server from "./instance";

export default (userId: string) => server.get(`/assessment/periods/${userId}`) 