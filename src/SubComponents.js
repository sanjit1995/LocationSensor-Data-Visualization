import React from 'react';

// Handles all active row input data
export const RowInput = (props) => (
    <td align='center'>
        <input
            type={props.type}
            name={props.name}
            value={props.value}
            onChange={props.onChange}
            ref={props.reference}
            style={{ width: "100%", border: "1px solid #ccc", borderRadius: "4px", padding: "6px 10px",
                    display: "inline-block", boxSizing: "border-box"}}
        />
    </td>
);

// Handles all frozen rows data
export const RowItem = (props) => (
    <td align='center'>
        <span> {props.value} </span>
    </td>
);

// Handles Table Header section in the web-page
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

// Handles Response Header section in the web-page
export const ResponseMessage = (props) => (
    <p align='center'>
        {props.value}
    </p>
);

// Handles Document Header section in the web-page
export const DocumentHeader = (props) => (
    <div
    border="1px solid #black" style={{ fontSize:"30px", justifyContent:'center', backgroundColor: "#f6f8fa", color: 'red'}}
    align='center'>
        {props.value}
    </div>
);