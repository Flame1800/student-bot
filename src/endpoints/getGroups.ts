import axios from "axios";
import { configService } from "./instance";


export default () => axios.get(`${configService.get(`SIELOM_MAIN_API`)}/schedule/api/groups`) 