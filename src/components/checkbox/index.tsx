import React from "react";

import "./styles.less";

export default function Checkbox(props) {
    return (
        <label className="checkbox">
            <input
                type="checkbox"
                name={props.name}
                {...props}
            />
            <p>{props.placeholder}</p>
        </label>
    )
}