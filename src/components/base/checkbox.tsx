const Checkbox: React.FC<{
	/** Name */
	name: string;
	/** Help title */
	placeholder?: string;
	/** Change event */
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
	/** Link to original checkbox */
	ref?: React.Ref<HTMLInputElement>;
}> = ({ name, placeholder, onChange, ref }) => (
	<label className="w-fit inline-flex flex-row gap-2 items-center has-checked:text-primary cursor-pointer text-text">
		<div className="flex justify-center items-center border border-br rounded-full w-6 h-6 overflow-hidden has-checked:border-primary">
			<input
				type="checkbox"
				name={name}
				ref={ref}
				onChange={onChange}
				className="w-[70%] h-[70%] appearance-none rounded-full checked:bg-primary cursor-pointer"
			/>
		</div>
		<p className="text-placeholder select-none">
			{placeholder}
		</p>
	</label>
);

export default Checkbox;
