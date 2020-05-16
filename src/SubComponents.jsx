import React from 'react';

export const RowInput = (props) => (
    <td align='center'>
        <input
            type={props.type}
            name={props.name}
            value={props.value}
            onChange={props.onChange}
            style={{ width: "100%", border: "1px solid #ccc", borderRadius: "4px", padding: "6px 10px",
                    display: "inline-block", boxSizing: "border-box"}}
        />
    </td>
);

export const RowItem = (props) => (
    <td align='center'>
        <span> {props.value} </span>
    </td>
);

export const TableHeader = (props) => (
    <thead style={{ backgroundColor: "#4CAF50", color: 'white', tableLayout: "auto", width: "180px" }}>
        <tr>
            {
                props.values.map((value, idx) => (
                    <th key={idx} className="text-center">{value}</th>
                ))
            }
        </tr>
    </thead>
);

export const ResponseMessage = (props) => (
    <p align='center'>
        {props.value}
    </p>
);

export const DocumentHeader = (props) => (
    <div
    border="1px solid #black" style={{ fontSize:"30px", justifyContent:'center', backgroundColor: "#00BFFF", color: 'white'}} 
    align='center'>
    Location Sensor Data
    </div>
)