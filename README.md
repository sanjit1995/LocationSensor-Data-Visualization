#### This project is a part of Communication and Visualization Coursework belonging to HsKA.
The project uses React JS Framework as the front-end website and flask(python) as the backend framework. The Website runs on the development server which comes available with the react application.

* For more information about ReactJS : https://reactjs.org/docs/
* For more information on Python : https://docs.python.org/3/
* For more information on Flask : https://flask.palletsprojects.com/en/1.1.x/
* For more information on Basemap : https://matplotlib.org/basemap/

#### Other Dependencies:
* npm module xml2json (https://github.com/abdolence/x2js)
* python libraries required for backend :
    
    * flask
    * sqlite3
    * xml
    * pandas
    * base64
    * matplotlib
    * mpl_toolkits
    * io
    * os
    * sqlalchemy(optional, required if a new db has to be created)

### Error Codes :
* SERVER_ERR_500 : Server side connection issue
* DATA_ERR_500 : No Data Available to plot

### Steps to run :
##### Client Side Instructions :
* Install node on your OS (https://nodejs.org/en/download/) and ensure that node package manager is installed too.
Check installation by **npm -v** in the command line. This should print the version installed.
* Install npx using **npm install -g npx** (https://www.npmjs.com/package/npx)
* Create a react application in the directory of your choice by following command:  
**npx create-react-app [name-of-app]** (https://create-react-app.dev/docs)
* This creates a pre-configured set of items required as a template and can be edited as per requirement.
* To test the react web application type the following commands:  
**cd [name-of-app]**  
**npm start**
* This will launch the application automatically at http://localhost:3000/
* A default web page appears and now we are good to go.
* Please copy the contents of the React folder in the .zip file to the location of **[name-of-app]** and replace the existing directories if required.
* To learn about the default files and folder structure go to : https://create-react-app.dev/docs/folder-structure
* An additional dependency **"xml2json"** is to be installed. Please download it from https://github.com/abdolence/x2js as .zip. Unzip the contents and copy the folder into **[name-of-app]**. Rename the folder as **"xml2json"** if it is present as **"x2js"**.
* An additional file named "SubComponents.js" contains all the SubComponents used in "App.js"
* In the **"package.json"** file inside **[name-of-app]** which holds all the metadata relevant to the project, ensure that the proxy address is present at the end :  
**"proxy": "http://127.0.0.1:5000/"**  
This is the backend side server address which will be routed to during runtime.

##### Server Side Instructions :
* To install python go to : https://www.python.org/downloads/ depending on the OS.
* Download and install **"pip"** which is the package manager for python and can be used to install packages from command line.   
For information on how to install go to : https://pip.pypa.io/en/stable/installing/
* Once the above steps are done, this can be verified with below command :   
**python -m pip --version**
* Copy the content of **"backend"** folder inside the .zip file to local.
* Now we need to install the dependent libraries required for this project. This can be done by :  
**pip install [library-name]**  
Please refer to the set of dependent libraries listed above and install if not already present.
* **"Flask"** library handles the routing section in the backend server.
* Files description :
    * **backend_flask_xml.py** : The main python file which has all the routing instructions and the respective functions to handle the data
    * **plotter. py** : Python file which handles plotting of data using "Basemap" of "mpl_toolkits".
    * **mySqlite.db** : Sqlite Database (To know more : https://flask.palletsprojects.com/en/1.1.x/patterns/sqlite3/)
* In this project there are 3 route paths namely :
    * **/result (POST)** : Receives a POST request to insert the entered data into the "location_sensor_data" table of sqlite database.
    * **/clear (POST)** : Receives a POST request to truncate all data from table.
    * **/plotImage (GET)** : Receives a GET request to return the plotted image. The plotted image is returned as base64 encode
* All the transactions are in XML.
    * StatusCode **200** for **Success**
    * StatusCode **500** for **failure**
* Please ensure that the following line is present right after **"import os"** as it is an ENV_VARIABLE declaration necessary for **"Basemap"** :  
**os.environ['PROJ_LIB'] = r'c:\ProgramData\Python\pkgs\proj4-5.2.0-ha925a31_1\Library\share'**  
* In case of creation of new .db file, please run the below commands in python console or in a new python file :  
**from sqlalchemy import create_engine**  
**import sqlite3 as sql**  
**create_engine('sqlite:///C:\\react_js_app\\backend\\mySqlite.db', echo=True)**  
**conn = sql.connect('mySqlite.db')**  
**print("Opened database successfully")**  
* In case the table needs to be recreated, please run below commands as well :   
**conn.execute('CREATE TABLE location_sensor_data (latitude TEXT, longitude TEXT, height INT)')**  
**print("Table created successfully")**  
For more information : https://github.com/matplotlib/basemap/issues/419

##### Final code run :
* Start the FrontEnd server by following command inside **[name-of-app]** directory :  
**npm start**  
This runs at http://localhost:3000/
* Start the BackEnd server by following command inside your local **"backend"** directory :  
**python backend_flask_xml.py**  
This runs at http://127.0.0.1:5000/

Hope this was helpful information. Enjoy Coding !

