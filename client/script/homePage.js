let _addStudent = $("#addStudent"), mainOptions = $("#mainOptions"), examOptions = $("#examOptions"),
    _conductExam = $("#conductExam"), addResultForm = $("#addResultForm"), viewAllExamDetailsTable = $("#viewAllExamDetails");

window.onload = () => {
    let schoolId = getSchoolId();
    log((schoolId === null) + " --->  " + schoolId);
    if (schoolId === null)
        window.location.href = '../index.html'

    $("#studentTable").hide();
    _addStudent.hide();
    examOptions.hide();
    _conductExam.hide();
    addResultForm.hide();
    viewAllExamDetailsTable.hide();

    // $("#mainOptions").hide();
    $("#examResultSection").hide();


    let firstVal = getFirstPossibleYear(), secondVal = getSecondPossibleYear();
    $("#firstPossibleYear").val(firstVal);
    $("#secondPossibleYear").val(secondVal);
    $("#firstVal").text(firstVal);
    $("#secondVal").text(secondVal);
}


async function viewStudents() {
    let obj = await getAllStudentBySchool();
    mainOptions.hide();
    $("#studentTable").show();

    // console.log("in load student", students);

    if (obj.count < 1) {
        $("#studentsList").html("<h3>No students found</h3>");
        return;
    }

    let thead = `
        <thead>
            <tr>
                <th>Student Id</th>
                <th>Account Number</th>
                <th>Student Name</th>
                <th>Date of Birth</th>
                <th>Date of Join</th>
                <th>Gender</th>
                <th>Standard</th>
            </tr>
        </thead>
        <tbody id="tablesBody">
        </tbody>
     `;

    $("#studentsList").html(thead);

    let tbody = $("#tablesBody");
    tbody.empty();

    log("Student List:", obj.studentList);


    obj.studentList.forEach(s => {
        let student = s.students;
        // log("Student:", student);
        // log("Student Name:", student.student_name, student.account_number, student.date_of_birth);
        let row = `
            <tr>
                <td>${student.student_id}</td>
                <td>${student.account_number}</td>
                <td>${student.student_name}</td>
                <td>${student.date_of_birth}</td>
                <td>${student.date_of_join}</td>
                <td>${student.gender}</td>
                <td>${student.std}</td>
            </tr>
        `;
        tbody.append(row);
    });
};

function showAddStudent() {
    _addStudent.show();
    mainOptions.hide();
}


_addStudent.on("submit", function (e) {
    e.preventDefault();
    console.log("page prevent");

    addStudent();
});

function showExamOptions() {
    mainOptions.hide();
    examOptions.show();
}


function conductExam() {
    _conductExam.show();
    examOptions.hide();
}

_conductExam.on('submit', function (e) {
    e.preventDefault();
    addExam();
})

function addResult() {
    examOptions.hide();
    addResultForm.show();
}

addResultForm.on("submit", function (e) {
    e.preventDefault();
    addExamResult();
});


function viewResult() {
    examOptions.hide();
    $("#examResultSection").show();
}



async function showResult() {
    let examId = getValue("viewExamId"),
        pTag = $("#viewResultStatus");

    if (examId.length < 11) {
        pTag.text("Exam id length is invalid").css("color", "red");
        return;
    } else {
        pTag.text("");
    }

    let obj = await getResults(examId), body = "resultTableBody", table = "examResultTable";

    log(obj);

    if (!obj || obj.count < 1) {
        $(`#${table}`).html("<h3>No students found</h3>");
        return;
    }

    let thead = `
        <thead>
            <tr>
                <th>Student Name</th>
                <th>Standard</th>
                <th>Subject 1</th>
                <th>Subject 2</th>
                <th>Subject 3</th>
                <th>Subject 4</th>
                <th>Subject 5</th>
                <th>Total</th>
                <th>Result</th>
            </tr>
        </thead>
        <tbody id="${body}"></tbody>
    `;

    $(`#${table}`).html(thead);

    let tbody = $(`#${body}`);
    tbody.empty();

    obj.resultList.forEach(r => {
        let result = r.result;

        let row = `
            <tr>
                <td>${result.student_name}</td>
                <td>${result.std}</td>
                <td>${result.subject_1}</td>
                <td>${result.subject_2}</td>
                <td>${result.subject_3}</td>
                <td>${result.subject_4}</td>
                <td>${result.subject_5}</td>
                <td>${result.total}</td>
                <td>${result.final_result}</td>
            </tr>
        `;

        tbody.append(row);
    });
}


async function viewAllExamDetails() {
    examOptions.hide();
    viewAllExamDetailsTable.show();

    let obj = await getAllExamDetails(), body = "viewAllExamDetailsBody", table = "viewAllExamDetails";

    log(obj['examDetails'])

    if (!obj || obj.count < 1) {
        viewAllExamDetailsTable.html("<h1>No Exam Conducted</h1>");
        return;
    }

    let thead = `
        <thead>
            <tr>
                <th>Exam Id</th>
                <th>Exam Name</th>
                <th>Standard</th>
                <th>Exam Start At</th>
                <th>Exam End At</th>
                <th>Academic Year</th>
            </tr>
        </thead>
        <tbody id="${body}"></tbody>
    `;

    $(`#${table}`).html(thead);

    let tbody = $(`#${body}`);
    tbody.empty();

    obj.examDetails.forEach(e => {
        log("Exam Detail:", e);
        let exam = e.exams;

        let row = `
            <tr>
                <td>${exam.exam_id}</td>
                <td>${exam.exam_name}</td>
                <td>${exam.std}</td>
                <td>${exam.exam_start_at}</td>
                <td>${exam.exam_end_at}</td>
                <td>${exam.academic_year}</td>
            </tr>
        `;

        tbody.append(row);
    });


}