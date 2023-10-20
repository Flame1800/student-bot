import { Markup } from "telegraf"


const navigationPattern = {
    profile: {
        button: Markup.button.callback('Мой профиль', 'profile'),
        value: "profile"
    },
    schedule: {
        button: Markup.button.callback('Расписание', 'schedule'),
        value: "schedule"
    },
    currentStatistic: {
        button: Markup.button.callback('Текущая успеваемость', 'current_stat'),
        value: "current_stat"
    },
    gradebook: {
        button: Markup.button.callback('Зачетная книжка', 'gradebook'),
        value: "gradebook"
    },
    navigationMenu: {
        button: Markup.button.callback('Меню', 'menu'),
        value: "menu"
    },
    feedback: {
        button: Markup.button.callback('Предложения', 'feedback'),
        value: "feedback"
    },
    logout: {
        button: Markup.button.callback('Выход', 'logout'),
        value: "logout"
    },
    backToMenu: {
        button: Markup.button.callback("⬅ Вернуться в меню", 'menu')
    }
}

export default navigationPattern