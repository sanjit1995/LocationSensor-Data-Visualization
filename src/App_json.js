/* eslint-disable no-unused-vars */
import React from 'react';
import { TableHeader, RowItem, RowInput, ResponseMessage } from './SubComponents.jsx'
import './App.css';
import X2JS from 'xml2json';

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
      const { rows, currentInput, responseMessage } = state;
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
        const { rows, currentInput } = state;
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

  submitAll = () => {
    console.log(this.state)
    console.log("Sending request")
    //console.log(XMLDocument.apply(this.state.rows))
    fetch('/result', {
      method: "POST",
      cache: "no-cache",
      headers: {
        "content_type": "application/json",
      },
      body: JSON.stringify(this.state.rows)
    }
    )
    .then(response => response.json())
    .then(json => {
      console.log(json.message);
      this.setResponseHeader(json.message)
    })
    .catch((error) => {
      this.setResponseHeader(error)
    });
  }

  storeInput = event => {
    const { name, value } = event.target;
    const currentInput = this.state.currentInput;
    currentInput[name] = value;
    this.setState({
      currentInput
    })
  }

  handleChange = idx => e => {
    const { name, value } = e.target;
    const tempRows = this.state.rows;
    tempRows[idx][name] = value

    if (tempRows[idx].latitude !== "" && tempRows[idx].longitude !== "" && tempRows[idx].height !== "") {
      tempRows[idx].button = '+'
    }
    else {
      tempRows[idx].button = '-'
    }

    console.log(this.state.rows);
    this.setState({
      rows: tempRows
    });

  };

  handleAddRow = () => {
    const item = {
      latitude: "",
      longitude: "",
      height: "",
      button: "+"
    };
    this.setState({
      rows: [...this.state.rows, item]
    });
  };

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

  render() {
    return (
      <div>
        <table className="table table-striped" style={{ width: '100%' }}>
          <TableHeader
            values={["Latitude", "Longitude", "Height"]}
          />
          <tbody>
            {this.state.rows.map((row, idx) => (
              <tr key={idx}>
                <RowItem value={row.latitude} />
                <RowItem value={row.longitude} />
                <RowItem value={row.height} />
                <td>
                  <button onClick={() => { this.handleRemoveRow(idx) }}>
                    -
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
              <td>
                {this.validInput() ? (
                  <button onClick={this.submitInput}>
                    +
                  </button>) : (
                    <button onClick={this.removeCurrentInput}>
                      -
                    </button>
                  )}
              </td>
            </tr>
          </tbody>
        </table>
        <button
          onClick={this.submitAll}
          className="submit"
          style = {{width: "30%"}}>
          Submit
        </button>
        <ResponseMessage 
        value={this.state.responseMessage}
        />
      </div>
    );
  }
}

export default App;
