import React, { useRef, useState } from "react";
import { Button, Input } from "@/components";
import { FormProvider, useForm } from "react-hook-form";
import { useNotify } from "@/hooks";
import { useTranslation } from "react-i18next";
import { apiInstance } from "@/api";

const length: number = 6; // Code default length

const Code: React.FC<{
	/** Submit event */
	onSubmit: (data: Record<string, any>) => void;
	/** Cancel event */
	onCancel: () => void;
}> = ({
	onSubmit,
	onCancel
}) => {
	const [isLoading, setLoading] = useState<boolean>(false);
	const inputRefs = useRef([]);
	const methods = useForm();
	const { notify } = useNotify();
	const { t } = useTranslation();

	const handleSubmit = async ({
		code,
	}: {
		code: string[];
	}) => {
		try {
			setLoading(true);

			const response = await apiInstance.post("/codes", {
				code: code.join(""),
			});

			onSubmit && onSubmit(response);
		} catch (err) {
			notify(t(`codes.${err?.message}`), "error");
			handleClear();
			onCancel && onCancel();
		} finally {
			setLoading(false);
		}
	};

	const handleClear = () => {
		for (let i = 0; i < length; i++)
			methods.setValue(`code.${i}`, "");
		setTimeout(() => {
			inputRefs?.current?.[0]?.focus();
			inputRefs?.current?.[0]?.select();
		}, 0);
	};

	const handlePaste = (
		e: React.ClipboardEvent<HTMLInputElement>,
	) => {
		e.preventDefault();

		const pastedData = e?.clipboardData
			?.getData("text")
			?.trim();
		const digits =
			pastedData.match(/\d/g)?.slice(0, length) || [];

		if (digits.length === 0) return;

		digits.forEach((digit, idx) => {
			if (idx < length)
				methods.setValue(`code.${idx}`, digit);
		});
		const focusIndex = Math.min(
			digits.length - 1,
			length - 1,
		);

		setTimeout(() => {
			inputRefs?.current?.[focusIndex]?.focus();
			inputRefs?.current?.[focusIndex]?.select();
		}, 0);

		if (digits.length === 6)
			methods.handleSubmit(handleSubmit)();
	};


	const inputs = methods.watch("code");

	return (
		<FormProvider {...methods}>
			<form
				onSubmit={methods.handleSubmit(handleSubmit)}
				className="flex flex-col gap-4 items-center"
			>
				<p className="text-title">{t("codes.title")}</p>
				<p className="text-default">
					{t("codes.description")}
				</p>
				<div className="flex flex-row gap-4 items-center w-full">
					{Array.from({ length }, (_: any, i: number) => (
						<Input
							{...methods.register(`code.${i}`)}
							disabled={isLoading}
							key={i}
							inputMode="numberic"
							pattern="[0-9]*"
							maxLength={1}
							ref={(elem: HTMLInputElement) => {
								inputRefs.current[i] = elem;
								methods.register(`code.${i}`).ref(elem);
							}}
							onFocus={(
								elem: React.FocusEvent<HTMLInputElement>,
							) => elem.target.select()}
							onPaste={(
								elem: React.ClipboardEvent<HTMLInputElement>,
							) => {
								if (i) return;

								handlePaste(elem);
							}}
							onKeyDown={(
								elem: React.KeyboardEvent<HTMLInputElement>,
							) => {
								if (
									elem.key == "Backspace" &&
									i &&
									!elem.currentTarget.value
								) {
									elem.preventDefault();
									inputRefs?.current?.[i - 1]?.focus();
								}
							}}
							onChange={(
								elem: React.ChangeEvent<HTMLInputElement>,
							) => {
								const value = String(
									elem.currentTarget.value || "",
								);

								methods.setValue(`code.${i}`, value);

								if (!value) return;

								
								if (i < length - 1)
									setTimeout(
										() =>
											inputRefs?.current?.[i + 1]?.focus(),
										0,
									);
							}}
						/>
					))}
				</div>
				<div className="w-full gap-4 flex justify-end items-center">
					<Button
						variant="second"
						onClick={(
							elem: React.MouseEvent<HTMLButtonElement>,
						) => {
							elem.preventDefault();
							onCancel && onCancel();
						}}
						disabled={isLoading}
					>
						{t("buttons.back")}
					</Button>
					<Button
						variant="primary"
						htmlType="submit"
						disabled={isLoading || inputs?.join("")?.length < 6}
						key="code-ok"
					>
						{t("buttons.ok")}
					</Button>
				</div>
			</form>
		</FormProvider>
	);
};

export default Code;