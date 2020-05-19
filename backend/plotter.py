import os

os.environ['PROJ_LIB'] = r'c:\ProgramData\Anaconda3\pkgs\proj4-5.2.0-ha925a31_1\Library\share'
from mpl_toolkits.basemap import Basemap
import matplotlib.pyplot as plt
import pandas as pd
import io
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
        #print(data)
    df = data

    lats = df['latitude'].values
    lons = df['longitude'].values

    fig, ax = plt.subplots()

    m = Basemap(projection='mill',
                llcrnrlat=-90,
                urcrnrlat=90,
                llcrnrlon=-180,
                urcrnrlon=180,
                ax=ax)

    #m.drawcoastlines()
    m.drawcountries()
    #m.drawstates()
    m.drawmapboundary(fill_color='aqua')
    m.fillcontinents(color='lightgreen', lake_color='aqua')
    # convert lat and lon to map projection coordinates
    lons, lats = m(lons, lats)

    m.plot(lons, lats, marker='.', markersize=5, linewidth=1, color='r')
    heights = df['height']
    for i in range(0, len(heights)):
        ax.annotate(str(heights[i]) + "m", (lons[i], lats[i]), xytext=(0.01, 0.01), textcoords='offset points')
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=1280)
    buf.seek(0)
    img_base64 = base64.b64encode(buf.read())
    #return jsonify({'status': str(img_base64)})
    return str(img_base64)
