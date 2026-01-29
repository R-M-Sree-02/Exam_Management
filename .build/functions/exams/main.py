import logging
import json
import zcatalyst_sdk
from flask import Request, jsonify, make_response

EXAMS_TABLE = "exams"
RESULTS_TABLE = "exam_results"
STUDENTS_TABLE = "students"

YELLOW = "\u001b[33m"
RESET = "\u001b[0m"


def handler(request: Request):
    try:
        app = zcatalyst_sdk.initialize()

        # ----------------------------- conduct exam -----------------------------
        if request.path == "/addExam" and request.method == "POST":
            body = request.get_json()
            exam = body.get("exam")

            if not exam:
                return make_response(jsonify({
                    "error": "exam object missing"
                }), 400)

            zcql = app.zcql()

            query = f"SELECT ROWID FROM {EXAMS_TABLE} WHERE exam_start_at = '{exam["exam_start_at"]}' AND exam_end_at = '{exam["exam_end_at"]}' AND std = '{exam["std"]}' AND academic_year = '{exam["academic_year"]}'"
            temp_exam = zcql.execute_query(query)

            if temp_exam:
                return make_response(jsonify({
                    "status": 201,
                    "message": "Duplicate exam already exists"
                }), 200)

            datastore = app.datastore()
            table = datastore.table(EXAMS_TABLE)

            table.insert_row(exam)

            return make_response(jsonify({
                "status": 200,
                "message": "Exam conducted successfully",
                "exam": exam
            }), 200)

        # ----------------------------- add result -----------------------------
        elif request.path == "/addExamResult" and request.method == "POST":
            body = request.get_json()
            result = body.get("examResult")

            if not result:
                return make_response(jsonify({
                    "error": "result object missing"
                }), 400)

            studentId = result["student_id"]
            examId = result["exam_id"]

            zcql = app.zcql()
            query = f"SELECT * FROM {RESULTS_TABLE} WHERE exam_id = '{examId}' AND student_id = '{studentId}'"

            data = zcql.execute_query(query)

            if (len(data) > 0):
                return make_response(jsonify({
                    "status": 201,
                    "message": "Result Already Updated",
                }), 200)

            # print(int(result['subject_1']) < 35)
            s1 = int(result["subject_1"])
            s2 = int(result["subject_2"])
            s3 = int(result["subject_3"])
            s4 = int(result["subject_4"])
            s5 = int(result["subject_5"])

            total = s1 + s2 + s3 + s4 + s5
            if all(s > 34 for s in [s1, s2, s3, s4, s5]):
                finalResult = "PASS"
            else:
                finalResult = "FAIL"

            exam_result = {
                "student_id": studentId,
                "exam_id": examId,
                "subject_1": s1,
                "subject_2": s2,
                "subject_3": s3,
                "subject_4": s4,
                "subject_5": s5,
                "total": total,
                "final_result": finalResult,
            }

            datastore = app.datastore()
            table = datastore.table(RESULTS_TABLE)

            # print(exam_result)

            table.insert_row(exam_result)

            return make_response(jsonify({
                "status": 200,
                "message": "Result added successfully",
                "final_result": exam_result['final_result'],
                "total": total
            }), 200)

        # -----------------------------view result -----------------------------
        elif request.path == "/viewResult" and request.method == "GET":

            exam_id = request.args.get("exam_id")

            if not exam_id:
                return make_response(jsonify({
                    "error": "exam_id missing"
                }), 400)

            zcql = app.zcql()

            query_1 = f"SELECT * FROM {RESULTS_TABLE} WHERE exam_id = '{exam_id}'"
            exam_results = zcql.execute_query(query_1)

            result_list = []

            for row in exam_results:
                result = row[RESULTS_TABLE]

                student_id = result["student_id"]

                query_2 = f"SELECT student_name, std FROM {STUDENTS_TABLE} WHERE student_id = '{student_id}'"
                student_res = zcql.execute_query(query_2)

                student = student_res[0][STUDENTS_TABLE] if student_res else {}

                result_list.append({
                    "result": {
                        **result,
                        "student_name": student.get("student_name"),
                        "std": student.get("std")
                    }
                })

        # ----------------------------- get all exam details -----------------------------
        elif request.path == "/getAllExamDetails" and request.method == "GET":

            zcql = app.zcql()
            query = f"SELECT * FROM {EXAMS_TABLE}"
            examDetails = zcql.execute_query(query)

            return make_response(jsonify({
                "status": 200,
                "count": len(examDetails),
                "examDetails": examDetails
            }), 200)

        return make_response(jsonify({
            "error": "Method not allowed"
        }), 405)

    except Exception as e:
        logging.error(e)
        return make_response(jsonify({
            "error": e
        }), 500)
