function generateId() {
    const timePart = Date.now().toString().slice(-8);
    const randomPart = Math.floor(Math.random() * 5000);
    return timePart + randomPart;
}

function log(...args) {
    console.log(...args);
}

function error(...args) {
    console.error(...args);
}

function getValue(idName) {
    return $(`#${idName}`).val().trim();
}

function getSchoolId() {
    return localStorage.getItem("school_id");
}

function setSchoolId(id) {
    localStorage.setItem("school_id", id);
}

function setExamId(id) {
    localStorage.setItem("exam_id", id);
}

function getExamId() {
    return localStorage.getItem("exam_id");
}

function setStudentId(id) {
    localStorage.setItem("student_id", id);
}

function getStudentId() {
    return localStorage.getItem("student_id");
}
