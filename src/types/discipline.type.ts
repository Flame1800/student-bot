import { Mark } from "./mark.type"

export interface Discipline {
    id: string
    name: string
    marks: Mark[]
    avgMark: number
}