import json

import zcatalyst_sdk
from flask import Request, jsonify, make_response

tableName = "students"
columnName_1 = "student_name"
columnName_2 = "account_number"


def handler(request: Request):
    try:
        app = zcatalyst_sdk.initialize()
        zcql = app.zcql()

    # --------------------------- add students ---------------------------
        if request.path == "/addStudent" and request.method == 'POST':
            body = request.get_json()
            student = body.get('student')

            if not student:
                return make_response(jsonify({
                    "message": "student object missing"
                }), 400)

            query = f"SELECT * FROM students WHERE account_number = '{student['account_number']}'"
            result = zcql.execute_query(query)

            if len(result) == 0:
                datastore_service = app.datastore()
                table_service = datastore_service.table(tableName)
                table_service.insert_row(student)

                return make_response(jsonify({
                    "status": 200,
                    "message": "Student added successfully!",
                    "student": student
                }), 200)

            return make_response(jsonify({
                "status": 200,
                "message": "there is already a student!"
            }), 200)

    # --------------------------- get all students ---------------------------
        elif request.path == "/getStudentsList" and request.method == "GET":
            query = f"SELECT * FROM {tableName}"
            students = zcql.execute_query(query)

            return make_response(jsonify({
                "message": "students list is get Successfully",
                "studentList": students,
                "count": len(students)
            }), 200)

    # --------------------------- get all students by school ---------------------------
        elif request.path == "/getStudentsListBySchool" and request.method == "GET":
            school_id = request.args.get("school_id")

            query = f"SELECT * FROM {tableName} WHERE school_id = '{school_id}'"
            students = zcql.execute_query(query)

            return make_response(jsonify({
                "message": "students list is get Successfully",
                "studentList": students,
                "count": len(students)
            }), 200)

    # --------------------------- get student by name ---------------------------
        elif request.path == "/getStudent" and request.method == "GET":
            name = request.args.get("name")

            if not name:
                return make_response(jsonify({
                    "error": "name parameter missing"
                }), 400)

            query = f"SELECT * FROM {tableName} WHERE student_name = '{name}'"
            student = zcql.execute_query(query)

            return make_response(jsonify({
                "message": "Student fetched successfully",
                "student": student
            }), 200)

        return make_response(jsonify({
            "message": "Method not allowed"
        }), 405)

    except Exception as e:
        return make_response(jsonify({
            "error": "Server error -------> " + str(e)
        }), 500)
