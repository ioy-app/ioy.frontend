import React from "react";
import "./styles.less";

export default function Input(props) {
    return (
        <label className={`input_label ${props?.className && props.className}`}>
            {props.label && <p className="input_label__title">{props.label}:</p>}
            <input
                type={props.type}
                placeholder={props.placeholder}
                name={props.name}
                
                disabled={props.disabled}
                {...props}
                className={`input_label__input ${props?.className && props.className}`}
                onChange={event => {
                    props?.onLocalChange && props.onLocalChange(event) || (
                        props?.onChange && props.onChange(event)
                    );
                }}
            />
        </label>
    )
}