import * as Icons from "@/icons";
import { Button } from "@/components";
import { NavLink, useAsyncError, useRouteError } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function ErrorPage({ msg }: { msg?: string }) {
	const { t } = useTranslation();

	return (
		<div className="flex-1 w-full h-screen flex justify-center items-center flex-col gap-4 bg-back text-text">
			<img src={Icons.Logo} className="h-25" />
			<p className="text-title">{t("errors.title")}</p>
			<p className="text-default">{msg ? t(msg) : t("errors.unknown")}</p>
			<NavLink to="/">
				<Button variant="primary">{t("buttons.main")}</Button>
			</NavLink>
		</div>
	);
}
