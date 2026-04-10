import {
	games_details,
	games_like,
	games_subscribe,
} from "@/api/routes/games";
import {
	Button,
	Game,
	Jam,
	LinkifyText,
	Meta,
	Player,
	Report,
	Spin,
	Tag,
	Textarea,
	User,
} from "@/components";
import GameProps from "@/types/game";
import { useModal, useNotify } from "@/hooks";
import { UserProps } from "@/types";
import {
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import {
	BiBookmark,
	BiChevronsLeft,
	BiCopyAlt,
	BiEdit,
	BiFullscreen,
	BiHeart,
	BiMessageError,
	BiShare,
} from "react-icons/bi";
import {
	NavLink,
	useNavigate,
	useParams,
} from "react-router-dom";
import Comments from "./comments";
import Popup from "@/components/base/popup";
import { paths } from "@/routes";
import { useSelector } from "react-redux";
import { StoreProps } from "@/stories";
import Auth from "../auth";
import { useRef } from "react";
import { Routes } from "@/api";
import JamBlock from "./jam";

export default function GamePage() {
	const params = useParams();
	const id = params?.id;
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { notify } = useNotify();
	const { modal } = useModal();
	const queryClient = useQueryClient();
	const { token } = useSelector(
		(state: StoreProps) => state.login,
	);
	const gameRef = useRef(null);

	const query = useQuery({
		queryKey: ["games", id],
		queryFn: async () => {
			const response = await games_details(Number(id));
			return response;
		},
	});

	const like = useMutation({
		mutationFn: async () => {
			if (!token) {
				modal(Auth, () => <></>);
				return false;
			}
			const response = await games_like(Number(id));
			return response;
		},
		onError: (err) => notify(t(err?.message?.toString()), "error"),
		onSuccess: (data) => {
			if (!data) return;
			const is_like = data?.status == "liked";
			notify(
				t(`notify.${is_like ? "like" : "unlike"}`),
				is_like ? "success" : "warning",
			);
			queryClient.setQueryData(
				["games", id],
				(current: GameProps) => ({
					...current,
					is_like,
				}),
			);
		},
	});

	const subscribe = useMutation({
		mutationFn: async () => {
			if (!token) {
				modal(Auth, () => <></>);
				return false;
			}

			const response = await games_subscribe(Number(id));
			return response;
		},
		onError: (err) => notify(t(err?.message?.toString()), "error"),
		onSuccess: (data) => {
			if (!data) return;
			const is_subscribe = data?.status == "created";
			notify(
				t(
					`notify.${is_subscribe ? "subscribe" : "unsubscribe"}`,
				),
				is_subscribe ? "success" : "warning",
			);
			queryClient.setQueryData(
				["games", id],
				(current: GameProps) => ({
					...current,
					is_subscribe,
				}),
			);
		},
	});

	const repost = () => {
		const url = window.location.href;
		modal(
			() => (
				<div className="flex flex-col gap-2 w-full items-center">
					<Game
						dataSource={
							{
								id,
								is_avatar: query?.data?.is_avatar,
							} as any
						}
						nolink
					/>
					<p className="text-title">{query?.data?.title}</p>
					<p className="text-default max-w-xl line-clamp-2 text-center ...">
						{query?.data?.description}
					</p>
					<p className="w-full text-placeholder">
						{t("games.labels.share")}
					</p>
					<div className="text-default p-4 w-full rounded-xl border border-br flex flex-row gap-4 justify-between items-center text-text">
						<p>{url}</p>
						<BiCopyAlt />
					</div>
				</div>
			),
			(onClose) => (
				<div className="flex w-full pt-4 justify-end items-center">
					<Button
						variant="primary"
						onClick={() => onClose()}
					>
						{t("buttons.ok")}
					</Button>
				</div>
			),
		);
	};

	const report = () =>
		modal(
			() => <></>,
			(onClose) => (
				<Report
					type="game"
					target_id={query?.data?.id}
					Instance={
						<>
							<Game
								dataSource={
									{
										id: Number(id),
										is_avatar: query?.data?.is_avatar,
									} as any
								}
								nolink
							/>
							<h1 className="text-title">
								{query?.data?.title}
							</h1>
						</>
					}
					onClose={onClose}
				/>
			),
		);

	return (
		<>
			<Meta
				title={query?.data?.title}
				description={query?.data?.description}
				url={paths.games.details(id)}
				keywords={query?.data?.tags?.join(",")}
				favicon={`/api/v1${Routes.games.icon(id)}`}
				author={query?.data?.authors_data?.map(author => author?.login)?.join(", ")}
			/>
			<Spin loading={query?.status == "pending"} key={id}>
				<div className="w-full flex flex-col gap-4 items-center">
					<div className="w-[65%] max-lg:w-full flex flex-col gap-4 items-start">
						<Button
							variant="text"
							onClick={() => navigate(-1)}
						>
							<BiChevronsLeft />
							{t("buttons.back")}
						</Button>
						<div className="flex gap-4 items-center h-12">
							<Game
								dataSource={
									{
										id: Number(id),
										is_avatar: query?.data?.is_avatar,
									} as any
								}
								size={12}
								nolink
							/>
							<h1 className="text-title">
								{query?.data?.title}
							</h1>
							{query?.data?.version && (
								<span className="border px-4 py-1 font-light font-roboto rounded-xl border-gray-200">
									{query?.data?.version}
								</span>
							)}
						</div>
						<Player
							gameId={Number(id)}
							ref={gameRef}
						/>
						<div className="flex gap-4 w-full justify-between items-center">
							<div className="flex gap-4 items-center">
								<Popup
									align="b"
									label={t(
										query?.data?.is_like
											? "helps.unlike"
											: "helps.like",
									)}
								>
									<Button
										variant={
											(query?.data?.is_like && "second") ||
											"default"
										}
										onClick={() => like.mutate()}
										disabled={like.isPending}
										loading={like.isPending}
									>
										<BiHeart />
									</Button>
								</Popup>
								<Popup
									align="b"
									label={t(
										query?.data?.is_subscribe
											? "helps.unsubscribe"
											: "helps.subscribe",
									)}
								>
									<Button
										variant={
											(query?.data?.is_subscribe &&
												"second") ||
											"default"
										}
										onClick={() => subscribe.mutate()}
										disabled={subscribe.isPending}
										loading={subscribe.isPending}
									>
										<BiBookmark />
									</Button>
								</Popup>
								<Popup align="b" label={t("helps.share")}>
									<Button onClick={() => repost()}>
										<BiShare />
									</Button>
								</Popup>
								<Popup align="b" label={t("helps.report")}>
									<Button
										variant="default"
										onClick={() => report()}
									>
										<BiMessageError />
									</Button>
								</Popup>
							</div>
							<div className="flex gap-4 items-center">
								<Button
									variant="default"
									onClick={() => {
										if (!gameRef?.current)
											return;

										const elem = gameRef?.current;
										if (elem.requestFullscreen) {
											elem.requestFullscreen();
										} else if (elem.mozRequestFullScreen) {
											elem.mozRequestFullScreen();
										} else if (elem.webkitRequestFullscreen) {
											elem.webkitRequestFullscreen();
										} else if (elem.msRequestFullscreen) {
											elem.msRequestFullscreen();
										}
									}}
								>
									<BiFullscreen />
								</Button>
								{(query?.data?.is_me && (!query?.data?.jamdata || ["init", "in_process"].includes(query?.data?.jamdata?.status))) && (
									<NavLink to={paths.games.edit(id)}>
										<Button variant="second">
											<BiEdit />
											{t("buttons.edit")}
										</Button>
									</NavLink>
								)}
							</div>
						</div>
						{query?.data?.jamdata && (
							<JamBlock
								data={{
									...query?.data?.jamdata,
									is_vote: query?.data?.is_vote
								}}
							/>
						)}
						<div className="flex gap-4 w-full">
							<div className="flex flex-col gap-2 w-full">
								<p className="text-placeholder">
									{t("games.labels.authors")}
								</p>
								<div className="flex flex-col gap-4 w-full border border-br rounded-xl p-4 h-fit">
									{query?.data?.authors_data?.map(
										(author: UserProps, i: number) => (
											<User
												login={author?.login}
												dataSource={author}
												key={i}
												size={12}
												className="flex-row w-fit gap-4"
											/>
										),
									)}
								</div>
							</div>
							{query?.data?.description && (
								<div className="flex flex-col gap-2 w-full">
									<p className="text-placeholder">
										{t("games.labels.description")}
									</p>
									<div className="p-4 border border-br rounded-xl flex flex-col gap-4 w-full">
										<LinkifyText>
											{query?.data?.description}
										</LinkifyText>
										<div className="flex flex-row flex-wrap gap-4">
											{query?.data?.tags?.map(
												(tag: string, i: number) => (
													<Tag title={tag} key={i} />
												),
											)}
										</div>
									</div>
								</div>
							)}
						</div>
						
						<div className="flex flex-col gap-1 w-full items-end text-placeholder">
							<p>
								{dayjs(query?.data?.date_created).format(
									"HH:mm DD.MM.YYYY",
								)}
							</p>
							{query?.data?.date_updated && (
								<p>
									{t("games.labels.edited")}:{" "}
									{dayjs(query?.data?.date_updated).format(
										"HH:mm DD.MM.YYYY",
									)}
								</p>
							)}
						</div>
						{query?.data?.recommendator?.length > 0 && (
							<div className="flex flex-col gap-2 w-full">
								<p className="text-placeholder">
									{t("games.labels.recommends")}
								</p>
								<div className="grid grid-cols-5 max-md:grid-cols-3 gap-4 p-4 border border-br rounded-xl w-full">
									{query?.data?.recommendator?.map(
										(game: GameProps, i: number) => (
											<div>
												<Game
													dataSource={game}
													key={i}
													size="full"
												/>
											</div>
										),
									)}
								</div>
							</div>
						)}
						<Comments />
					</div>
				</div>
			</Spin>
		</>
	);
}
