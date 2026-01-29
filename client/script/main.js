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

     if (!(/^\d+$/).test(id_given)) {
          $("#loginStatus").text("Invalid School ID or Password");
          $("#loginStatus").css("color", 'red');
          return;
     }

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
                    $("#loginStatus").css("color", 'red');
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
     let name = getValue("studentName");
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

function validateStudent() {
     const dob = new Date(getValue('dob')).getFullYear(), doj = new Date(getValue('doj')).getFullYear(), today = new Date().getFullYear();

     // ---------------------- dob check ----------------------
     if (today - dob < 5 || today < dob)
          return { valid: false, type: "dobNotValid" };

     // ---------------------- doj check ----------------------
     if (doj - dob < 5 || today < doj)
          return { valid: false, type: "dojNotValid" };

     return { valid: true, type: "all" };
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

     $("input").css("border", "1px solid #dce3f0");
     let pTag = $("#addStudentResult"), dateValidate = validateStudent();

     if (!dateValidate.valid) {
          pTag.text("Invalid Date given").css("color", "red");
          if (dateValidate.type == "dobNotValid")
               $('#dob').css("border", "1px solid red");
          else
               $('#doj').css("border", "1px solid red");
          return;
     }

     const student = {
          "student_id": generateId(),
          "student_name": getValue("name"),
          "date_of_birth": getValue("dob"),
          "date_of_join": getValue("doj"),
          "std": getValue("std"),
          "gender": getValue("gender"),
          "account_number": getValue("accountNumber"),
          "school_id": getSchoolId()
     };
     log("Student to add:", student);


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
               $("select").css("border", "1px solid red");
          }

     });
}




// -------------------------------- exam functions --------------------------------


function addExam() {

     let examStartAt = new Date(getValue('examStartAt')), examEndAt = new Date(getValue('examEndAt'))

     if (examEndAt < examStartAt) {
          $("#examStatus").text("Invalid Date Given").css("color", 'red');
          console.log("Exam date is invalid");
     }

     const exam = {
          exam_id: generateId(),
          exam_name: getValue('examName'),
          std: getValue('stdForExam'),
          academic_year: $("input[name='academicYear']:checked").val(),
          exam_start_at: examStartAt,
          exam_end_at: examEndAt,
          school_id: getSchoolId()
     }

     $.ajax({
          url: "/server/exams/addExam",
          type: "POST",
          contentType: "application/json",
          data: JSON.stringify({ exam }),
          success: function (res) {
               if (res.status === 201)
                    $("#addExamStatus").text(res.message).css("color", "orange");
               else
                    $("#addExamStatus").text(res.message + "Exam Id: " + exam.exam_id).css("color", "green");
          },
          error: function () {
               $("#addExamStatus").text("Failed to add exam").css("color", "red");
          }
     });
}

function addExamResult() {
     const examResult = {
          student_id: getValue('studentId'),
          exam_id: getValue('examId'),
          std: getValue('resultStd'),
          subject_1: getValue('subject1'),
          subject_2: getValue('subject2'),
          subject_3: getValue('subject3'),
          subject_4: getValue('subject4'),
          subject_5: getValue('subject5')
     };

     log(JSON.stringify(examResult))


     $.ajax({
          url: "/server/exams/addExamResult",
          type: "POST",
          contentType: "application/json",
          data: JSON.stringify({ examResult }),
          success: function (res) {
               if (res.status === 201)
                    $("#addResult_status").text(`Result: ${res.message}`).css("color", "orange");
               else
                    $("#addResult_status").text(`Total: ${res.total}, Result: ${res.final_result}`).css("color", "green");
          },
          error: function () {
               $("#addResult_status").text("Failed to add result").css("color", "red");
          }
     });

}

function getResults(examId) {
     return new Promise((res, rej) => {
          $.ajax({
               url: "/server/exams/viewResult?exam_id=" + examId,
               type: "GET",
               success: function (data) {
                    // log(data);
                    res(data);
               },
               error: function (error) {
                    rej(error);
               }
          });
     });
}

function getAllExamDetails() {
     return new Promise((res, rej) => {
          $.ajax({
               url: "/server/exams/getAllExamDetails",
               type: "GET",
               success: function (data) {
                    // log(data);
                    res(data);
               },
               error: function (error) {
                    rej(error);
               }
          });
     });
}