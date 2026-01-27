import json
import zcatalyst_sdk
from flask import Request, jsonify, make_response

table_name = "exam_results"


def handler(request: Request):
    try:
        app = zcatalyst_sdk.initialize()

        if request.path == "/addExamResult" and request.method == "POST":
            body = request.get_json()
            exam_result = body.get("exam_result")

            if not exam_result:
                return make_response(jsonify({
                    "message": "exam result object missing"
                }), 400)

            datastore = app.datastore()
            table = datastore.table(table_name)

            table.insert_row(exam_result)

            return make_response(jsonify({
                "status": 200,
                "message": "Exam result added successfully",
                "data": exam_result
            }), 200)

        return make_response(jsonify({
            "message": "Method not allowed"
        }), 405)

    except Exception as e:
        return make_response(jsonify({
            "error": "Server error -------> " + str(e)
        }), 500)
