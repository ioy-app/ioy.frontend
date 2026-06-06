import confTabs from "./configs/tabs.json";

import * as Components from "@/components";
import Instances from "./content/instances";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { StoreProps } from "@/stories";
import { useTranslation } from "react-i18next";
import { BiChevronsLeft } from "react-icons/bi";
import { paths } from "@/routes";
import Jams from "./content/jams";
import { FEATURE_JAMS } from "@/features";
import Following from "./content/following";
import Likes from "./content/likes";
import Reports from "./content/reports";
import { useEffect, useMemo } from "react";

export default function Dashboard() {
	const { t } = useTranslation();
	const params = useParams();
	const tab = params?.tab;
	const navigate = useNavigate();
	const { login, roledata } = useSelector(
		(state: StoreProps) => state.login,
	);

	const tabs = useMemo(() =>
		confTabs
			.map((record) => ({
				...record,
				label: (
					<NavLink to={`${paths.dashboard.list}/${record.value}`}>
						{t(record.label)}
					</NavLink>
				),
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
	, [ roledata ]);

	useEffect(() => {
		document.title = t(`dashboard.tabs.${tab && tab || "instances"}`);
	}, [
		t,
		tab
	]);

	return (
		<div className="w-full">
			<div className="w-full flex flex-col gap-2 items-start mb-4">
				<Components.Button
					variant="text"
					onClick={() => navigate(paths.users.details(login))}
				>
					<BiChevronsLeft />
					{t("buttons.back")}
				</Components.Button>
			</div>
			<Components.Tabs
				headers={tabs}
				value={tab}
				onChange={(tab) => navigate(`${paths.dashboard.list}/${tab}`)}
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
