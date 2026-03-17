import { profile_logout } from "@/api/routes/profile";
import {
	users_delete,
	users_games,
} from "@/api/routes/users";
import { Button, Code, Spin } from "@/components";
import { useNotify } from "@/hooks";
import { StoreProps } from "@/stories";
import { clearLogin } from "@/stories/login";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

const Delete: React.FC<{
	onClose: () => void;
}> = ({ onClose }) => {
	const { handleSubmit } = useForm();
	const [isCodeForm, setCodeForm] =
		useState<boolean>(false);
	const [isLoading, setLoading] = useState<boolean>(false);
	const { t } = useTranslation();
	const { login } = useSelector(
		(state: StoreProps) => state.login,
	);
	const { notify } = useNotify();
	const dispatch = useDispatch();

	const submit = async () => {
		try {
			setLoading(true);
			await users_delete();
			setCodeForm(true);
		} catch (err) {
			notify(err?.message?.toString(), "error");
		} finally {
			setLoading(false);
		}
	};
	const handleLogout = async () => {
		await profile_logout();
		dispatch(clearLogin());
		onClose && onClose();
		notify(t("notify.deleted.user"), "success");
	};

	const query = useQuery({
		queryKey: ["delete", "account", login],
		queryFn: async () => users_games(login),
	});

	if (isCodeForm)
		return (
			<Code
				onSubmit={() => handleLogout()}
				onCancel={() => setCodeForm(false)}
			/>
		);

	return (
		<form
			onSubmit={handleSubmit(submit)}
			className="flex flex-col gap-4 flex-1 h-full justify-between"
		>
			<Spin loading={query?.status == "pending"}>
				<div className="flex flex-col gap-4">
					<p className="text-default">
						{t("profile.titles.delete")}
					</p>
					<div className="border border-danger text-danger rounded-xl p-4 text-default">
						<p>{t("profile.delete.title")}</p>
						<ul className="list-disc pl-4">
							<li className="font-medium">
								{t("profile.delete.second")}
							</li>
							<li>
								{t("profile.delete.games", {
									count: query?.data?.total,
								})}
							</li>
							<li>{t("profile.delete.third")}</li>
						</ul>
					</div>
					<div className="flex w-full items-center justify-end">
						<Button
							variant="danger"
							htmlType="submit"
							disabled={
								isLoading || query?.status == "pending"
							}
						>
							{t("buttons.delete")}
						</Button>
					</div>
				</div>
			</Spin>
		</form>
	);
};

export default Delete;
