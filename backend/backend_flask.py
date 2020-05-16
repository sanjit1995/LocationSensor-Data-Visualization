from flask import Flask, request, jsonify
import sqlite3 as sql
import xml.etree.ElementTree as et

app = Flask(__name__)

@app.route('/result', methods=['POST'])
def result():
    data = request.get_json()
    return storeData(data)


def storeData(data):
    for row in data:
        print(row)
        with sql.connect("mySqlite.db") as con:
            cur = con.cursor()
            #print(str(row[0]), str(row[1]), row[2])
            cur.execute("INSERT INTO location_sensor_data (latitude,longitude,height) VALUES (?,?,?)",
                        (str(row['latitude']), str(row['longitude']), row['height']))
            con.commit()
    return jsonify(message='Data successfully stored'),200

if __name__ == '__main__':
 app.run(debug=True)
