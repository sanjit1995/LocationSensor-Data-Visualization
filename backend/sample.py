from sqlalchemy import create_engine
import sqlite3 as sql
from mpl_toolkits.mplot3d import axes3d
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

engine = create_engine('sqlite:///C:\\react_js_app\\backend\\mySqlite.db', echo=True)

conn = sql.connect('mySqlite.db')
print("Opened database successfully")

#conn.execute('CREATE TABLE location_sensor_data (latitude TEXT, longitude TEXT, height INT)')
#print("Table created successfully")
with sql.connect("mySqlite.db") as con:
    cur = con.cursor()
    #cur.execute("INSERT INTO location_sensor_data (latitude,longitude,height) VALUES (?,?,?)", ("88.2", "127.4", 64))
    #con.commit()
    #msg = "Record successfully added"
    #cur.execute("DROP TABLE location_sensor_data")
    #cur.execute("delete from location_sensor_data")
    #con.commit()
    cur.execute("select * from location_sensor_data")
    tdata = cur.fetchall()
    print(tdata)
    exit(1)
    data = pd.DataFrame(tdata)
    data.columns = ['latitude', 'longitude', 'height']
    data = data.set_index('', inplace=True)
    print(data)
    latitudes = [latitude[0] for latitude in cur.execute("select latitude from location_sensor_data")]
    longitudes = [longitude[0] for longitude in cur.execute("select longitude from location_sensor_data")]
    heights = [height[0] for height in cur.execute("select height from location_sensor_data")]
    cur.execute("select longitude from location_sensor_data")
    print("Data present:")
conn.close()

fig = plt.figure()
#ax = fig.add_subplot(111, projection='3d')

latitudes = np.array(np.array(latitudes, dtype=float))
longitudes = np.array(longitudes, dtype=float)
heights = np.array(heights, dtype=float)
print(longitudes)

ax = plt.gca(projection="3d")
ax.scatter(latitudes,longitudes, heights, c='b', s=50)
ax.plot(latitudes,longitudes, heights, color='b')

#ax.plot_wireframe(latitudes, longitudes, heights)
origin = [0,0,10]
ax.text(origin[0], origin[0], origin[0], "(0,0,0)", size=10)
ax.set_xlabel('latitude')
ax.set_ylabel('longitude')
ax.set_zlabel('height')

plt.show()
plt.savefig("sample.jpeg")

# Base = declarative_base()
#
#
# class School(Base):
#
#     __tablename__ = "woot"
#
#     id = Column(Integer, primary_key=True)
#     name = Column(String)
#
#
#     def __init__(self, name):
#
#         self.name = name
#
#     cur = con.cursor()
#     cur.execute("select * from students")
#
#
# Base.metadata.create_all(engine)