import json

import zcatalyst_sdk
from flask import Request, jsonify, make_response

tableName = "students"

def getStudentDetailsByStudentObj(student, app):
    zcql_service = app.zcql()
    query = f"SELECT * FROM students WHERE account_number = '{student['account_number']}'"
    output = zcql_service.execute_query(query)
    return output

def handler(request: Request):
    try:
        app = zcatalyst_sdk.initialize()

        if request.path == "/addStudent" and request.method == 'POST':
            body = request.get_json()
            student = body.get('student')

            if not student:
                return make_response(jsonify({
                    "message": "student object missing"
                }), 400)

            db_res = getStudentDetailsByStudentObj(student, app)

            if len(db_res) == 0:
                datastore_service = app.datastore()
                table_service = datastore_service.table(tableName)
                table_service.insert_row(student)

                return make_response(jsonify({
                    "status": 200,
                    "message": "new student added successfully!",
                    "student": student
                }), 200)

            return make_response(jsonify({
                "status": 200,
                "message": "there is already a student!"
            }), 200)

        return make_response(jsonify({
            "message": "Method not allowed"
        }), 405)

    except Exception as e:
        return make_response(jsonify({
            "error": "Server error -------> " + str(e)
        }), 500)
