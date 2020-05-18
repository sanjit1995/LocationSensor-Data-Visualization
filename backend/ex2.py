import os

import cv2

os.environ['PROJ_LIB'] = r'c:\ProgramData\Anaconda3\pkgs\proj4-5.2.0-ha925a31_1\Library\share'
from mpl_toolkits.basemap import Basemap
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import io
from PIL import Image
from flask import send_file, make_response, jsonify
import base64
import sqlite3 as sql

def drawPlot():
    with sql.connect("mySqlite.db") as con:
        cur = con.cursor()
        cur.execute("select * from location_sensor_data")
        tdata = cur.fetchall()
        data = pd.DataFrame(tdata)
        if len(data) == 0:
            return "NO DATA AVAILABLE"
        data.columns = ['latitude', 'longitude', 'height']
        data["latitude"] = pd.to_numeric(data["latitude"], downcast="float")
        data["longitude"] = pd.to_numeric(data["longitude"], downcast="float")
        data["height"] = pd.to_numeric(data["height"], downcast="float")
        print(data)
    df = data
    #df = pd.DataFrame(table_data)

    lats = df['latitude'].values
    lons = df['longitude'].values

    fig, ax = plt.subplots()

    m = Basemap(projection='mill',
                llcrnrlat=-90,
                urcrnrlat=90,
                llcrnrlon=-180,
                urcrnrlon=180,
                ax=ax)

    m.drawcoastlines()
    m.drawcountries()
    m.drawstates()
    m.drawmapboundary(fill_color='#46bcec')
    m.fillcontinents(color='green', lake_color='#46bcec')
    # convert lat and lon to map projection coordinates
    lons, lats = m(lons, lats)

    # ax.scatter(lons,lats)
    # plot points as red dots
    m.plot(lons, lats, marker='.', markersize=5, linewidth=1, color='r')
    heights = df['height']
    for i in range(0, len(heights)):
        # print(heights[i])
        # if i < len(heights)-1:
        #     plt.arrow(lons[i], lats[i], lons[i+1]-lons[i], lats[i+1]-lats[i], fc="k", ec="k", linewidth=0.5, head_width=10000, head_length=10000)
        ax.annotate(str(heights[i]), (lons[i], lats[i]), xytext=(0.3, 0.3), textcoords='offset points')
    #plt.savefig(r'c:\react_js_app\src\sample.png', dpi=1280)
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    with buf as image_file:
        encoded_string = base64.b64encode(image_file.read())
    #encoded_string = base64.b64encode(buf)
    print(encoded_string)
    response = {"image": encoded_string}
    print(jsonify(response))
    # return
    # imageString = base64.b64decode(encoded_string)
    # nparr = np.frombuffer(imageString, np.uint8)
    # img = cv2.imdecode(nparr, cv2.IMREAD_ANYCOLOR)
    # print(img)
    # cv2.imshow("tete", img)
    # cv2.waitKey(0)
    # #return {"image": encoded_string}
    # #plt.show()

drawPlot()