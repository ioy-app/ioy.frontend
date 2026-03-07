import * as Icons from "@/icons";
import {
	BiCalendarAlt,
	BiLogIn,
	BiUser,
} from "react-icons/bi";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { User, Spin } from "@/components";
import { useModal } from "@/hooks";
import { Auth } from "@/pages";
import {
	motion,
	useScroll,
	useMotionValueEvent,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import Popup from "../base/popup";
import { useTranslation } from "react-i18next";
import { user_paths } from "@/routes/user";
import { paths } from "@/routes";

/**
 * Header
 * @example
 * return <Header />
 */
const Header: React.FC<{}> = () => {
	const { t } = useTranslation();
	const { token, login, loading, is_avatar } = useSelector(
		(state: any) => state?.login,
	);
	const { modal } = useModal();
	const location = useLocation();

	const { scrollY } = useScroll();
	const [isScrollable, setScrollable] =
		useState<boolean>(false);
	useMotionValueEvent(scrollY, "change", (value) =>
		setScrollable(value > 32),
	);

	return (
		<header
			className={`transition-shadow sticky top-0 flex flex-row gap-4 items-center justify-between box-border w-full h-12 bg-back px-2 py-1 z-10 border-b ${(isScrollable && "border-b-br shadow-md shadow-[rgba(0, 0, 0, .05)]") || "border-b-transparent"}`}
		>
			<div className="h-full">
				{![paths.jams.list, "/"].includes(
					location.pathname,
				) && (
					<NavLink
						to="/"
						className="h-full aspect-square p-0 m-0"
					>
						<img
							src={Icons.Logo}
							className="aspect-square h-full"
						/>
					</NavLink>
				)}
			</div>
			<nav className="h-full flex gap-4 items-center justify-end px-2">
				{((location.pathname != user_paths.details(login) &&
					token) ||
					!token) && (
					<button
						className="h-full aspect-square cursor-pointer"
						onClick={(e) => {
							if (token || loading) return;

							e.preventDefault();
							modal(Auth, () => <></>);
						}}
					>
						<Spin loading={loading} key={login}>
							{token ? (
								<Popup align="l" label={t("helps.profile")}>
									<User
										login={login}
										dataSource={{
											is_avatar,
										}}
										size={"full"}
									/>
								</Popup>
							) : (
								<Popup align="l" label={t("helps.auth")}>
									<BiUser className="w-full h-full p-1" />
								</Popup>
							)}
						</Spin>
					</button>
				)}
			</nav>
		</header>
	);
};

export default Header;
