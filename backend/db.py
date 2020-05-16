import xml.etree.ElementTree as et

xml_string = '''<?xml version='1.0' encoding='UTF-8'?><sensor_data><data id='0'><latitude>4</latitude><longitude>4</longitude><height>4</height></data><data id='1'><latitude>3</latitude><longitude>3</longitude><height>3</height></data></sensor_data>'''
xml2 = '''<?xml version="1.0" encoding="UTF-8"?>
<metadata>
<food>
    <item name="breakfast">Idly</item>
    <price>$2.5</price>
    <description>
   Two idly's with chutney
   </description>
    <calories>553</calories>
</food>
</metadata>
'''
data = et.fromstring(xml_string)
data = et.ElementTree(data)
root = data.getroot()
for data in root:
    for nodes in data:
        if nodes.tag == "latitude":
            latitude = nodes.text
        if nodes.tag == "longitude":
            longitude = nodes.text
        if nodes.tag == "height":
            height = nodes.text
    print(latitude, longitude, height)
    print("---------------")