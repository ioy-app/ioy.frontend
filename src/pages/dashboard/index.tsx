import confTabs from "./tabs.json";

import * as Components from "@/components";
import "./styles.less";
import Games from "./content/games";
import { user_paths } from "@/routes/user";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { StoreProps } from "@/stories";
import { useTranslation } from "react-i18next";

export default function Dashboard() {
    const { t } = useTranslation();
    const navigator = useNavigate();
    const { login } = useSelector((state: StoreProps) => state.login);


    return (
        <div className="wp_dashboard">
            <div className="wp_dashboard__header">
                <p className="text title">{t("dashboard.title")}</p>
                <Components.Button
                    type="primary"
                    onClick={() => navigator(user_paths.details(login))}
                >
                    {t("buttons.back")}
                </Components.Button>
            </div>
            <Components.Tabs
                headers={confTabs.map(record => ({
                    ...record,
                    label: t(record.label)
                }))}
                content={{
                    games: <Games />
                }}
            />
        </div>
    );
}