import { Period } from "../../types/period.type";

interface Period1C {
    Код: string
    Наименование: string
    Текущий: boolean
}

export default (periods: Period1C[]) => {
    return periods.map((period: Period1C): Period => {
        return {
          name: period.Наименование,
          id: period.Код,
          isCurrent: period.Текущий  
        }
    })
}