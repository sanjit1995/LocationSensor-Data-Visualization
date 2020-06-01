# Import Libraries
from flask import Flask, request, jsonify
import sqlite3 as sql
import xml.etree.ElementTree as et
from plotter import drawPlot
import pandas as pd

# Define app variable
app = Flask(__name__)

# Define function for /result route
@app.route('/result', methods=['POST'])
def result():
    # Extract the <data> node from the XML
    data = et.fromstring(request.data.decode("utf-8"))
    data = et.ElementTree(data)
    root = data.getroot()
    latitude = ""
    longitude = ""
    height = ""
    # Loop over the child nodes of <data>
    for data in root:
        for nodes in data:
            if nodes.tag == "latitude":
                latitude = nodes.text
            if nodes.tag == "longitude":
                longitude = nodes.text
            if nodes.tag == "height":
                height = nodes.text
        # Open SQL connection to .db file to insert data
        with sql.connect("mySqlite.db") as con:
            cur = con.cursor()
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
    # Return a successful Response XML
    return "<?xml version='1.0' encoding='UTF-8'?><sensor_data><status_code>200</status_code><status>OK</status><message>Data has been successfully stored</message></sensor_data>"

# Define function for /clear route
@app.route('/clear', methods=['POST'])
def clear():
    # Open SQL connection to .db file to delete data
    with sql.connect("mySqlite.db") as con:
        cur = con.cursor()
        cur.execute("delete from location_sensor_data")
        con.commit()
    # Return a successful Response XML
    return "<?xml version='1.0' encoding='UTF-8'?><sensor_data><status_code>200</status_code><status>OK</status><message>Data has been cleared</message></sensor_data>"

# Define function for /plotImage route
@app.route('/plotImage', methods=['GET'])
def plotImage():
    # Call drawPlot() of plotter file
    imgData = drawPlot()
    if imgData == "NA":
        statusCode = 500
    else:
        statusCode = 200
    # Return the Response XML
    return "<?xml version='1.0' encoding='UTF-8'?><sensor_data><status_code>" + str(statusCode) + "</status_code><status>OK</status><image_data>" + imgData + "</image_data></sensor_data>"


if __name__ == '__main__':
    app.run(debug=True, )
