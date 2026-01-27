import json
import zcatalyst_sdk
from flask import Request, jsonify, make_response

tableName = "schools"

def getSchool(name,address, app):
    zcql_service = app.zcql()
    query = f"SELECT * FROM schools WHERE school_name = '{name}' AND school_address = '{address}'"
    output = zcql_service.execute_query(query)
    return output



def handler(request: Request):
    try:
        app = zcatalyst_sdk.initialize()

        if request.path == "/signUp" and request.method == 'POST':
            body = request.get_json()
            school = body.get('school')

            if not school:
                return make_response(jsonify({
                    "message": "school object missing"
                }), 400)

            db_res = getSchool(school['school_name'],school['school_address'], app)

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
            "message": "Method not allowed"
        }), 405)

    except Exception as e:
        return make_response(jsonify({
            "error": "Server error -------> " + str(e)
        }), 500)
