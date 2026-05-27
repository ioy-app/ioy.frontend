import confTabs from "./configs/tabs.json";

import * as Components from "@/components";
import Instances from "./content/instances";
import { user_paths } from "@/routes/user";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { StoreProps } from "@/stories";
import { useTranslation } from "react-i18next";
import {
	BiArrowBack,
	BiChevronsLeft,
} from "react-icons/bi";
import { paths } from "@/routes";
import Jams from "./content/jams";
import { FEATURE_JAMS } from "@/features";
import Following from "./content/following";
import Likes from "./content/likes";
import Reports from "./content/reports";
import Pictures from "./content/pictures";
import { useCallback, useMemo } from "react";

export default function Dashboard() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [ searchParams, setSearchParams ] = useSearchParams();
	const { login, roledata } = useSelector(
		(state: StoreProps) => state.login,
	);

	const tabs = useMemo(() =>
		confTabs
			.map((record) => ({
				...record,
				label: t(record.label),
			}))
			.filter((item) => {
				if (item.value == "jams" && !FEATURE_JAMS)
					return false;
				if (
					item.value == "reports" &&
					!roledata.is_view_reports
				)
					return false;

				return true;
			})
	, []);

	// const handleChange = useCallback((tab: string) => {
	// 	const us = new URLSearchParams();
	// 	us.set("tab", tab);
	// 	setSearchParams(us);
	// }, []);

	// const current_tab = useMemo(() => searchParams.get("tab"), [ searchParams ]);

	return (
		<div className="w-full">
			<div className="w-full flex flex-col gap-2 items-start mb-4">
				<Components.Button
					variant="text"
					onClick={() =>
						navigate(paths.users.details(login))
					}
				>
					<BiChevronsLeft />
					{t("buttons.back")}
				</Components.Button>
			</div>
			<Components.Tabs
				headers={tabs}
				content={{
					instances: <Instances />,
					jams: <Jams />,
					following: <Following />,
					likes: <Likes />,
					reports: <Reports />
				}}
			/>
		</div>
	);
}
