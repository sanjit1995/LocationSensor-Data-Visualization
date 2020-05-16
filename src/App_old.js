import React from 'react';
import { TableHeader, RowItem, RowInput } from './SubComponents.jsx'
import './App.css';

class App extends React.Component {
  state = {
    rows: [],
    currentInput: {}
  };

  submitInput = () => {
    console.log(Object.entries(this.state.currentInput).length)
    if (this.state.currentInput.latitude !== "" && this.state.currentInput.latitude !== "" && this.state.currentInput.latitude !== "") {
      const tempRows = this.state.rows;
      tempRows.push(this.state.currentInput)
      this.setState ({
        rows: tempRows
      })
    }
    else {
      console.error("Empty Input");
    }
  }

  storeInput = event => {
    const { name, value } = event.target;
    const currentInput = this.state.currentInput;
    currentInput[name] = value;
    this.setState({
      currentInput
    })
    console.log(this.state.currentInput)
  }

  /*handleChange = idx => e => {
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

  };*/

  selectButtonAction = (size, idx, button_val) => {
    if (size - 1 > idx) {
      return (
        <button onClick={this.handleRemoveRow}>
          -
        </button>
      )
    }
    else if (button_val === "+") {
      return (
        <button onClick={this.handleAddRow}>
          {button_val}
        </button>
      )
    }
    else {
      return (
        <button onClick={this.handleRemoveRow}>
          {button_val}
        </button>
      )
    }

  }

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

  handleRemoveRow = () => {
    //console.log(idx)
    //console.log(this.state.rows)
    this.setState({
      //rows: this.state.rows.slice(0, -1)
      rows: this.state.rows.splice(0, 1)
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
                <button onClick={this.submitInput}>
                  +
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <button
          onClick={this.handleAddRow}
          className="pull-right btn btn-default">
          -
        </button>
        <button
          onClick={this.handleAddRow}>
          +
        </button>
      </div>
    );
  }
}

export default App;
