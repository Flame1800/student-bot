import { Discipline } from "../../types/discipline.type"
import { Mark } from "../../types/mark.type"
import { v4 as uuidv4 } from "uuid";

interface Mark1C {
    Оценка: string
    Дата: Date
    Явка: boolean
    Опоздание: boolean
    Цвет: string
}

interface Discipline1C {
    Дисциплина: string
    Оценка: Mark1C[]
    СреднийБалл: number
}

export default (disciplines: Discipline1C[]) => {
    return disciplines.map((discipline: Discipline1C): Discipline => {
        const mapMarks = discipline.Оценка.map((mark: Mark1C): Mark => {
            return {
                value: mark.Оценка,
                date: mark.Дата,
                tornout: mark.Явка,
                isLate: mark.Опоздание,
                colorMark: mark.Цвет
            }
        })

        return {
            id: uuidv4(),
            name: discipline.Дисциплина,
            marks: mapMarks,
            avgMark: discipline.СреднийБалл
        }
    })
}