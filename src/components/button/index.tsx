import React, { MouseEventHandler, ReactNode } from "react";
import "./styles.less";

export default function Button({
    children,
    type="default",
    disabled,
    onClick
}: {
    children: ReactNode;
    type?: "default" | "primary" | "second" | "danger" | "clear";
    disabled?: boolean;
    onClick?: MouseEventHandler<HTMLButtonElement>;
}) {
    return (
        <button
            className={`button ${type}`}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    )
}