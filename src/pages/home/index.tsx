import { Link, NavLink, Outlet, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import imgLabel from "@/icons/label.svg";
import { Button, Footer, Game, Input, Pagination, Table, User } from "@/components";
import { paths } from "@/routes";
import { FEATURE_JAMS } from "@/features";
import { useSelector } from "react-redux";
import { BackgroundScene } from "./pages/about";
import Games from "../games";
import Feed from "./pages/feed";
import Jams from "../jams";
import { BiBox, BiCalendar, BiChevronsLeft, BiComment, BiImage, BiPlay, BiPlayCircle, BiSearch } from "react-icons/bi";
import { search } from "@/api/routes/search";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { games_list } from "@/api/routes/games";
import { FormProvider, useForm } from "react-hook-form";
import GameProps from "@/types/game";
import dayjs from "dayjs";

export default function Home() {
	const { t } = useTranslation();
	const { login, loading } = useSelector(
		(state: any) => state?.login
	);

	const [searchParams, setSearchParams] = useSearchParams();
	const methods = useForm();
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
		<div className="flex flex-col gap-4 w-full">
			<div className="flex w-fit h-40">
				<img src={imgLabel} className="w-full h-full p-8 z-1 pointer-events-none select-none" />
			</div>
			<div className="w-full flex gap-4 flex-1 h-full">
				<nav className="sticky top-16 left-0 border border-br rounded-2xl h-fit px-4 py-2 bg-back">
					<ul className="flex flex-col gap-4 w-full overflow-hidden">
						<li>
							<NavLink to="/search">
								{({ isActive }) => (
									<Button
										variant="clear"
										className={isActive ? "text-primary" : "text-text"}
									>
										<BiSearch className="max-md:text-2xl" />
										<span className="max-md:hidden">{t("buttons.nav.search")}</span>
									</Button>
								)}
							</NavLink>
						</li>
						<li>
							<NavLink to="/">
								{({ isActive }) => (
									<Button
										variant="clear"
										className={isActive ? "text-primary" : "text-text"}
									>
										<BiPlay className="max-md:text-2xl" />
										<span className="max-md:hidden">{t("buttons.nav.games")}</span>
									</Button>
								)}
							</NavLink>
						</li>
						<li>
							<NavLink to="/jams">
								{({ isActive }) => (
									<Button
										variant="clear"
										className={isActive ? "text-primary" : "text-text"}
									>
										<BiCalendar className="max-md:text-2xl" />
										<span className="max-md:hidden">{t("buttons.nav.jams")}</span>
									</Button>
								)}
							</NavLink>
						</li>
						<li>
							<NavLink to="/feed">
								{({ isActive }) => (
									<Button
										variant="clear"
										className={isActive ? "text-primary" : "text-text"}
									>
										<BiComment className="max-md:text-2xl" />
										<span className="max-md:hidden">{t("buttons.nav.feed")}</span>
									</Button>
								)}
							</NavLink>
						</li>
					</ul>
				</nav>
				<div className="col-span-12 flex flex-col gap-4 flex-1 h-full w-full">
					<Outlet />
				</div>
			</div>
		</div>
	);

	return (
		<FormProvider {...methods}>
			<div className="flex flex-col gap-4">
				<div className="w-full flex justify-start flex-col items-start gap-2 z-0">
					<div className="w-md max-md:w-full flex justify-center items-center relative -z-2 overflow-hidden">
						<img src={imgLabel} className="w-full p-8 z-1 pointer-events-none select-none" />
					</div>
				</div>
				<div className="w-full flex flex-col items-center gap-4 z-2">
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
						/>
					) : (
						<div className="grid grid-cols-5 gap-4 w-full max-md:flex max-md:flex-col-reverse">
							<div className="flex flex-col gap-4 col-span-2">
								<p className="text-xl text-text flex items-center gap-2">
									<BiComment />
									{t("buttons.nav.feed")}
								</p>
								<Feed />
							</div>
							<div className="flex flex-col gap-4 col-span-3">
								<form
									className="w-4xl max-xl:w-full flex gap-4 items-end"
									onSubmit={methods.handleSubmit(submit)}	
								>
									<div className="flex flex-col gap-4 items-center w-full">
										{isSearch && (
											<div className="w-4xl max-xl:w-full">
												<NavLink to="/" className="flex w-fit">
													<Button
														variant="text"
														htmlType="button"
													>
														<BiChevronsLeft />
														{t("buttons.back")}
													</Button>
												</NavLink>
											</div>
										)}
										<Input
											placeholder={t(
												"home.search.placeholders.search",
											)}
											type="search"
											{...methods.register("search")}
										/>
									</div>
									<Button variant="primary" htmlType="submit">
										<BiSearch />
									</Button>
								</form>
								<p className="text-xl text-text">{t("buttons.nav.games")}</p>
								<Games />
								<p className="text-xl text-text">{t("buttons.nav.jams")}</p>
								<Jams />
								<Footer />
							</div>
						</div>
					)}
				</div>
			</div>
		</FormProvider>
	);
}
