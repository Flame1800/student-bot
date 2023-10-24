import { Mark } from "../types/mark.type";


const markColors: { [key: string]: string } = {
    "#1BB018": "🟢",
    "#ffff00": "🟡",
    "#F39302": "🟠",
    "#ff0000": "🔴",
    "#000000": "⚫️"
}

const generateMarkSign = (markValue: string) => {
    switch (markValue.trim()) {
        case "О":
            return "⏰"
        case "Н":
            return "🚷"
        case "О, Н":
        case "Н, О":
            return "⏰ 🚷"
        default:
            return ""
    }
}

export default (mark: Mark) => {


    const date = new Date(mark.date)
    const formattedDate = `<i>${date.getDate()} ${new Intl.DateTimeFormat('ru-RU', { month: 'short' }).format(date)}</i>`
    const attendance = !mark.tornout ? " | 🚷" : '';
    const late = mark.isLate ? " | ⏰" : '';
    const specSign = generateMarkSign(mark.value)
    const isEmptyMark = specSign.length !== 0
    
    let markColor = !isEmptyMark ? markColors[mark.colorMark] : specSign
    const markValue = `${markColor} <b>${mark.value.replace(/, Н/g, "")}</b>`;

    return `${markValue} | ${formattedDate}${!isEmptyMark ? attendance : ''}${!isEmptyMark ? late : ''} \n\n`;
}