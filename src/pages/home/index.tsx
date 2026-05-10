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
			<div className="flex w-fit h-20">
				<img src={imgLabel} className="w-full h-full z-1 pointer-events-none select-none" />
			</div>
			{login && <p className="text-default">{t("home.welcome")}, <span className="text-primary">{login}!</span></p>}
			<div className="w-full flex gap-4 flex-1 h-full max-md:flex-col">
				<nav className="md:sticky top-16 left-0 border border-br rounded-2xl h-fit px-4 py-2 bg-back">
					<ul className="flex flex-col max-md:flex-row max-md:justify-center gap-4 w-full overflow-hidden">
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
}
