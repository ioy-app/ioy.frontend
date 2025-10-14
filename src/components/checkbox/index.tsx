import React from "react";

export default function Checkbox(props) {
    return (
        <label>
            <input
                type="checkbox"
                name={props.name}
                {...props}
            />
            <p>{props.placeholder}</p>
        </label>
    )
}