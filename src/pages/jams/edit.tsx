import { jams_create, jams_delete, jams_details, jams_edit } from "@/api/routes/jams";
import {
	Button,
	Code,
	DatePicker,
	Game,
	Input,
	Jam,
	Select,
	SelectUser,
	Spin,
	Tag,
	Textarea,
} from "@/components";
import { useModal, useNotify } from "@/hooks";
import { paths } from "@/routes";
import GameProps from "@/types/game";
import {
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import {
	FormProvider,
	useForm,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { BiChevronsLeft, BiX } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";

export default function JamEdit() {
	const params = useParams();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [isLoading, setLoading] = useState<boolean>(true);
	const { notify } = useNotify();
	const { modal } = useModal();

	const isCreate: boolean = Boolean(
		typeof params.id == "undefined",
	);

	const methods = useForm();
	const handleSubmit = async (data: FormData) => {
		try {
			setLoading(true);
			const isCreate = typeof params?.id == "undefined";
			let response;

			if (isCreate) {
				response = await jams_create({
					...data,
					icon: data?.icon?.[0]
				});
			} else {
				response = await jams_edit(params?.id, {
					...data,
					icon: data?.icon?.[0]
				});
			}

			if (isCreate && response?.id)
				navigate(paths.jams.details(response.id));
		}
		catch (err) { notify(t(err?.message?.toString?.())); }
		finally { setLoading(false); }
	};

	const handleVerify = async () => {
		notify(t("jams.notify.delete_success"), "success");
		navigate(-1, { replace: true });
	};

	const handleDelete = async () => {
		modal(
			t("jams.warnings.delete"),
			(onClose: () => void) => (
				<>
					<Button
						variant="clear"
						onClick={() => onClose()}
						disabled={isLoading}
					>
						{t("buttons.cancel")}
					</Button>
					<Button
						variant="danger"
						disabled={isLoading}
						onClick={async (e) => {
							setLoading(true);

							try {
								const response = await jams_delete(
									Number(params.id),
								);
								onClose();

								modal("", (onClosed: () => void) => (
									<Code
										onSubmit={(data) => {
											handleVerify(data);
											onClosed();
										}}
										onCancel={() => onClosed()}
									/>
								));
							} finally {
								setLoading(false);
							}
						}}
					>
						{t("buttons.delete")}
					</Button>
				</>
			),
		);
	};

	useEffect(() => {
		(async () => {
			try {
				setLoading(true);

				if (!isCreate) {
					const id: number = Number(params.id);
					const response = await jams_details(id);

					for (const [key, value] of Object.entries(
						response,
					))
						methods.setValue(key, value);
				}
			} catch (err) {
				notify(t("errors.exists"), "error");
				navigate("/", {
					replace: true,
				});
			} finally {
				setLoading(false);
			}
		})();
	}, [ params?.id ]);

	const icon = methods.watch("icon");

	const handlePreviewIcon = useMemo(() => {
		if (icon && icon.length > 0)
			return URL.createObjectURL(icon[0]);

		return null;
	}, [icon]);

	const refPreviewIcon = useRef<string | null>(null);

	useEffect(() => {
		if (refPreviewIcon.current)
			URL.revokeObjectURL(refPreviewIcon.current);

		refPreviewIcon.current = handlePreviewIcon;
	}, [ refPreviewIcon ]);

	const title = methods.watch("title");
	const id = methods.watch("id");
	const nominations = methods.watch("nominations") || [];
	const judges_data = methods.watch("judges_data");

	const date_started = methods.watch("date_started");
	const date_finished = methods.watch("date_finished");
	const date_vote_started = methods.watch("date_vote_started");
	const date_vote_finished = methods.watch("date_vote_finished");
	const is_avatar = methods.watch("is_avatar");

	return (
		<FormProvider {...methods}>
			<Spin loading={isLoading}>
				<form
					onSubmit={methods.handleSubmit(handleSubmit)}
					style={{
						display: "flex",
						justifyContent: "center",
					}}
					className="w-full"
				>
					<div className="w-[65%] max-lg:w-full flex flex-col gap-4 items-start">
						<div className="w-full flex flex-col gap-2 items-start mb-8">
							<Button
								variant="text"
								onClick={() => navigate(-1)}
							>
								<BiChevronsLeft />
								{t("buttons.back")}
							</Button>
							<p className="text-title">
								{isCreate
									? t("jams.titles.create")
									: t("jams.titles.edit", { title })}
							</p>
						</div>
						<div className="flex w-full justify-center">
							<label className="flex flex-col justify-center gap-4 items-center p-4 border-4 border-dotted border-br rounded-2xl cursor-pointer">
								<div className="w-32 h-32">
									<Jam
										dataSource={
											{
												id,
												is_avatar:
													is_avatar || handlePreviewIcon,
											} as GameProps
										}
										size="full"
										preview={handlePreviewIcon}
										nolink
									/>
								</div>
								<p className="text-placeholder">
									{t("jams.labels.icon")}
								</p>
								<input
									type="file"
									accept="image/*"
									{...methods.register("icon")}
									className="hidden"
								/>
							</label>
						</div>
						<Input
							placeholder={t("jams.placeholders.title")}
							label={t("jams.labels.title")}
							{...methods.register("title")}
						/>
						<Input
							placeholder={t("jams.placeholders.theme")}
							label={t("jams.labels.theme")}
							{...methods.register("theme")}
						/>
						<Textarea
							placeholder={t(
								"jams.placeholders.description",
							)}
							label={t("jams.labels.description")}
							{...methods.register("description")}
						/>
						<div className="flex w-full flex-col gap-4">
							<Input
								name="nominations"
								placeholder={t("jams.placeholders.nominations")}
								label={t("jams.labels.nominations")}
								onKeyPress={(e) => {
									if (e.key == "Enter" || e.key == ",") {
										if (e.target.value.trim()) {
											nominations.push(e.target.value);
											e.target.value = "";
											methods.setValue("nominations", nominations);
										}
										e.preventDefault();
									}
								}}
							/>
							<div className="flex flex-row gap-4 flex-wrap">
								{nominations?.map((tag: string, i: number) => (
									<span
										className="pr-2 border border-br rounded-xl cursor-pointer flex gap-2 items-center"
										onClick={() => {
											methods.setValue(
												"nominations",
												nominations.filter(
													(t: string) => t != tag,
												),
											);
										}}
									>
										<Tag title={tag} key={i} />
										<BiX className="text-2xl" />
									</span>
								))}
							</div>
						</div>
						<SelectUser
							name="judges"
							placeholder={t("jams.placeholders.judges")}
							label={t("jams.labels.judges")}
							initial={judges_data}
							{...methods}
						/>
						<div className="flex flex-col gap-2 text-placeholder">
							<p>{t("jams.labels.date_range")}</p>
							<div className="flex items-center gap-2">
								<DatePicker
									{...methods.register("date_started")}
									hasTime
								/>
								<p>—</p>
								<DatePicker
									{...methods.register("date_finished")}
									hasTime
								/>
							</div>
						</div>
						<div className="flex flex-col gap-2 text-placeholder">
							<p>{t("jams.labels.vote_started")}</p>
							<div className="flex items-center gap-2">
								<DatePicker
									{...methods.register("date_vote_started")}
									hasTime
								/>
							</div>
						</div>
						<div className="flex gap-4 items-center justify-between w-full">
							<Select
								placeholder={t("jams.labels.vote_type.title")}
								options={[
									{
										label: t("jams.labels.vote_type.all"),
										value: "all"
									},
									{
										label: t("jams.labels.vote_type.judges"),
										value: "judges"
									},
									{
										label: t("jams.labels.vote_type.members"),
										value: "members"
									}
								]}
								align="top"
								{...methods.register("vote_type")}
							/>
							<Button variant="primary" htmlType="submit">
								{t("buttons.save")}
							</Button>
						</div>
						{!isCreate && (
							<div className="w-full mt-20 mb-5 flex flex-col">
								<Button
									variant="danger"
									htmlType="button"
									onClick={(e) => {
										e.preventDefault();
										handleDelete();
									}}
								>
									{t("buttons.delete")}
								</Button>
							</div>
						)}
					</div>
				</form>
			</Spin>
		</FormProvider>
	);
}
