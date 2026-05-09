import { useTranslation } from "react-i18next";
import { BiLogoTelegram } from "react-icons/bi";
import { SiBluesky } from "react-icons/si";
import { NavLink } from "react-router";
import imgLabel from "@/icons/label.svg";
import imgEmpty from "@/icons/empty.svg";
import { Meta, ViewModel } from "@/components";

/**
 * About page
 * @example
 * return <About />
 */
export default function About({}) {
	const { t } = useTranslation();

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
				<div className="flex justify-center w-full">
					<ViewModel
						name="ufo-about"
						href="/resources/gltf/ufo.gltf"
						spdY={.2}
						scale={1.75}
					/>
				</div>
				<div className="p-4 w-full text-primary">
					<p className="text-default text-2xl text-center text-text">{t("about.description")}</p>
				</div>
				<div className="flex gap-6 text-2xl w-full justify-center items-center">
					<NavLink to="mailto:support@ioy.app">
						<address className="text-2xl text-second">
							support@ioy.app
						</address>
					</NavLink>
					<NavLink to="https://t.me/wmgcat" target="_blank">
						<BiLogoTelegram className="text-second text-2xl" />
					</NavLink>
					<NavLink to="https://bsky.app/profile/wmgcat.bsky.social" target="_blank">
						<SiBluesky className="text-second text-2xl" />
					</NavLink>
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
			</div>
		</div>
	);
}