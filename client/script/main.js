// ---------------------- auth functions ----------------------
log("hello from new ")
function signUp() {
     $("#signUpBtn").prop('disabled', true);
     const school = {
          "school_id": generateId(), // -- method in helper js file
          "school_password": getValue("schoolPassword_signup"),
          "school_name": getValue("schoolName_signup"),
          "school_address": getValue("address_signup")
     };

     log("School to add:", school);

     $.ajax({
          url: "/server/school/signUp",
          type: "POST",
          data: JSON.stringify({ school }),
          contentType: "application/json",
          success: function (data) {
               console.log(data);
               $("#schoolResponse").text(data.message);
               setSchoolId(data.school.school_id);
               window.location.href = "../views/mainPage.html";
          },
          error: function (err) {
               console.error(err);
          }
     });
}

function login() {
     let id_given = getValue("schoolId_login"), password_given = getValue("password_login");

     let school = {
          "school_id": id_given,
          "school_password": password_given
     };


     $.ajax({
          url: "/server/school/login",
          type: "POST",
          data: JSON.stringify({ school }),
          contentType: "application/json",
          success: function (data) {
               console.log(data);

               if (data.status === 200) {
                    $("#loginStatus").text("Login Successful!" + data);
                    setSchoolId(data.school.school_id);
                    window.location.href = "../views/mainPage.html";
               } else {
                    $("#loginStatus").text("Invalid School ID or Password");
               }
          },
          error: function (err) {
               console.error(err);
               $("#loginStatus").text("Server error!");
          }
     });
}

function logout() {
     $("#signUpBtn").prop('disabled', false);
     localStorage.clear();
     window.location.href = "../index.html";
}

function tryToLogOut() {
     $("#confirmLogOut").css("display", "flex");
}

function cancelLogOut() {
     $("#confirmLogOut").css("display", "none");
}



// -------------------------------- students functions --------------------------------

function getAllStudent() {
     return new Promise((res, rej) => {
          $.ajax({
               url: "/server/students/getStudentsList",
               type: "GET",
               success: function (data) {
                    log(data);
                    res(data);
               },
               error: function (error) {
                    rej(error);
               }
          });
     });
}


function getAllStudentBySchool() {
     return new Promise((res, rej) => {
          $.ajax({
               url: "/server/students/getStudentsListBySchool?school_id=" + getSchoolId(),
               type: "GET",
               success: function (data) {
                    log(data);
                    res(data);
               },
               error: function (error) {
                    rej(error);
               }
          });
     });
}

function getStudentByName() {
     let name = $("#studentName").val().trim();
     if (!name) {
          alert("Enter name");
          return;
     }

     $("#studentByName").text("Searching...");
     log("Name:", name);

     $.ajax({
          url: "/server/students/getStudent?name=" + name,
          type: "GET",
          success: function (data) {
               log(data);

               if (data.student && data.student.length > 0) {
                    $("#studentByName").text(JSON.stringify(data.student));
               } else {
                    $("#studentByName").text("No student found");
               }
          },
          error: function (err) {
               error(err);
               $("#studentByName").text("Error fetching student");
          }
     });
}

/*
name   --> studentName
dob    --> date of birth
doj    --> date of join
std    --> standard of the student
gender --> gender of the student
accountNumber --> account number of the student(used for unqiue identification for the student)
*/
function addStudent() {
     const student = {
          "student_name": getValue("name"),
          "date_of_birth": getValue("dob"),
          "date_of_join": getValue("doj"),
          "std": getValue("std"),
          "gender": getValue("gender"),
          "account_number": getValue("accountNumber"),
          "school_id": getSchoolId()
     };

     log("Student to add:", student);
     let pTag = $("#addStudentResult");

     $.ajax({
          url: "/server/students/addStudent",
          type: "POST",
          data: JSON.stringify({ student }),
          contentType: "application/json",
          success: function (data) {
               console.log(data);
               pTag.text(data.message).css("color", "green");
               $("input").css("border", "1px solid green");
          },
          error: function (err) {
               console.error(err);
               pTag.text("Give Proper Details").css("color", "red");
               $("input").css("border", "1px solid red");
          }

     });
}




// -------------------------------- exam functions --------------------------------

function addExamResult(studentId) {
     const exam_result = {
          student_id: studentId,
          exam_id: getExamId(),
          std: "V",
          subject_1: 0,
          subject_2: 0,
          subject_3: 0,
          subject_4: 0,
          subject_5: 0,
          total: 0,
          final_result: ""
     };

     $.ajax({
          url: "/server/exam_results/addExamResult",
          type: "POST",
          contentType: "application/json",
          data: JSON.stringify({ exam_result }),
          success: function (data) {
               console.log(data);
               alert("Exam Result Added");
          },
          error: function (err) {
               console.error(err);
               alert("Failed to add exam result");
          }
     });
}


function updateMarks(rowId) {
     const marks = {
          ROWID: rowId,
          subject_1: 0,
          subject_2: 0,
          subject_3: 0,
          subject_4: 0,
          subject_5: 0
     };

     $.ajax({
          url: "/server/exam_results/updateExamMarks",
          type: "POST",
          contentType: "application/json",
          data: JSON.stringify({ marks }),
          success: function (data) {
               alert("Total: " + data.total + " | " + data.final_result);
          },
          error: function (err) {
               console.error(err);
               alert("Update failed");
          }
     });
}


function loadResults() {
     const std = getValue("std");
     const examId = getExamId();

     $.ajax({
          url: `/server/exam_results/getResultsByStd?std=${std}&exam_id=${examId}`,
          type: "GET",
          success: function (data) {
               console.log(data);
          },
          error: function (err) {
               console.error(err);
          }
     });
}
