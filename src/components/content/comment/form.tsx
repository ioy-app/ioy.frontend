import Button from "@/components/base/button";
import Textarea from "@/components/base/textarea";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { BiCheck, BiLeftArrowAlt, BiX } from "react-icons/bi";

const CommentForm: React.FC<{
	isReply?: boolean;
	onClose?: () => void;
	onOk?: (comment: string) => void;
}> = ({ isReply, onClose, onOk }) => {
	const form = useForm();
	const { t } = useTranslation();

	const submit = (data) => {
		form.setValue("comment", null);
		onOk && onOk(data?.comment);
	};

	const comment = form.watch("comment");

	return (
		<FormProvider {...form}>
			<form
				onSubmit={form.handleSubmit(submit)}
				className="flex flex-col gap-4"
			>
				<Textarea
					{...form.register("comment")}
					placeholder={t("games.placeholders.comment")}
				/>
				<div className="flex gap-4 justify-end w-full">
					{isReply && (
						<Button
							variant="default"
							onClick={(e) => {
								e.preventDefault();
								onClose && onClose();
							}}
						>
							{t("buttons.cancel")}
						</Button>
					)}
					<Button
						variant="primary"
						htmlType="submit"
						disabled={!comment?.length}
					>
						<BiCheck />
					</Button>
				</div>
			</form>
		</FormProvider>
	);
};

export default CommentForm;
