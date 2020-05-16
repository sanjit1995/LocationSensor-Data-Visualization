from flask import Flask, request, jsonify
import sqlite3 as sql
import xml.etree.ElementTree as et

app = Flask(__name__)

@app.route('/result', methods=['POST'])
def result():
    data = et.fromstring(request.data.decode("utf-8"))
    return storeData(data)


def storeData(data):
    data = et.ElementTree(data)
    root = data.getroot()
    latitude = ""
    longitude = ""
    height = ""
    for data in root:
        for nodes in data:
            # print(nodes)
            if nodes.tag == "latitude":
                latitude = nodes.text
            if nodes.tag == "longitude":
                longitude = nodes.text
            if nodes.tag == "height":
                height = nodes.text
        with sql.connect("mySqlite.db") as con:
            cur = con.cursor()
            #print(str(row[0]), str(row[1]), row[2])
            cur.execute("INSERT INTO location_sensor_data (latitude,longitude,height) VALUES (?,?,?)",
                        (latitude, longitude, height))
            con.commit()
    return "<?xml version='1.0' encoding='UTF-8'?><sensor_data><statusCode>200</statusCode><status>OK</status><message>Data has been successfully stored</message></sensor_data>"

if __name__ == '__main__':
 app.run(debug=True)
