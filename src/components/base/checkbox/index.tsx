import React from "react";
import "./styles.less";

const Checkbox: React.FC = ({
    name,
    placeholder,
    onChange,
    ref
} : {
    /** Имя чекбокса */
    name: string;
    /** Подсказка */
    placeholder?: string;
    /** Событие изменения чекбокса */
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    /** Ссылка на чекбокс */
    ref?: React.Ref<HTMLInputElement>;
}) => (
    <label className="checkbox">
        <input
            type="checkbox"
            name={name}
            ref={ref}
            onChange={onChange}
        />
        <p>{placeholder}</p>
    </label>
);

export default Checkbox;