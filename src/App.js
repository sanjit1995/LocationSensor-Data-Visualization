/* eslint-disable no-unused-vars */
import React from 'react';
import { TableHeader, RowItem, RowInput, ResponseMessage, DocumentHeader } from './SubComponents.jsx'
import './App.css';
import X2JS from 'xml2json';
import sample from './sample.png'

function getInitialState() {
  return {
    latitude: "",
    longitude: "",
    height: ""
  };
}

class App extends React.Component {
  state = {
    rows: [],
    currentInput: getInitialState(),
    responseMessage: ""
  };

  setResponseHeader = (msg) => {
    this.setState((state, props) => {
      const { rows, currentInput, responseMessage} = state;
      const newState = {
        rows: [...rows],
        currentInput: getInitialState(),
        responseMessage: msg
      }
      return newState;
    })
  }

  validInput = () => {
    const { currentInput } = this.state;
    return currentInput.height && currentInput.latitude && currentInput.longitude;
  }

  submitInput = () => {
    if (this.validInput()) {
      this.setState((state, props) => {
        const { rows, currentInput, responseMessage } = state;
        const newState = {
          rows: [...rows, currentInput],
          currentInput: getInitialState(),
          responseMessage: ""
        }
        console.log(currentInput, newState);
        return newState;
      })
    }
    else {
      console.error("Empty Input");
    }
  }

  convertToXml = () => {
    var x2js = new X2JS()
    var xmlAsStr = x2js.json2xml_str(JSON.parse(JSON.stringify(this.state.rows)))
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

  validRowsData = () => {
    const { rows } = this.state;
    return rows.length;
  }

  submitAll = () => {
    console.log(this.validRowsData())
    if (!this.validRowsData()) {
      this.setResponseHeader("Please enter all data and click confirm when done")
    }
    else {
      console.log(this.state)
      console.log("Sending request")
      var completeXml = this.convertToXml()
      console.log(completeXml)
      fetch('/result', {
        method: "POST",
        cache: "no-cache",
        headers: {
          "content_type": "application/xml",
        },
        body: completeXml
      })
        .then(response => response.text())
        .then(xml => {
          console.log(xml);
          var x2js = new X2JS()
          var jsonObj = x2js.xml_str2json(xml)
          console.log(jsonObj.sensor_data.message)
          this.setResponseHeader(jsonObj.sensor_data.message)
        })
        .catch((error) => {
          this.setResponseHeader(error)
        });

      this.setState((state, props) => {
        const { rows, currentInput, responseMessage} = state;
        const newState = {
          rows: [],
          currentInput: getInitialState(),
          responseMessage: responseMessage
        }
        return newState;
      })
    }
  }

  storeInput = event => {
    const { name, value } = event.target;
    const currentInput = this.state.currentInput;
    currentInput[name] = value;
    this.setState({
      currentInput
    })
  }

  handleRemoveRow = (idx) => {
    console.log(idx)
    var tempRows = [...this.state.rows]; // make a separate copy of the array
    if (idx !== -1) {
      tempRows.splice(idx, 1);
      this.setState({ rows: tempRows });
    }
  };

  removeCurrentInput = () => {
    this.setState({
      currentInput: getInitialState()
    });
  };

  clearTable = () => {
    fetch('/clear', {
      method: "POST",
      cache: "no-cache",
      headers: {
        "content_type": "application/xml",
      },
      body: ""
    })
      .then(response => response.text())
      .then(xml => {
        console.log(xml);
        var x2js = new X2JS()
        var jsonObj = x2js.xml_str2json(xml)
        console.log(jsonObj.sensor_data.message)
        this.setResponseHeader(jsonObj.sensor_data.message)
      })
      .catch((error) => {
        this.setResponseHeader(error)
      });
  }

  render() {
    return (
      <div>
        <DocumentHeader />
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
                {/* <td style={{ width: '10%' }} align='center'>
                  {this.selectButtonAction(this.state.rows.length, idx, this.state.rows[idx].button)}
                </td> */}
              </tr>
            ))}
            <tr>
              <RowInput
                type="text"
                name="latitude"
                value={this.state.currentInput.latitude}
                onChange={this.storeInput}
              />
              <RowInput
                type="text"
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
        <div style={{textAlign: "center"}}>
          <div style={{display: "inline-block" }}>
            <button
              onClick={this.submitAll}
              className="submit"
              style={{
                width: "400px", background: "#4CAF50", color: "white", cursor: "pointer",
                margin: "4px 2px", padding: "8px 16px", boxSizing: "border-box", alignContent: 'center'
              }}>
              Submit
            </button>
          </div>
          <div style={{display: "inline-block" , float: "right", margin: "4px 8px"}}>
            <button
              onClick={this.clearTable}
              className="clear"
              padding="15px 32px" fontSize="40px"
              >
              Clear Table
            </button>
          </div>
        </div>
        <ResponseMessage
          value={this.state.responseMessage}
        />
        <a href={sample}>Click Here</a> to see the plot
      </div>
    );
  }
}

export default App;
