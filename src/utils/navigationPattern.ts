import { Markup } from "telegraf"

const navigationPattern = {
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
    }
}

export default navigationPattern