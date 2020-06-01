/* eslint-disable no-unused-vars */

// Import necessary libraries
import React from 'react';
import { TableHeader, RowItem, RowInput, ResponseMessage, DocumentHeader } from './SubComponents.js';
import './App.css';
import X2JS from 'xml2json';

// To reset the currentInput values
function getInitialState() {
  return {
    latitude: "",
    longitude: "",
    height: ""
  };
}

// Main App class, an ES6 class to define a component. Comes with a render() function which renders changes
// automatically
class App extends React.Component {

  // Constructor to define default parameters
  constructor(props) {
    super(props)
    // To refer to the first element of current row
    this.inputRef = React.createRef()

    // Declare default state values
    // rows : Stores all the frozen data
    // currentInput : Stores all the data in the active row
    // responseMessage : Message to appear after every operation
    // pic : Image content to display the plot on the web-page
    this.state = {
      rows: [],
      currentInput: getInitialState(),
      responseMessage: "",
      pic: ""
    };
  }

  // Gets executed after the render() method
  componentDidMount() {
    // To focus the selected element everytime on reloading the page
    this.inputRef.current.focus()
    console.log(this.inputRef)
  }

  // To set the response header message
  setResponseHeader = (msg) => {
    // To only change the responseMessage state variable
    this.setState((state) => {
      const { rows, currentInput, responseMessage } = state;
      const newState = {
        rows: [...rows],
        currentInput: getInitialState(),
        responseMessage: msg
      }
        return newState;
    })
  }

  // To check if all the required parameters are entered
  validInput = () => {
    const { currentInput } = this.state;
    return currentInput.height && currentInput.latitude && currentInput.longitude;
  }

  // To add the currentInput to the rows array and reset the currentInput
  submitInput = () => {
      this.setState((state, props) => {
        const { rows, currentInput, responseMessage } = state;
        const newState = {
          rows: [...rows, currentInput],
          currentInput: getInitialState(),
          responseMessage: ""
        }
        console.log(currentInput, newState);
        return newState;
      });
  }

  // To convert all rows data into a proper XML format to send as REQUEST and return
  convertToXml = () => {
    var x2js = new X2JS()
    const tempRows = this.state.rows
    var xmlStart = "<?xml version='1.0' encoding='UTF-8'?><sensor_data>"
    console.log(xmlStart)
    var nodes = ""
    for (var i = 0; i < tempRows.length; i++) {
      console.log(tempRows[i])
      console.log(x2js.json2xml_str(JSON.parse(JSON.stringify(tempRows[i]))))
      var nodeValues = x2js.json2xml_str(JSON.parse(JSON.stringify(tempRows[i])))
      nodes = nodes + "<data id='" + i + "'>" + nodeValues + "</data>"
    }
    var xmlEnd = "</sensor_data>"
    var completeXml = xmlStart + nodes + xmlEnd
    return completeXml
  }

  // To check if there is at least one complete and valid row present
  validRowsData = () => {
    const { rows } = this.state;
    return rows.length;
  }

  // To verify the validity of data and send a backend POST request
  submitAll = () => {
    if (!this.validRowsData()) {
      this.setResponseHeader("Please enter all data and click confirm when done")
    }
    else {
      console.log(this.state)
      console.log("Sending request")

      // To convert the data into an XML request
      var completeXml = this.convertToXml()
      console.log(completeXml)

      // To send a POST request to the Backend Server with the XML body
      fetch('/result', {
        method: "POST",
        cache: "no-cache",
        headers: {
          "content_type": "application/xml",
        },
        body: completeXml
      })
          // On receiving response, check status code and display Response Header accordingly
        .then(response => {
          if(response.status === 500){
            throw new Error("SERVER_ERR_500 : CHECK SERVER CONNECTION")
          }
          return response.text();
        })
        .then(xml => {
          console.log(xml);
          var x2js = new X2JS()
          var jsonObj = x2js.xml_str2json(xml)
          console.log(jsonObj.sensor_data.message)
          this.setResponseHeader(jsonObj.sensor_data.message)
          console.log(this.state.responseMessage)
        })
        .catch((error) => {
          console.log(error.message)
          this.setResponseHeader(error.message)
        });

      // Reset the state
      this.setState((state) => {
        const { rows, currentInput, responseMessage } = state;
        const newState = {
          rows: [],
          currentInput: getInitialState(),
          responseMessage: responseMessage
        }
        return newState;
      })
    }
  }

  // For every activity in the active row inputs, store the input values dynamically
  storeInput = event => {
    const { name, value } = event.target;
    const currentInput = this.state.currentInput;
    currentInput[name] = value;
    this.setState({
      currentInput : currentInput
    })
  }

  // To remove a row from the frozen data
  handleRemoveRow = (idx) => {
    console.log(idx)
    var tempRows = [...this.state.rows]; // make a separate copy of the array
    if (idx !== -1) {
      tempRows.splice(idx, 1);
      this.setState({ rows: tempRows });
    }
  };

