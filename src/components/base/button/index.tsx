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
    /** Стили */
    className?: string;
}

const Button: React.FC<ButtonProps> = ({
    children,
    disabled,
    htmlType="button",
    onClick,
    type="default",
    className
}) => (
    <button
        className={`button ${type} ${className} gap-2`}
        disabled={disabled}
        onClick={onClick}
        type={htmlType}
    >
        {children}
    </button>
);

export default Button;