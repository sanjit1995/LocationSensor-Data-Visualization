# Import Libraries
import os

os.environ['PROJ_LIB'] = r'c:\ProgramData\Anaconda3\pkgs\proj4-5.2.0-ha925a31_1\Library\share'
from mpl_toolkits.basemap import Basemap
import matplotlib.pyplot as plt
import pandas as pd
import io
import base64
import sqlite3 as sql

# Define function to draw plot
def drawPlot():
    # Open SQL connection to .db file to fetch data
    with sql.connect("mySqlite.db") as con:
        cur = con.cursor()
        cur.execute("select * from location_sensor_data")
        tdata = cur.fetchall()
        data = pd.DataFrame(tdata)
        # If there is no data in the table, return "NA"
        if len(data) == 0:
            return "NA"
        data.columns = ['latitude', 'longitude', 'height']
        data["latitude"] = pd.to_numeric(data["latitude"], downcast="float")
        data["longitude"] = pd.to_numeric(data["longitude"], downcast="float")
        data["height"] = pd.to_numeric(data["height"], downcast="float")
    df = data

    # Get all latitude and longitude values
    lats = df['latitude'].values
    lons = df['longitude'].values

    fig, ax = plt.subplots()

    # Define a Basemap object
    m = Basemap(projection='mill',
                llcrnrlat=-90,
                urcrnrlat=90,
                llcrnrlon=-180,
                urcrnrlon=180,
                ax=ax)

    # Draw backgrounds for plot
    m.drawcountries()
    m.drawmapboundary(fill_color='aqua')
    m.fillcontinents(color='lightgreen', lake_color='aqua')

    # Convert lat and lon to map projection coordinates
    lons, lats = m(lons, lats)

    # Plot the latitude and longitude on the map and denote the height at the point
    m.plot(lons, lats, marker='.', markersize=5, linewidth=1, color='r')
    heights = df['height']
    for i in range(0, len(heights)):
        ax.annotate(str(heights[i]) + "m", (lons[i], lats[i]), xytext=(0.01, 0.01), textcoords='offset points')
    # Convert the image to base64 format
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=1280)
    buf.seek(0)
    img_base64 = base64.b64encode(buf.read())
    # Return the base64 converted string
    return str(img_base64)