  // To clear all data from the active row
  removeCurrentInput = () => {
    this.setState({
      currentInput: getInitialState()
    });
  };

  // Sends a POST request to backend to clear all data from the table
  clearTable = () => {
    fetch('/clear', {
      method: "POST",
      cache: "no-cache",
      headers: {
        "content_type": "application/xml",
      },
      body: ""
    })
        .then(response => {
            //console.log(response.status);
            if(response.status === 500){
                throw new Error("SERVER_ERR_500 : CHECK SERVER CONNECTION")
            }
            return response.text();
        })
        .then(xml => {
            console.log(xml);
            var x2js = new X2JS()
            var jsonObj = x2js.xml_str2json(xml)
            console.log(jsonObj.sensor_data.message)
            this.setResponseHeader(jsonObj.sensor_data.message)
            console.log(this.state.responseMessage)
        })
        .catch((error) => {
            console.log(error.message)
            this.setResponseHeader(error.message)
        });
  }

  // Sends a GET request to backend to fetch the image data
  fetchImage = () => {
    var outside;
    fetch('/plotImage', {
      method: "GET",
      cache: "no-cache",
      headers: {
        "content_type": "application/text",
      }
    })
        // Extract the Image data from the XML and display in the Image area of the web-page
    .then(response => {
        if(response.status === 500){
            throw new Error("SERVER_ERR_500 : CHECK SERVER CONNECTION")
        }
        return response.text();
    })
    .then(xml => {
      var x2js = new X2JS()
      var jsonObj = x2js.xml_str2json(xml)
      var imgContent = "data:image/png;base64, " + jsonObj.sensor_data.image_data;
      var statusVal = jsonObj.sensor_data.status_code
      imgContent = imgContent.replace("b'","");
      imgContent = imgContent.replace("'","");
      if(statusVal === "200"){
        this.setState({
          pic: imgContent
        });
      }
      else{
        this.setState({
          pic: ""
        });
        throw new Error("DATA_ERR_500 : No Data Available")
      }
    })
      .catch((error) => {
        this.setResponseHeader(error.message)
      });
  }

  // To clear the Image from the Image Area
  clearImage = () => {
    this.setState({
      pic: ""
    });
  }

  // render() method constantly monitors and renders automatically whenever a state variable is changed
  render() {
    return (
      <div>
        <DocumentHeader
          value={"Location Sensor Data"}
        />
        <table className="table table-striped" style={{ tableLayout: "auto", width: "100%" }} id="sensor_data">
          <TableHeader
            values={["Latitude", "Longitude", "Height"]}
          />
          <tbody>
            {this.state.rows.map((row, idx) => (
              <tr key={idx}>
                <RowItem value={row.latitude} />
                <RowItem value={row.longitude} />
                <RowItem value={row.height} />
                <td style={{ textAlign: "center" }}>
                  <button onClick={() => { this.handleRemoveRow(idx) }} padding="15px 32px" fontSize="40px" width="100%">
                    Clear
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              <RowInput
                type="number"
                name="latitude"
                value={this.state.currentInput.latitude}
                onChange={this.storeInput}
                reference={this.inputRef}
              />
              <RowInput
                type="number"
                name="longitude"
                value={this.state.currentInput.longitude}
                onChange={this.storeInput}
              />
              <RowInput
                type="number"
                name="height"
                value={this.state.currentInput.height}
                onChange={this.storeInput}
              />
              <td style={{ textAlign: "center" }}>
                {this.validInput() ? (
                  <button onClick={this.submitInput} padding="15px 32px" fontSize="40px" width="100%">
                    Confirm
                  </button>) : (
                    <button onClick={this.removeCurrentInput} padding="15px 32px" fontSize="40px" width="100%">
                      Clear
                    </button>
                  )}
              </td>
            </tr>
          </tbody>
        </table>
        <div style={{ textAlign: "center" }}>
          <div style={{ display: "inline-block" }}>
            <button
              onClick={this.submitAll}
              className="submit"
              style={{
                width: "400px", background: "#4CAF50", color: "white", cursor: "pointer", border: "none",
                margin: "4px 2px", padding: "8px 16px", boxSizing: "border-box", alignContent: 'center'
              }}>
              Submit
            </button>
          </div>
          <div style={{ display: "inline-block", float: "right", margin: "4px 8px" }}>
            <button
              onClick={this.clearTable}
              className="clear"
              padding="15px 32px" fontSize="40px" style={{ margin: "4px 2px" }}>
              Clear Table
            </button>
          </div>
        </div>
        <ResponseMessage
          value={this.state.responseMessage} />
        <div style={{ display: "inline-block", margin: "1px 16px"}}>
          <button onClick={this.fetchImage}>View Plot</button>
        </div>
        <div style={{ display: "inline-block", float: "right", margin: "1px 16px"}}>
          <button onClick={this.clearImage}>Clear Plot</button>
        </div>
        <img style={{width:"1200px", height:"800px", objectFit:"contain"}} src={this.state.pic} alt=""/>
      </div>
    );
  }
}

export default App;
