import {
	NavLink,
	Outlet
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import imgLabel from "@/icons/label.svg";
import { Button } from "@/components";
import {
	BiCalendar,
	BiComment,
	BiImage,
	BiPlay
} from "react-icons/bi";

export default function Home() {
	const { t } = useTranslation();

	return (
		<div className="flex flex-col gap-4 w-full">
			<div className="flex w-fit h-20">
				<img src={imgLabel} className="w-full h-full z-1 pointer-events-none select-none" />
			</div>
			<div className="w-full flex gap-4 flex-1 h-full max-md:flex-col">
				<nav className="md:sticky top-16 left-0 border border-br rounded-2xl h-fit px-4 py-2 bg-back">
					<ul className="flex flex-col max-md:flex-row max-md:justify-center gap-4 w-full overflow-hidden">
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
							<NavLink to="/pictures">
								{({ isActive }) => (
									<Button
										variant="clear"
										className={isActive ? "text-primary" : "text-text"}
									>
										<BiImage className="max-md:text-2xl" />
										<span className="max-md:hidden">{t("buttons.nav.pictures")}</span>
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
					</ul>
				</nav>
				<div className="col-span-12 flex flex-col gap-4 flex-1 h-full w-full">
					<Outlet />
				</div>
			</div>
		</div>
	);
}
