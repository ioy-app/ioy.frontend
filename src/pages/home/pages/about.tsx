import { useTranslation } from "react-i18next";
import {
	BiLogoGithub,
	BiLogoTelegram
} from "react-icons/bi";
import { NavLink } from "react-router";
import imgLabel from "@/icons/label.svg";
import imgEmpty from "@/icons/empty.svg";
import {
	Game,
	Meta,
	Picture,
	Spin,
	TitleColorfull,
	ViewModel
} from "@/components";
import { GoLaw } from "react-icons/go";
import { useQuery } from "@tanstack/react-query";
import { games_list } from "@/api/games";
import { pictures_list } from "@/api/pictures";
import { FaBluesky } from "react-icons/fa6";
import { useEffect } from "react";

/**
 * About page
 * @example
 * return <About />
 */
export default function About() {
	const { t } = useTranslation();
	useEffect(() => {
		document.title = t("about.title");
	}, [ t ]);
	
	const gamesQuery = useQuery({
		queryKey: [ "about", "games" ],
		queryFn: () => games_list({
			offset: 0,
			limit: 3
		})
	});

	const picturesQuery = useQuery({
		queryKey: [ "about", "pictures" ],
		queryFn: () => pictures_list({
			offset: 0,
			limit: 3
		})
	});

	return (
		<div className="flex-1 flex justify-center flex-col items-center w-full min-h-full">
			<Meta
				title="ioy.app"
				description={t("about.description")}
				url="https://ioy.app/"
			/>
			<div className="flex flex-col justify-center gap-4 flex-1 max-w-[60%] max-md:max-w-full z-2">
				<div className="flex justify-center w-full">
					<div className="w-[60%] max-md:w-full flex justify-center items-center">
						<img src={imgLabel} className="w-full p-8" />
					</div>
				</div>
				<div className="px-6 w-full flex flex-col gap-4">
					<p className="text-title text-center">
						<TitleColorfull text={t("about.title")} />
					</p>
					<p className="text-default text-default text-center text-text">{t("about.description")}</p>
				</div>
				<div className="flex flex-col justify-center items-center w-full relative -rotate-8 pointer-events-none">
					<ViewModel
						name="ufo-about"
						href="/resources/gltf/ufo.gltf"
						spdY={.2}
						scale={1.75}
					/>
					<div
						className="inline-block h-32 absolute ml-6 top-16 -z-1 border-x-48 border-x-transparent border-b-150 border-b-amber-300 animate-pulse"
					/>
				</div>
				<div className="text-text text-default flex flex-col gap-4 w-full">
					<p className="text-second text-title">
						<NavLink
							to="/"
							className="transition-opacity hover:opacity-75"
						>
							<TitleColorfull text={t("about.titles.games")} />
						</NavLink>
					</p>
					<p className="text-center px-6">{t("about.games")}</p>
					<Spin loading={gamesQuery?.isLoading}>
						<div className="grid grid-cols-3 gap-4">
							{gamesQuery?.data?.items?.map?.((item, i) => (
								<Game
									dataSource={item}
									size="full"
									className={`${(i % 2 != 0) && "mt-8"}`}
								/>
							))}
						</div>
					</Spin>
				</div>
				
				<div className="text-text text-default flex flex-col gap-4 justify-end w-full">
					<p className="text-primary text-title text-end">
						<NavLink
							to="/pictures"
							className="transition-opacity hover:opacity-75"
						>
							<TitleColorfull text={t("about.titles.pictures")} />
						</NavLink>
					</p>
					<p className="text-center px-6">{t("about.pictures")}</p>
					<Spin loading={picturesQuery?.isLoading}>
						<div className="grid grid-cols-3 gap-4 items-center">
							{picturesQuery?.data?.items?.map?.((item, i) => (
								<Picture
									dataSource={item}
									size="full"
								/>
							))}
						</div>
					</Spin>
				</div>
				<div className="text-text text-default flex flex-col gap-4 justify-end w-full">
					<p className="text-primary text-title text-center">
						<TitleColorfull text={t("about.titles.social")} />
					</p>
					<p className="text-center px-6">{t("about.social")}</p>
					<div className="flex justify-center items-center gap-8 flex-wrap">
						<NavLink
							to="https://t.me/ioy_app"
							target="_blank"
							className="text-blue-400 flex items-center gap-2 w-fit hover:opacity-75 transition-opacity"
						>
							<BiLogoTelegram />
							Telegram
						</NavLink>
						<NavLink
							to="https://bsky.app/profile/ioyapp.bsky.social"
							target="_blank"
							className="text-blue-400 flex items-center gap-2 w-fit hover:opacity-75 transition-opacity"
						>
							<FaBluesky />
							Bluesky
						</NavLink>
					</div>
				</div>
				<div className="flex justify-center w-full relative">
					<div className="absolute right-[30%] top-[10%]">
						<ViewModel
							name="computer-about"
							href="/resources/gltf/computer.gltf"
							spdX={.2}
							spdY={-.5}
						/>
					</div>
					<div className="w-[40%] max-md:w-full flex justify-center items-center">
						<img src={imgEmpty} className="w-full p-8" />
					</div>
				</div>
				<div className="text-default justify-center flex gap-2 items-center text-text/50">
					<GoLaw />
					GPL-3.0 license,
					<NavLink
						to="https://github.com/ioy-app"
						target="_blank"
						className="text-text text-default flex gap-2 items-center hover:text-text/50 transition-colors"
					>
						<BiLogoGithub />
						Github
					</NavLink>
				</div>
			</div>
		</div>
	);
}