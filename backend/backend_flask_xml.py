from flask import Flask, request, jsonify
import sqlite3 as sql
import xml.etree.ElementTree as et
from plotter import drawPlot
import pandas as pd

app = Flask(__name__)

@app.route('/result', methods=['POST'])
def result():
    data = et.fromstring(request.data.decode("utf-8"))
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
            # print(str(row[0]), str(row[1]), row[2])
            cur.execute("INSERT INTO location_sensor_data (latitude,longitude,height) VALUES (?,?,?)",
                        (latitude, longitude, height))
            con.commit()
            cur.execute("select * from location_sensor_data")
            tdata = cur.fetchall()
            data = pd.DataFrame(tdata)
            data.columns = ['latitude', 'longitude', 'height']
            data["latitude"] = pd.to_numeric(data["latitude"], downcast="float")
            data["longitude"] = pd.to_numeric(data["longitude"], downcast="float")
            data["height"] = pd.to_numeric(data["height"], downcast="float")
            # data.to_csv(path_or_buf=r"c:\react_js_app\public\lat-lon.csv", sep=",", na_rep="NA")
    return "<?xml version='1.0' encoding='UTF-8'?><sensor_data><status_code>200</status_code><status>OK</status><message>Data has been successfully stored</message></sensor_data>"


@app.route('/clear', methods=['POST'])
def clear():
    with sql.connect("mySqlite.db") as con:
        cur = con.cursor()
        cur.execute("delete from location_sensor_data")
        con.commit()
    return "<?xml version='1.0' encoding='UTF-8'?><sensor_data><status_code>200</status_code><status>OK</status><message>Data has been cleared</message></sensor_data>"


@app.route('/plotImage', methods=['GET'])
def plotImage():
    imgData = drawPlot()
    if imgData == "NA":
        statusCode = 500
    else:
        statusCode = 200
    return "<?xml version='1.0' encoding='UTF-8'?><sensor_data><status_code>" + str(statusCode) + "</status_code><status>OK</status><image_data>" + imgData + "</image_data></sensor_data>"


if __name__ == '__main__':
    app.run(debug=True)
