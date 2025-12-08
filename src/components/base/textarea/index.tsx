import React from "react";
import "./styles.less";

export default function Textarea(props) {
    return (
        <label className="input_label">
            {props.label && <p className="input_label__title">{props.label}:</p>}
            <textarea
                type={props.type}
                placeholder={props.placeholder}
                name={props.name}
                className="input_label__textarea"
                disabled={props.disabled}
                {...props}
                onChange={event => {
                    props?.onLocalChange && props.onLocalChange(event) || (
                        props?.onChange && props.onChange(event)
                    );
                }}
            />
        </label>
    )
}