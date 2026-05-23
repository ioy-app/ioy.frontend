import {
	NavLink,
	Outlet
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import imgLabel from "@/icons/label.svg";
import { Button, Game, Picture, Spin } from "@/components";
import { paths } from "@/routes";
import { useQuery } from "@tanstack/react-query";
import { apiInstance } from "@/api/routes";
import { useMemo } from "react";

export default function Home() {
	const { t } = useTranslation();
	const query = useQuery({
		queryKey: [ "daily" ],
		queryFn: () => apiInstance.get("/daily")
	});

	const game_hype = useMemo(() => {
		const { title, hype, ...data } = query?.data?.gamedata || {};
		return data;
	}, [ query?.data ]);
	const picture_hype = useMemo(() => {
		const { title, hype, ...data } = query?.data?.picturedata || {};
		return data;
	}, [ query?.data ]);

	return (
		<div className="flex flex-col gap-4 w-full">
			<div className="flex items-center gap-4 flex-wrap max-md:justify-center">
				<div className="flex w-fit h-20">
					<img src={imgLabel} className="w-full h-full z-1 pointer-events-none select-none" />
				</div>
				<Spin loading={query?.isLoading && game_hype && picture_hype}>
					<div className="flex items-center gap-4">
						<Game
							dataSource={game_hype}
							size="12"
						/>
						<Picture
							dataSource={picture_hype}
							size="12"
						/>
					</div>
				</Spin>
			</div>
			<div className="w-full flex gap-4 flex-1 h-full max-md:flex-col">
				<nav className="md:sticky top-16 left-0 h-fit">
					<ul className="flex flex-col max-md:flex-row gap-4 w-full overflow-hidden overflow-x-auto border border-br rounded-2xl px-4 py-2 bg-back">
						<li>
							<NavLink to="/feed">
								{({ isActive }) => (
									<Button
										variant="clear"
										className={isActive ? "text-primary" : "text-text"}
									>
										<span>{t("buttons.nav.feed")}</span>
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
										<span>{t("buttons.nav.games")}</span>
									</Button>
								)}
							</NavLink>
						</li>
						<li>
							<NavLink to="/pictures">
								{({ isActive }) => (
									<Button
										variant="clear"
										className={isActive ? "text-primary" : "text-text"}
									>
										<span>{t("buttons.nav.pictures")}</span>
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
										<span>{t("buttons.nav.jams")}</span>
									</Button>
								)}
							</NavLink>
						</li>
					</ul>
					<div className="px-8 py-4 text-default max-md:hidden">
						<NavLink to={paths.about}>
							{t("footer.about")}
						</NavLink>
					</div>
				</nav>
				<div className="col-span-12 flex flex-col gap-4 flex-1 h-full w-full">
					<Outlet />
				</div>
			</div>
		</div>
	);
}
