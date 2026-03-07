import { NavLink, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import imgLabel from "@/icons/label.svg";
import { Button } from "@/components";
import { paths } from "@/routes";
import { FEATURE_JAMS } from "@/features";

export default function Home() {
	const { t } = useTranslation();
	document.title = t("home.title");
	return (
		<div className="flex flex-col gap-4">
			<div className="w-full flex justify-center flex-col items-center gap-2">
				<div className="w-[40%] max-md:w-full flex justify-center items-center">
					<img src={imgLabel} className="w-full p-8" />
				</div>
				<div className="flex gap-6 items-center">
					<NavLink to="/">
						{({ isActive }) => (
							<Button
								variant="text"
								className={isActive ? "text-primary" : "text-text"}
								disabled={isActive}
							>
								{t("buttons.nav.games")}
							</Button>
						)}
					</NavLink>
					{FEATURE_JAMS && (
						<NavLink to={paths.jams.list}>
							{({ isActive }) => (
								<Button
									variant="text"
									className={isActive ? "text-primary" : "text-text"}
									disabled={isActive}
								>
									{t("buttons.nav.jams")}
								</Button>
							)}
						</NavLink>
					)}
				</div>
			</div>
			<div className="flex gap-4 w-full max-md:flex max-md:flex-col-reverse">
				<Outlet />
			</div>
		</div>
	);
}
