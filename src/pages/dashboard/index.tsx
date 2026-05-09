import confTabs from "./configs/tabs.json";

import * as Components from "@/components";
import Games from "./content/games";
import { user_paths } from "@/routes/user";
import { useNavigate } from "react-router-dom";
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

export default function Dashboard() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { login, roledata } = useSelector(
		(state: StoreProps) => state.login,
	);

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
				headers={confTabs
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
					})}
				content={{
					games: <Games />,
					jams: <Jams />,
					following: <Following />,
					likes: <Likes />,
					reports: <Reports />,
				}}
			/>
		</div>
	);
}
