import { Credit } from "../../types/credit.type";
import { v4 as uuidv4 } from "uuid";

interface Credit1C {
    Дисциплина: string,
    ВидКонтроля: string,
    Оценка: string,
    Дата: Date,
    Преподаватель: string,
    Цвет: string,
    Зачтено: boolean
}

export default (credits: Credit1C[]) => {
    return credits.map((credit: Credit1C): Credit => {

        return {
            id: uuidv4(),
            disciplineName: credit.Дисциплина,
            typeOfControll: credit.ВидКонтроля,
            mark: credit.Оценка,
            date: credit.Дата,
            teacher: credit.Преподаватель,
            color: credit.Цвет,
            isApprove: credit.Зачтено
        }
    })
}