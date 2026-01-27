import zcatalyst_sdk
from flask import Request, make_response, jsonify
import logging

tableName = "students"
YELLOW = '\033[93m'
RESET = '\033[0m'

def handler(request: Request):
    try:
        app = zcatalyst_sdk.initialize()
        school_id = request.args.get("school_id")

        if request.path == "/getStudentsList" and request.method == "GET":
            zcql = app.zcql()
            query = f"SELECT * FROM {tableName} WHERE school_id = '{school_id}'"
            students = zcql.execute_query(query)

            return make_response(jsonify({
                "message":"students list is get Successfully",
                "studentList": students,
                "count": len(students)
            }), 200)

        return make_response(jsonify({"error": "Invalid endpoint"}), 404)

    except Exception as e:
        logging.error(e)
        return make_response(jsonify({"error": "Server error"}), 500)
