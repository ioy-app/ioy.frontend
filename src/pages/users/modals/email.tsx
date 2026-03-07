import { users_edit_email } from "@/api/routes/users";
import { Button, Code, Input } from "@/components";
import { useNotify } from "@/hooks";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

const Email: React.FC<{
	onClose;
}> = ({ onClose }) => {
	const { t } = useTranslation();
	const { register, handleSubmit } = useForm();
	const [isLoading, setLoading] = useState<boolean>(false);
	const [isCodeForm, setCodeForm] = useState<boolean>(false);
	const { notify } = useNotify();

	const submit = async (fd: FormData) => {
		try {
			setLoading(true);
			await users_edit_email(fd?.current_email, fd?.email);
			setCodeForm(true);
		} catch (err) {
			notify(err?.message?.toString(), "error");
		} finally {
			setLoading(false);
		}
	};

	if (isCodeForm)
		return (
			<Code
				onSubmit={() => {
					onClose && onClose();
					notify("notify.save", "success");
				}}
				onCancel={() => setCodeForm(false)}
			/>
		);

	return (
		<form
			onSubmit={handleSubmit(submit)}
			className="flex flex-col gap-4 flex-1 h-full justify-between"
		>
			<div className="flex flex-col gap-4">
				<p className="text-default">{t("profile.titles.email")}</p>
				<Input
					placeholder={t("profile.placeholders.current_email")}
					label={t("profile.labels.current_email")}
					{...register("current_email")}
				/>
				<Input
					placeholder={t("profile.placeholders.email")}
					label={t("profile.labels.email")}
					{...register("email")}
				/>
			</div>
			<div className="flex w-full items-center justify-end">
				<Button variant="primary" htmlType="submit">
					{t("buttons.edit")}
				</Button>
			</div>
		</form>
	);
};

export default Email;
