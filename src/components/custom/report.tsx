import { useNotify } from "@/hooks";
import Textarea from "../base/textarea";
import { useTranslation } from "react-i18next";
import Button from "../base/button";
import { FormProvider, useForm } from "react-hook-form";
import { reports_create } from "@/api/reports";
import { useState } from "react";

/**
 * Report form
 * @example
 * return <Report />
 */
const Report: React.FC<{
	target_id: number;
	type: "game" | "user" | "jam" | "comment" | "picture";
	Instance: React.ReactNode;
	onClose: () => void;
}> = ({ target_id, type, Instance, onClose }) => {
	const [isLoading, setLoading] = useState<boolean>(false);
	const { notify } = useNotify();
	const { t } = useTranslation();

	const methods = useForm();
	const handleSubmit = async (data) => {
		try {
			setLoading(true);
			await reports_create(
				target_id,
				type,
				data?.message,
			);
			notify(t("report.success"), "success");
			onClose && onClose();
		} catch (err) {
			methods.setError("callback", err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<FormProvider {...methods}>
			<form
				className="flex flex-col gap-4 w-full"
				onSubmit={methods.handleSubmit(handleSubmit)}
			>
				<div className="flex flex-col gap-2 w-full items-center">
					<p className="text-title">{t("report.title")}</p>
					<div className="py-4 flex flex-col gap-4 items-center justify-center w-full">
						{Instance && Instance}
					</div>
					<Textarea
						placeholder={t("report.placeholders.message")}
						label={t("report.labels.message")}
						disabled={isLoading}
						{...methods.register("message")}
						onLocalChange={() =>
							methods.clearErrors("callback")
						}
					/>
				</div>
				<div className="flex w-full pt-4 justify-end items-center gap-4">
					{methods.formState.errors.callback?.message && (
						<p className="text-danger text-placeholder">
							{t(
								`report.${methods.formState.errors.callback?.message}`,
							)}
						</p>
					)}
					<Button
						onClick={() => onClose()}
						disabled={isLoading}
					>
						{t("buttons.cancel")}
					</Button>
					<Button
						variant="primary"
						htmlType="submit"
						disabled={isLoading}
					>
						{t("buttons.ok")}
					</Button>
				</div>
			</form>
		</FormProvider>
	);
};

export default Report;
