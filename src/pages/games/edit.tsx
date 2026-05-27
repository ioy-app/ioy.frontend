import confStatus from "../dashboard/configs/status.json";
import {
	games_create,
	games_delete,
	games_details,
	games_edit,
} from "@/api/games";
import {
	Button,
	Checkbox,
	Code,
	Game,
	Input,
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
	useForm
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { BiChevronsLeft, BiChevronsRight, BiX } from "react-icons/bi";
import { Navigate, NavLink, useNavigate, useParams } from "react-router-dom";
import Uploader from "./uploader";
import JamBlock from "./jam";
import { useMutation, useQuery } from "@tanstack/react-query";
import { jams_details } from "@/api/jams";
import { UserProps } from "@/types";

export default function Edit() {
	const params = useParams();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { notify } = useNotify();
	const { modal } = useModal();

	const isCreate: boolean = Boolean(
		typeof params.id == "undefined",
	);
	const id = Number(params?.id);
	const status = confStatus
		.filter((record) => record.value != "all")
		.map((record) => ({
			...record,
			label: t(record.label),
		}));

	const methods = useForm();

	// Get jamdata:
	const jam_id = (params?.jam_id && Number(params.jam_id)) || methods?.watch("jam_id");
	const queryJam = useQuery({
		queryKey: [ "jam", jam_id ],
		enabled: Boolean(jam_id > 0),
		queryFn: async () => {
			const response = await jams_details(jam_id);
			return response;
		}
	});
	
	// Submit:
	const submit = useMutation({
		mutationKey: [ "game_edit", isCreate, id ],
		mutationFn: async (data) => {
			const icon = data?.icon?.[0];
			if (icon) {
				if (icon?.type != "image/png")
					throw new Error("games.errors.icon_type");
				if (icon?.size >= 1024 * 1024)
					throw new Error("games.errors.icon_limit");
			}

			const title = data?.title;
			const version = data?.version;
			const description = data?.description;
			const status: "draft" | "public" = !jam_id ? data?.status : "public";
			const authors = data?.authors_data?.map?.((user: UserProps) => Number(user?.id)) || [];
			const tags = data?.tags || [];
			const game = data?.game;
			const is_background = data?.is_background;

			const props = {
				title,
				version,
				description,
				status,
				authors,
				tags,
				game,
				icon,
				jam_id,
				is_background
			}
			if (isCreate)
				return (await games_create(props));
			
			return (await games_edit(id, props));
		},
		onError: (err: string) => notify(t(err?.message?.toString?.() || err)),
		onSuccess: (data) => {
			notify(t("notify.save"));
			if (isCreate)
				return navigate(paths.games.details(data?.id));

			query && query?.refetch?.();
		}
	});

	const handleVerify = async () => {
		notify(t("notify.deleted.game"), "success");
		navigate(-1, { replace: true });
	};

	const handleDelete = async () => {
		modal(
			t("games.modals.delete", {
				title,
			}),
			(onClose: () => void) => (
				<>
					<Button
						variant="clear"
						onClick={() => onClose()}
					>
						{t("buttons.cancel")}
					</Button>
					<Button
						variant="danger"
						onClick={async (e) => {

							try {
								const response = await games_delete(
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
							}
						}}
					>
						{t("buttons.delete")}
					</Button>
				</>
			),
		);
	};

	const icon = methods.watch("icon");
	const handlePreviewIcon = useMemo(() => {
		if (icon && icon.length > 0)
			return URL.createObjectURL(icon[0]);

		return null;
	}, [ icon ]);

	const refPreviewIcon = useRef<string | null>(null);
	useEffect(() => {
		if (refPreviewIcon.current)
			URL.revokeObjectURL(refPreviewIcon.current);

		refPreviewIcon.current = handlePreviewIcon;
	}, [ refPreviewIcon ]);

	const title = methods.watch("title");
	const tags = methods.watch("tags") || [];
	const is_avatar = methods.watch("is_avatar") || false;
	const authors_data = methods.watch("authors_data");

	// Game details:
	const query = useQuery({
		queryKey: [ "game", id, "edit" ],
		enabled: !isCreate,
		queryFn: async () => {
			const response = await games_details(id);
			for (const [key, value] of Object.entries(response))
				methods.setValue(key, value);

			return response;
		}
	});

	if (query.isPending && query?.isEnabled)
		return <Spin loading />;

	if (query?.isError)
		return <Navigate to="/" />;

	return (
		<FormProvider {...methods}>
			<form
				onSubmit={methods.handleSubmit((data) => submit.mutate(data))}
				style={{
					display: "flex",
					justifyContent: "center",
				}}
				className="w-full"
			>
				<div className="w-[65%] max-lg:w-full flex flex-col gap-4 items-start">
					<div className="w-full flex flex-col gap-2 items-start mb-8">
						<div className="flex w-full items-center justify-between gap-4">
							<Button
								variant="text"
								onClick={() => navigate(-1)}
								disabled={submit.isPending}
							>
								<BiChevronsLeft />
								{t("buttons.back")}
							</Button>
							<p className="text-default">
								{isCreate
									? t("games.titles.create")
									: t("games.titles.edit", { title: query?.data?.title })}
							</p>
							{!isCreate && (
								<Button
									variant="text"
									onClick={() => navigate(paths.games.details(id))}
									disabled={submit.isPending}
								>
									{t("buttons.play")}
									<BiChevronsRight />
								</Button>
							)}
						</div>
					</div>
					{!queryJam?.isPending && (
						<JamBlock
							data={{
								...queryJam.data,
								is_vote: false
							}}
						/>
					)}
					<div className="w-full flex gap-4 justify-between items-start">
						<div className="flex justify-center">
							<label className="flex flex-col justify-center gap-4 items-center p-4 border-4 border-dotted border-br rounded-2xl cursor-pointer">
								<div className="w-32 h-32">
									<Game
										dataSource={
											{
												id,
												is_avatar: handlePreviewIcon || is_avatar
											} as GameProps
										}
										size="full"
										preview={handlePreviewIcon}
										nolink
									/>
								</div>
								<div className="flex flex-col text-center">
									<p className="text-placeholder">
										{t("games.labels.icon")}
									</p>
									<p className="text-placeholder text-text/50">
										{t("games.labels.icon_limit")}
									</p>
								</div>
								<input
									type="file"
									accept="image/*"
									{...methods.register("icon")}
									className="hidden"
									disabled={submit.isPending}
								/>
							</label>
						</div>
						<div className="w-full flex flex-col gap-4">
							<Input
								placeholder={t("games.placeholders.title")}
								label={t("games.labels.title")}
								{...methods.register("title")}
								disabled={submit.isPending}
							/>
							<Input
								placeholder={t("games.placeholders.version")}
								label={t("games.labels.version")}
								{...methods.register("version")}
								disabled={submit.isPending}
							/>
							<Textarea
								placeholder={t(
									"games.placeholders.description",
								)}
								label={t("games.labels.description")}
								{...methods.register("description")}
								disabled={submit.isPending}
							/>
						</div>
					</div>
					<div className="flex w-full flex-col gap-4">
						<Input
							name="tags"
							placeholder={t("games.placeholders.tags")}
							label={t("games.labels.tags")}
							onKeyPress={(e) => {
								if (e.key == "Enter" || e.key == ",") {
									if (e.target.value.trim()) {
										tags.push(e.target.value);
										e.target.value = "";
										methods.setValue("tags", tags);
									}
									e.preventDefault();
								}
							}}
							disabled={submit.isPending}
						/>
						<div
							className="flex flex-row gap-4 flex-wrap"
							key={tags}
						>
							{(tags || [])?.map((tag: string, i: number) => (
								<span
									className="pr-2 border border-br rounded-xl cursor-pointer flex gap-2 items-center"
									onClick={() => {
										methods.setValue(
											"tags",
											tags.filter(
												(t: string) => t != tag,
											),
										);
									}}
									key={i}
								>
									<Tag title={tag} />
									<BiX className="text-2xl" />
								</span>
							))}
						</div>
					</div>

					<SelectUser
						name="authors"
						placeholder={t("games.placeholders.authors")}
						label={t("games.labels.authors")}
						initial={authors_data}
						{...methods}
						disabled={submit.isPending}
					/>
					<Uploader
						onChange={(files, total_size) => {
							methods.setValue("game", files);
						}}
						disabled={submit.isPending}
					/>
					<div className="flex gap-4 items-center justify-between w-full flex-wrap">
						<div className="flex gap-4 items-center">
							{!jam_id && (
								<Select
									options={status}
									value={status?.[1]}
									{...methods.register("status")}
									align="top"
									disabled={submit.isPending}
								/>
							)}
							<Checkbox
								{...methods.register("is_background")}
								placeholder={t("games.placeholders.is_background")}
								disabled={submit.isPending}
							/>
						</div>
						<Button
							variant="primary"
							htmlType="submit"
							disabled={submit.isPending}
							className="max-md:w-full"
						>
							{t("buttons.save")}
						</Button>
					</div>
					{!isCreate && (
						<div className="w-full mt-25 mb-5 flex flex-col">
							<Button
								variant="danger"
								htmlType="button"
								onClick={(e) => {
									e.preventDefault();
									handleDelete();
								}}
								disabled={submit.isPending}
								className="max-md:w-full"
							>
								{t("buttons.delete")}
							</Button>
						</div>
					)}
				</div>
			</form>
		</FormProvider>
	);
}