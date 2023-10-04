import axios, {AxiosInstance} from "axios";
import { ConfigService } from "../config/config.service";

const configService = new ConfigService()

const server: AxiosInstance = axios.create({
    baseURL:  `${configService.get(`DATA_API_URL`)}/college/hs`,
    timeout: 8000,
    headers: {
        "Content-Type": "application/json"
    }
})

server.defaults.headers.common["Authorization"] = "Basic 0JDQtNC80LjQvdC40YHRgtGA0LDRgtC+0YA6MTk4MzM4OTE="

export default server