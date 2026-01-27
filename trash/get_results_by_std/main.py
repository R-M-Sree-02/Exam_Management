import zcatalyst_sdk
from flask import Request, jsonify, make_response


def getExamResults(std, exam_id, app):
    zcql = app.zcql()
    query = f"SELECT * FROM exam_results WHERE std = '{std}' AND exam_id = {exam_id}"
    output = zcql.execute_query(query)
    return output

def handler(request: Request):
    try:
        app = zcatalyst_sdk.initialize()

        if request.path == "/getResultsByStd" and request.method == "GET":
            std = request.args.get("std")
            exam_id = request.args.get("exam_id")

            result = getExamResults(std,exam_id,app)

            return make_response(jsonify({
                "status": 200,
                "count": len(result),
                "data": result
            }), 200)

        return make_response(jsonify({
            "message": "Method not allowed"
        }), 405)

    except Exception as e:
        return make_response(jsonify({
            "error": "Server error -------> " + str(e)
        }), 500)
