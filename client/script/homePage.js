window.onload = () => {
    let schoolId = getSchoolId();
    log(schoolId);
    if (isNaN(schoolId))
        window.location.href = '../index.html'

    $("#studentTable").hide();
    $("#addStudent").hide();
    $("#halfYearlyResult").hide();
    $("#quartelyResult").hide();
    $("#annualResult").hide();
}

let options = $("#options");

async function viewStudents() {
    let obj = await getAllStudentBySchool();
    options.hide();
    $("#studentTable").show();

    // console.log("in load student", students);

    if (obj.count < 1) {
        $("#studentsList").html("<h3>No students found</h3>");
        return;
    }

    let thead = `
        <thead>
            <tr>
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
    $("#addStudent").show();
    options.hide();
}


$("#addStudent").on("submit", function (e) {
    e.preventDefault();
    console.log("page prevent");

    addStudent();
});