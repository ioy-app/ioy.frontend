import { games_list } from "@/api/routes/games";
import { search } from "@/api/routes/search";
import {
	Button,
	Game,
	Input,
	Pagination,
	Table,
	Tag,
	User,
} from "@/components";
import { paths } from "@/routes";
import GameProps from "@/types/game";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { BiBox, BiChevronsLeft, BiSearch } from "react-icons/bi";
import {
	Link,
	NavLink,
	useNavigate,
	useSearchParams,
} from "react-router";

/**
 * Games pages for home
 * @example
 * return <Games />
 */
const Games: React.FC<{}> = ({}) => {
	const [searchParams, setSearchParams] = useSearchParams();
	const methods = useForm();
	const { t } = useTranslation();

	document.title = t("home.title");

	const {
		isFetching,
		data: { games, tags },
	} = useQuery({
		queryKey: ["home", "games"],
		queryFn: async () => {
			const response = await games_list();
			return response;
		},
		initialData: () => ({
			games: [],
			tags: [],
		}),
	});

	useEffect(() => {
		methods.setValue("search", null);

		if (searchParams.get("search"))
			methods.setValue(
				"search",
				searchParams.get("search"),
			);
		if (searchParams.get("status"))
			methods.setValue(
				"status",
				searchParams.get("status"),
			);
	}, [searchParams]);

	const isSearch = searchParams.get("search");
	const max = 20;
	const current_page = Number(
		searchParams.get("page") || 1,
	);

	const submit = (data) => {
		const us = new URLSearchParams(data);

		if (!data?.search) us.delete("search");

		setSearchParams(us);
	};

	const searchQuery = useQuery({
		queryKey: ["search", searchParams?.toString()],
		queryFn: async () => {
			if (!searchParams.get("search"))
				return {
					items: [],
					total: 0,
				};

			const us = new URLSearchParams();

			us.set("offset", String((current_page - 1) * max));
			us.set("limit", String(max));
			us.set("search", searchParams.get("search"));

			const response = await search(us);
			return response;
		},
		initialData: {
			items: [],
			total: 0,
		},
	});

	return (
		<FormProvider {...methods}>
			<form
				className="col-span-4 flex flex-col gap-4 w-full h-fit"
				onSubmit={methods.handleSubmit(submit)}
			>
				{isSearch && (
					<NavLink to="/" className="w-fit">
						<Button
							variant="text"
							htmlType="button"
						>
							<BiChevronsLeft />
							{t("buttons.back")}
						</Button>
					</NavLink>
				)}
				<div className="flex gap-4">
					<Input
						placeholder={t(
							"home.search.placeholders.search",
						)}
						type="search"
						{...methods.register("search")}
					/>
					<Button variant="primary" htmlType="submit">
						<BiSearch />
					</Button>
				</div>
				{isSearch ? (
					<Table
						columns={[
							{
								title: t("dashboard.table.games.game"),
								dataIndex: "id",
								render: (data, game) => (
									<Link
										to={paths.games.details(game?.id)}
										className="group flex items-center gap-2 w-fit"
									>
										<Game
											dataSource={
												{
													id: game?.id,
													is_avatar: game?.is_avatar,
												} as GameProps
											}
											nolink
											size={12}
										/>
										<p className="text-default group-hover:text-primary transition-colors cursor-pointer">
											{game?.title}
										</p>
									</Link>
								),
							},
							{
								title: t("dashboard.table.games.author"),
								dataIndex: "creater_data",
								render: (data, game) => (
									<Link
										to={paths.users.details(data?.login)}
										className="group flex items-center gap-2 w-fit"
									>
										<User
											login={data.login}
											dataSource={{
												is_avatar: data?.is_avatar,
											}}
											nolink
											size={12}
										/>
										<p className="text-default group-hover:text-primary transition-colors cursor-pointer">
											{data?.login}
										</p>
									</Link>
								),
							},
							{
								title: t("dashboard.table.games.version"),
								dataIndex: "version",
							},
							{
								title: t(
									"dashboard.table.games.date_created",
								),
								dataIndex: "date_created",
								render: (date) =>
									dayjs(date)?.isValid() &&
									dayjs(date).format("HH:mm DD.MM.YYYY"),
							},
							{
								title: t(
									"dashboard.table.games.date_updated",
								),
								dataIndex: "date_updated",
								render: (date) =>
									dayjs(date)?.isValid() &&
									dayjs(date).format("HH:mm DD.MM.YYYY"),
							},
						]}
						data={searchQuery?.data?.items}
						loading={searchQuery?.isPending}
						footer={
							<Pagination
								total={searchQuery?.data?.total || 1}
								current={current_page}
								per_page={max}
								onChange={(offset, page) => {
									searchParams.set("page", String(page));
									setSearchParams(searchParams);
								}}
							/>
						}
						nodata={
							<>
								<BiBox className="text-2xl mt-8" />
								<p className="text-placeholder">
									{t("dashboard.labels.nodata")}
								</p>
							</>
						}
					/>
				) : (
					<>
						<div className="grid grid-cols-10 gap-4 max-lg:grid-cols-7 max-md:grid-cols-4">
							{games?.map((game: GameProps, i: number) => (
								<Game
									dataSource={game}
									key={i}
									size="full"
								/>
							))}
						</div>
						<div className="flex gap-4 flex-wrap justify-center items-center py-8">
							{tags?.map((tag: string, i: number) => (
								<NavLink
									to={`/?search=${tag}`}
									className="cursor-pointer"
								>
									<Tag title={tag} key={i} />
								</NavLink>
							))}
						</div>
					</>
				)}
			</form>
		</FormProvider>
	);
};

export default Games;
