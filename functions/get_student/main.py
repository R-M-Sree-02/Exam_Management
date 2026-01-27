import zcatalyst_sdk
from flask import Request, make_response, jsonify
import logging

tableName = "students"
columnName_1 = "student_name"
columnName_2 = "account_number"

def handler(request: Request):
    try:
        app = zcatalyst_sdk.initialize()

        if request.method == "GET":
            name = request.args.get("name")

            if not name:
                return make_response(jsonify({
                    "error": "name parameter missing"
                }), 400)

            zcql = app.zcql()
            query = f"SELECT * FROM {tableName} WHERE {columnName_1} = '{name}'"
            student = zcql.execute_query(query)

            return make_response(jsonify({
                "message": "Student fetched successfully",
                "student": student
            }), 200)

        return make_response(jsonify({
            "error": "Method not allowed"
        }), 405)

    except Exception as e:
        logging.error(e)
        return make_response(jsonify({
            "error": "Server error"
        }), 500)
