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
    <label className="w-fit inline-flex flex-row gap-2 items-center has-checked:text-primary cursor-pointer">
        <div className="flex justify-center items-center border border-gray-200 rounded-full w-6 h-6 overflow-hidden has-checked:border-primary">
            <input
                type="checkbox"
                name={name}
                ref={ref}
                onChange={onChange}
                className="w-[70%] h-[70%] appearance-none rounded-full checked:bg-primary cursor-pointer"
            />
        </div>
        <p className="text-placeholder select-none">{placeholder}</p>
    </label>
);

export default Checkbox;