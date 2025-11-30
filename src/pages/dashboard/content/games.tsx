import confStatus from "../status.json";

import { dashboard_games } from "@/api/routes/dashboard";
import GameProps from "@/components/game/interface";
import { useEffect, useState } from "react";

import * as Components from "@/components";
import dayjs from "dayjs";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { games_paths } from "@/routes/games";

const Games: React.FC = () => {
    const { t } = useTranslation();
    const navigator = useNavigate();
    const [ searchParams, setSearchParams ] = useSearchParams();
    const [ isLoading, setLoading ] = useState<boolean>(false);
    const [ games, setGames ] = useState<GameProps[]>(null);
    const [ pages, setPages ] = useState<number>(1);

    const max = 10;
    const current_page = Number(searchParams.get("page") || 1);
    const status = searchParams.get("status");
    const searchQS = searchParams.get("search");

    const handleGetPages = (current_page: number, pages: number) => {
        const arr: number[] = [];

        arr.push(1);
        if (current_page < 3) {
            for (let i = 1; i <= Math.min(4, pages); i++)
                arr.push(i);
        }
        if (current_page > pages - 3) {
            for (let i = Math.max(pages - 3, 1); i <= pages; i++)
                arr.push(i);
        }

        for (let i = Math.max(current_page - 1, 1); i <= Math.min(current_page + 1, pages); i++)
            arr.push(i);
        
        arr.push(pages);

        const new_arr = Array.from(new Set(arr));
        if (new_arr.length <= 1)
            return [];

        return new_arr;
    }

    const handleChangePage = (page: number) => {
        searchParams.set("page", String(page));
        setSearchParams(searchParams);
    }

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setGames(null);

                const search = new URLSearchParams();

                search.set("offset", String((current_page - 1) * max));
                search.set("limit", String(max));
                if (status)
                    search.set("status", status);
                if (searchQS)
                    search.set("search", searchQS);
                
                const result = await dashboard_games(search);
                const json = await result.json();
                if (result.status != 200)
                    throw json?.msg;

                setGames(json?.items);
                setPages(Math.ceil((json?.total || 1) / max));
            }
            catch(err) {

            }
            finally { setLoading(false); }
        })();
    }, [ searchParams ]);

    const pagination = handleGetPages(current_page, pages);

    return (
        <>
            <div className="wp_dashboard__header">
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--size-gap)"
                }}>
                    <Components.Input
                        type="search"
                        placeholder={t("dashboard.games.search")}
                        onChange={({ target: { value } }) => {
                            if (value.length <= 2) {
                            searchParams.delete("search");
                            } else searchParams.set("search", value);
                            searchParams.set("page", String(1));
                            setSearchParams(searchParams);
                        }}
                        defaultValue={searchParams.get("search")}
                    />
                    <Components.Select
                        options={confStatus.map(record => ({
                            ...record,
                            label: t(record.label)
                        }))}
                        onChange={({ target: { value } }) => {
                            if (value == "all")
                                searchParams.delete("status");
                            else searchParams.set("status", value);
                            searchParams.set("page", String(1));
                            setSearchParams(searchParams);
                        }}
                        defaultValue={searchParams.get("status")}
                    />
                </div>
                <Components.Button
                    type="second"
                    onClick={() => navigator(games_paths.create)}
                >
                    {t("buttons.add_game")}
                </Components.Button>
            </div>
            <Components.Spin loading={isLoading}>
                <div className="wp_dashboard__table">
                    <table>
                        <thead>
                            <tr>
                                <td>{t("dashboard.games.table.game")}</td>
                                <td>{t("dashboard.games.table.version")}</td>
                                <td>{t("dashboard.games.table.status")}</td>
                                <td>{t("dashboard.games.table.date_created")}</td>
                                <td>{t("dashboard.games.table.date_updated")}</td>
                                <td></td>
                            </tr>
                        </thead>
                        <tbody>
                            {games && games?.map((game: GameProps, i: number) => {
                                const date_created = dayjs(game?.date_created);
                                const date_updated = dayjs(game?.date_updated);

                                const dt_created_text = date_created.isValid() && date_created.format("HH:mm DD.MM.YYYY") || "-";
                                const dt_updated_text = date_updated.isValid() && date_updated.format("HH:mm DD.MM.YYYY") || "-"

                                return (
                                    <tr className="wp_dashboard__table_row" key={i}>
                                        <td>
                                            <div className="wp_dashboard__table_row_line">
                                                <Components.Game dataSource={game} compact />
                                                <p className="text title">{game?.title}</p>
                                            </div>
                                        </td>
                                        <td><p className="text">{game?.version || "-"}</p></td>
                                        <td className="wp_dashboard__table_row_status"><p className="text">{t(`dashboard.statuses.` + game?.status)}</p></td>
                                        <td><p className="text">{dt_created_text}</p></td>
                                        <td><p className="text">{dt_updated_text}</p></td>
                                        <td>
                                            <div className="wp_dashboard__table_row_control">
                                                <Components.Button
                                                    type="primary"
                                                    onClick={() => navigator(games_paths.edit(game?.id))}
                                                >
                                                    {t("buttons.edit")}
                                                </Components.Button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="wp_dashboard__footer" key={pages}>
                    {pagination && pagination?.map((page: number, i: number) => (
                        <Components.Button
                            disabled={page == current_page}
                            key={i}
                            onClick={() => handleChangePage(page)}
                            type={!i || i == (pagination.length - 1) ? "primary" : "default"}
                        >
                            {page}
                        </Components.Button>
                    ))}
                </div>
            </Components.Spin>
        </>
    );
}

export default Games;