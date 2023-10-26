import { appendFile } from "fs";
import { User } from "../types/user.type";

const logFiles = {
    login: "auth.log.txt",
    noPeriods: "no-periods.log.txt",
    none: "common.log.txt"
}

type themeType = 'login' | 'noPeriods'

class Logger {
    log(command: string, user: User | null | undefined, isSuccess: boolean, theme?: themeType) {
        const status = isSuccess ? "✅ success" : "❌ failed"
        const newLog = `command: ${command} | user phone: ${user?.userPhone ?? "null"} | user name: ${user?.name} | user id: ${user?.user_id} | theme: ${theme ?? "null"} | status: ${status}`

        appendFile(`./logs/${logFiles[theme ?? "none"]}`, `${newLog}\n`, 'utf-8', (err) => {
            if (err) {
                console.log(`Write log file error: ${err}`)
            }
        })
    }

    guestLog(command: string, userPhone: string, isSuccess: boolean, theme?: themeType) {
        const status = isSuccess ? "✅ success" : "❌ failed"
        const newLog = `command: ${command} | user phone: ${userPhone ?? "null"} | theme: ${theme ?? "null"} | status: ${status}`

        appendFile(`./logs/${logFiles[theme ?? "none"]}`, `${newLog}\n`, 'utf-8', (err) => {
            if (err) {
                console.log(`Write log file error: ${err}`)
            }
        })
    }
}

export default new Logger()