import json
import zcatalyst_sdk
from flask import Request, jsonify, make_response

table_name = "exam_results"


def handler(request: Request):
    try:
        app = zcatalyst_sdk.initialize()

        if request.path == "/updateExamMarks" and request.method == "POST":
            body = request.get_json()
            marks = body.get("marks")

            if not marks:
                return make_response(jsonify({
                    "message": "marks object missing"
                }), 400)

            sub_1 = marks["subject_1"]
            sub_2 = marks["subject_2"]
            sub_3 = marks["subject_3"]
            sub_4 = marks["subject_4"]
            sub_5 = marks["subject_5"]

            total = sub_1 + sub_2 + sub_3 + sub_4 + sub_5

            if (sub_1 > 35 and sub_2 > 35 and sub_3 > 35 and sub_4 > 35 and sub_5 > 35):
                final_result = "PASS"
            else:
                final_result = "FAIL"

            datastore = app.datastore()
            table = datastore.table(table_name)

            table.update_row({
                "ROWID": marks["ROWID"],
                "subject_1": sub_1,
                "subject_2": sub_2,
                "subject_3": sub_3,
                "subject_4": sub_4,
                "subject_5": sub_5,
                "total": total,
                "final_result": final_result
            })

            return make_response(jsonify({
                "status": 200,
                "message": "Marks updated successfully",
                "total": total,
                "final_result": final_result
            }), 200)

        return make_response(jsonify({
            "message": "Method not allowed"
        }), 405)

    except Exception as e:
        return make_response(jsonify({
            "error": "Server error -------> " + str(e)
        }), 500)
