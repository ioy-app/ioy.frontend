import React, { MouseEventHandler, ReactNode } from "react";
import "./styles.less";

export default function Button({
    children,
    type="default",
    disabled,
    onClick
}: {
    children: ReactNode;
    type?: string;
    disabled?: boolean;
    onClick?: MouseEventHandler<HTMLButtonElement>;
}) {
    return (
        <button
            className={`button ${type || "default"}`}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    )
}