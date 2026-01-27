import logging

import zcatalyst_sdk
from flask import Request, jsonify, make_response



def getSchool(id,password, app):
    zcql_service = app.zcql()
    query = f"SELECT * FROM schools WHERE school_id = '{id}' AND school_password = '{password}'"
    output = zcql_service.execute_query(query)
    return output

def handler(request: Request):
    try:
        app = zcatalyst_sdk.initialize()

        if request.path == "/login" and request.method == "POST":

            body = request.get_json()
            school = body.get('school')
            print(school)
            if not school:
                return make_response(jsonify({
                    "error": "school object is missing"
                }), 400)

            db_res = getSchool(school['school_id'],school['school_password'], app)
            print( db_res[0]['schools'],"------------------------------------------------>>>>>>>")
            if len(db_res) > 0:
                return make_response(jsonify({
                    "status": 200,
                    "message": "login successful!",
                    "school": db_res[0]['schools']
                }), 200)

        return make_response(jsonify({
            "error": "Method not allowed"
        }), 405)

    except Exception as e:
        logging.error(e)
        return make_response(jsonify({
            "error": "Server error"+e
        }), 500)
