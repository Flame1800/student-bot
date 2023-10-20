import { Markup } from "telegraf"
import { Discipline } from "../types/discipline.type"

export default (disciplines: Discipline[]) => {
    const info = "Предметы показаны в формате: \n  <b>Средний балл — Предмет</b> \n  <b>н/о</b> - оценки ещё не выставлялись"

    const subjectCards = disciplines.map((subject) => {
        const button = Markup.button.callback(
            `${subject.avgMark === 0 ? "н/о" : subject.avgMark} — ${subject.name}`,
            `subject:${subject.id}`
        )

        return [button]
    })

    return subjectCards
}