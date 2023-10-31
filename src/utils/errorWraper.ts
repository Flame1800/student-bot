export default (func: Function) => {
    try {
        func()
    } catch (error) {
        console.error("Ошибка: ", error)
    }
}