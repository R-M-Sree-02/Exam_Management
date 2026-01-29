function generateId() {
    const timePart = Date.now().toString().slice(-8);
    const randomPart = Math.floor(Math.random() * 500);
    return timePart + randomPart;
}

function log(...args) {
    console.log(...args);
}

function error(...args) {
    console.error(...args);
}

function getValue(idName) {
    return $(`#${idName}`).val()//.trim();
}

function getSchoolId() {
    return localStorage.getItem("school_id");
}

function setSchoolId(id) {
    localStorage.setItem("school_id", id);
}

function getFirstPossibleYear() {
    let year = new Date().getFullYear();
    return (year - 1) + "-" + ("" + year).slice(2, 4);
}

function getSecondPossibleYear() {
    let year = new Date().getFullYear();
    return year + "-" + ("" + (year + 1)).slice(2, 4);
}

