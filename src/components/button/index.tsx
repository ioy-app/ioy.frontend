import React from "react";
import "./styles.less";

const Button: React.FC = ({
    children,
    disabled,
    htmlType,
    onClick,
    type="default"
} : {
    /** Содержимое кнопки */
    children: string | React.ReactElement;
    /** Отключение */
    disabled?: boolean;
    /** Тип кнопки внутри формы */
    htmlType?: "submit" | "reset" | "button";
    /** Событие нажатия на кнопку */
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    /** Стиль кнопки  */
    type?: "default" | "primary" | "second" | "danger" | "clear";
}) => (
    <button
        className={`button ${type}`}
        disabled={disabled}
        onClick={onClick}
        type={htmlType}
    >
        {children}
    </button>
);

export default Button;