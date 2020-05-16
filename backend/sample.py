from sqlalchemy import create_engine
import sqlite3 as sql

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
    cur.execute("select * from location_sensor_data")
    rows = cur.fetchall()
    print("Data present:")
    print(rows)
conn.close()

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