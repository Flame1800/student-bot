export default () => {
    let date = new Date();
    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0'); // Месяцы начинаются с 0
    let year = date.getFullYear();
    let hours = date.getHours().toString().padStart(2, '0');
    let minutes = date.getMinutes().toString().padStart(2, '0');

    let formattedDate = `${hours}:${minutes} ${day}.${month}.${year}`;
    return formattedDate  // "15:30 27.10.2023"
}