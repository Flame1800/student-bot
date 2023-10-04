import server from "./instance";

export default (phoneNumber: string) => server.get(`/assessment/identification?tel=${phoneNumber}`)