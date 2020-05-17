import os

os.environ['PROJ_LIB'] = r'c:\ProgramData\Anaconda3\pkgs\proj4-5.2.0-ha925a31_1\Library\share'
from mpl_toolkits.basemap import Basemap
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

def drawPlot(table_data):
    #df = pd.read_csv(r'c:\react_js_app\public\lat-lon.csv')
    df = pd.DataFrame(table_data)

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
    plt.savefig(r'c:\react_js_app\src\sample.png', dpi=1280)
    #plt.show()
