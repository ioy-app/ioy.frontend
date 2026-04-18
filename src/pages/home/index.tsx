import { NavLink, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import imgLabel from "@/icons/label.svg";
import { Button } from "@/components";
import { paths } from "@/routes";
import { FEATURE_JAMS } from "@/features";
import { useSelector } from "react-redux";
import { BackgroundScene } from "./pages/about";

export default function Home() {
	const { t } = useTranslation();
	const { login, loading } = useSelector(
		(state: any) => state?.login
	);

	return (
		<div className="flex flex-col gap-4">
			<div className="w-full flex justify-center flex-col items-center gap-2">
				<div className="w-[40%] max-md:w-full flex justify-center items-center relative">
					<img src={imgLabel} className="w-full p-8 z-1 pointer-events-none" />
					<div className="absolute -top-10 left-6.25 z-2 pointer-events-none">
						<BackgroundScene
							key="title-rocket"
							model={"/resources/gltf/rocket.gltf"}
							rotateY={3.1}
							rotateZ={-1}
							speedY={.5}
							speedZ={.1}
							scale={1}
						/>
					</div>
					<div className="absolute -bottom-20 -right-8.25 z-0">
						<BackgroundScene
							key="title-ufo"
							model={"/resources/gltf/ufo.gltf"}
							rotateY={3.1}
							rotateZ={-1}
							speedY={-.5}
							speedZ={.1}
							scale={1}
						/>
					</div>
					<div className="absolute -top-10 right-15.25 z-0">
						<BackgroundScene
							key="title-computer"
							model={"/resources/gltf/computer.gltf"}
							rotateY={3.1}
							rotateZ={-1}
							speedY={-.5}
							speedZ={.1}
							scale={.25}
						/>
					</div>
				</div>
				<div className="flex gap-6 items-center">
					{(!loading && login) && (
						<NavLink to="/feed">
							{({ isActive }) => (
								<Button
									variant="text"
									className={
										isActive ? "text-primary" : "text-text"
									}
									disabled={isActive}
								>
									{t("buttons.nav.feed")}
								</Button>
							)}
						</NavLink>
					)}
					<NavLink to="/">
						{({ isActive }) => (
							<Button
								variant="text"
								className={
									isActive ? "text-primary" : "text-text"
								}
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
									className={
										isActive ? "text-primary" : "text-text"
									}
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
