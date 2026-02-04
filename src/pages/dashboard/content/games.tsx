import { BiBox, BiEditAlt, BiPlus, BiSearch, BiSearchAlt } from "react-icons/bi";
import confStatus from "../status.json";

import { dashboard_games } from "@/api/routes/dashboard";
import { useEffect, useState } from "react";

import * as Components from "@/components";
import dayjs from "dayjs";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { games_paths } from "@/routes/games";
import { paths } from "@/routes";
import GameProps from "@/types/game";
import { useQuery } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";

const Games: React.FC = () => {
    const { t } = useTranslation();
    const navigator = useNavigate();
    const [ searchParams, setSearchParams ] = useSearchParams();

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
        query.refetch();
    }

    const query = useQuery({
        queryKey: [ "dashboard", "games", searchParams?.toString() ],
        queryFn: async () => {
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

            return json;
        }
    });

    const onSubmit = async (data) => {
        const us = new URLSearchParams();
        if (data.search)
            us.set("search", data.search);
        if (data.status && data.status != "all")
            us.set("status", data.status);
        setSearchParams(us);
    }

    const methods = useForm();

    const pagination = handleGetPages(current_page, Math.ceil((query?.data?.total || 1) / max));

    useEffect(() => {
        if (searchParams.get("search"))
            methods.setValue("search", searchParams.get("search"));
        if (searchParams.get("status"))
            methods.setValue("status", searchParams.get("status"));
    }, [ searchParams ]);

    return (
        <div className="w-full flex flex-col gap-4">
            <FormProvider {...methods}>
                <form
                    className="flex gap-4 items-center"
                    onSubmit={methods.handleSubmit(onSubmit)}
                >
                    <Components.Input
                        type="search"
                        {...methods.register("search")}
                        placeholder={t("dashboard.games.search")}
                    />
                    <Components.Select
                        placeholder={t("dashboard.placeholders.status")}
                        options={confStatus.map(record => ({
                            ...record,
                            label: t(record.label)
                        }))}
                        {...methods.register("status")}
                        className="w-50"
                    />
                    <Components.Button
                        variant="primary"
                        htmlType="submit"
                    >
                        <BiSearch />
                    </Components.Button>
                </form>
            </FormProvider>
            <Components.Table
                columns={[
                    {
                        title: t("dashboard.games.table.game"),
                        dataIndex: "id",
                        render: (data, game) => (
                            <Link
                                to={paths.games.details(game?.id)}
                                className="group flex items-center gap-2 w-fit"
                            >
                                <Components.Game
                                    dataSource={{
                                        id: game?.id
                                    } as GameProps}
                                    nolink
                                    size={12}
                                />
                                <p className="text-default group-hover:text-primary transition-colors cursor-pointer">{game?.title}</p>
                            </Link>
                        )
                    },
                    {
                        title: t("dashboard.games.table.version"),
                        dataIndex: "version"
                    },
                    {
                        title: t("dashboard.games.table.status"),
                        dataIndex: "status",
                        render: (status) => t(`dashboard.statuses.` + status)
                    },
                    {
                        title: t("dashboard.games.table.date_created"),
                        dataIndex: "date_created",
                        render: (date) => dayjs(date)?.isValid() && dayjs(date).format("HH:mm DD.MM.YYYY")
                    },
                    {
                        title: t("dashboard.games.table.date_updated"),
                        dataIndex: "date_updated",
                        render: (date) => dayjs(date)?.isValid() && dayjs(date).format("HH:mm DD.MM.YYYY")
                    }
                ]}
                data={query?.data?.items}
                loading={query?.isPending}
                control={(row, i) => (
                    <>
                        <Components.Button
                            variant="second"
                            onClick={() => navigator(games_paths.edit(row?.id))}
                        >
                            <BiEditAlt />
                        </Components.Button>
                    </>
                )}
                header={(
                    <div className="w-full flex items-center justify-end gap-4">
                        <Components.Button
                            variant="primary"
                            onClick={() => navigator(games_paths.create)}
                        >
                            <BiPlus />
                            {t("buttons.add_game")}
                        </Components.Button>
                    </div>
                )}
                footer={(
                    <div className="flex gap-4 items-center justify-end flex-wrap">
                        {pagination && pagination?.map((page: number, i: number) => (
                            <Components.Button
                                disabled={page == current_page}
                                key={i}
                                onClick={() => handleChangePage(page)}
                                variant={!i || i == (pagination.length - 1) ? "primary" : "default"}
                            >
                                {page}
                            </Components.Button>
                        ))}
                    </div>
                )}
                nodata={(
                    <>
                        <BiBox className="text-2xl" />
                        <p className="text-placeholder">{t("dashboard.labels.nodata")}</p>
                    </>
                )}
            />
        </div>
    );
}

export default Games;