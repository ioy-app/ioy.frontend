import React from "react";
import "./styles.less";

interface ButtonProps {
    /** Содержимое кнопки */
    children: string | React.ReactNode;
    /** Отключение */
    disabled?: boolean;
    /** Тип кнопки внутри формы */
    htmlType?: "submit" | "reset" | "button";
    /** Событие нажатия на кнопку */
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    /** Стиль кнопки  */
    type?: "default" | "primary" | "second" | "danger" | "clear";
}

const Button: React.FC<ButtonProps> = ({
    children,
    disabled,
    htmlType="button",
    onClick,
    type="default"
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