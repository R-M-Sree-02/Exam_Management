import logging
import json
import zcatalyst_sdk
from flask import Request, jsonify, make_response

tableName = "schools"

def getSchoolForLogin(id, password, app):
    zcql_service = app.zcql()
    query = f"SELECT * FROM schools WHERE school_id = '{id}' AND school_password = '{password}'"
    output = zcql_service.execute_query(query)
    return output


def getSchoolForSignUp(name, address, app):
    zcql_service = app.zcql()
    query = f"SELECT * FROM schools WHERE school_name = '{name}' AND school_address = '{address}'"
    output = zcql_service.execute_query(query)
    return output


def handler(request: Request):
    try:
        app = zcatalyst_sdk.initialize()

        body = request.get_json()
        school = body.get('school')
        print(school)

        if not school:
            return make_response(jsonify({
                "error": "school object is missing"
            }), 400)
        

        if request.path == "/login" and request.method == "POST":
            db_res = getSchoolForLogin(school['school_id'],
                               school['school_password'], app)
            # print(db_res[0]['schools'],
            #       "------------------------------------------------>>>>>>>")
            if len(db_res) > 0:
                return make_response(jsonify({
                    "status": 200,
                    "message": "login successful!",
                    "school": db_res[0]['schools']
                }), 200)
            else:
                return make_response(jsonify({
                    "status": 401,
                    "message": "invalid credentials"
                }))

        elif request.path == "/signUp" and request.method == 'POST':

            db_res = getSchoolForSignUp(school['school_name'],
                               school['school_address'], app)

            if len(db_res) == 0:
                datastore_service = app.datastore()
                table_service = datastore_service.table(tableName)
                table_service.insert_row(school)

                return make_response(jsonify({
                    "status": 200,
                    "message": "new school added successfully!",
                    "school": school
                }), 200)

            return make_response(jsonify({
                "status": 200,
                "message": "There is already a school!"
            }), 200)

        return make_response(jsonify({
            "error": "Method not allowed"
        }), 405)

    except Exception as e:
        logging.error(e)
        return make_response(jsonify({
            "error": "Server error"+e
        }), 500)