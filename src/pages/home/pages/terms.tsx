import pdfCookie from "@/../assets/policies/ru/cookie.pdf";
import pdfTerms from "@/../assets/policies/ru/terms.pdf";
import pdfPrivacy from "@/../assets/policies/ru/privacy.pdf";
import { useTranslation } from "react-i18next";
import { useState } from "react";

/**
 * Terms
 * @example
 * return <Terms />
 */
export default function Terms() {
	const { t } = useTranslation();
	const prefersDarkMode =
		window.matchMedia &&
		window.matchMedia("(prefers-color-scheme: dark)").matches;
	const [darkMode, setDarkMode] = useState<"dark" | "light">(
		(localStorage.getItem("theme") || (prefersDarkMode && "dark")) as
			| "dark"
			| "light",
	);

	document.title = t(`footer.terms`);
	if (darkMode == "dark") document.documentElement.classList.add("dark");

	return (
		<div className="flex flex-col gap-2 w-full text-default text-text p-4">
			<h1 className="text-2xl text-center pb-8">{t("terms.title")}</h1>
			<h2 className="text-placeholder">
				{t("terms.date", { date: "12.04.2026" })}
			</h2>
			<h2 className="text-placeholder">
				{t("terms.contact", { contact: "support@ioy.app" })}
			</h2>
			<p className="pb-4 pt-8">{t("terms.description")}</p>
			<p className="text-danger border border-danger p-4 rounded-xl my-4">
				{t("terms.age")}
			</p>
			<ol className="list-decimal pl-8">
				<li>
					<h3>{t("terms.first.title")}</h3>
					<ol className="list-decimal pl-8">
						<li>{t("terms.first.items.0")}</li>
						<li>{t("terms.first.items.1")}</li>
						<li>{t("terms.first.items.2")}</li>
					</ol>
				</li>
				<li>
					<h3>{t("terms.second.title")}</h3>
					<p>{t("terms.second.description")}</p>
					<ol className="list-disc pl-8">
						<li>{t("terms.second.items.0")}</li>
						<li>{t("terms.second.items.1")}</li>
						<li>{t("terms.second.items.2")}</li>
						<li>{t("terms.second.items.3")}</li>
						<li>{t("terms.second.items.4")}</li>
						<li>{t("terms.second.items.5")}</li>
					</ol>
				</li>
				<li>
					<h3>{t("terms.third.title")}</h3>
					<h4>{t("terms.third.subtitle")}</h4>
					<p>{t("terms.third.description")}</p>
					<ol className="list-disc pl-8">
						<li>{t("terms.third.items.0")}</li>
						<li>{t("terms.third.items.1")}</li>
						<li>{t("terms.third.items.2")}</li>
					</ol>
				</li>
			</ol>
			<p className="mt-8">{t("terms.privacy")}</p>
			<p>{t("terms.delete")}</p>
		</div>
	);
}
