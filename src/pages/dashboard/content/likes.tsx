import confOrder from "@/configs/order.json";

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
import { users_favorites, users_likes } from "@/api/routes/users";
import { useSelector } from "react-redux";
import { StoreProps } from "@/stories";

const Likes: React.FC = () => {
    const { t } = useTranslation();
    const navigator = useNavigate();
    const [ searchParams, setSearchParams ] = useSearchParams();
    const { login } = useSelector((state: StoreProps) => state.login);

    const max = 10;
    const current_page = Number(searchParams.get("page") || 1);
    const status = searchParams.get("status");
    const sort = searchParams.get("sort");
    const searchQS = searchParams.get("search");

    const query = useQuery({
        queryKey: [ "dashboard", "likes", searchParams?.toString() ],
        queryFn: async () => {
            const search = new URLSearchParams();

            search.set("offset", String((current_page - 1) * max));
            search.set("limit", String(max));
            if (sort)
                search.set("sort", sort);
            

            const result = await users_likes(login, search);
            return result;
        }
    });

    const onSubmit = async (data) => {
        const us = new URLSearchParams();
        if (data.sort)
            us.set("sort", data.sort);
        setSearchParams(us);
    }

    const methods = useForm();

    useEffect(() => {
        if (searchParams.get("sort"))
            methods.setValue("sort", searchParams.get("sort"));
    }, [ searchParams ]);

    const sorOptions = confOrder?.map(item => {
        item.label = t(item.label);
        return item;
    });

    return (
        <div className="w-full flex flex-col gap-4">
            <FormProvider {...methods}>
                <form
                    className="flex gap-4 items-center flex-wrap"
                    onSubmit={methods.handleSubmit(onSubmit)}
                >
                    <div className="flex flex-wrap items-center justify-end gap-4 w-full">
                        <Components.Select
                            options={sorOptions}
                            className="w-50"
                            placeholder={t("dashboard.placeholders.order")}
                            {...methods.register("sort")}
                        />
                        <Components.Button
                            variant="primary"
                            htmlType="submit"
                        >
                            <BiSearch />
                        </Components.Button>
                    </div>
                </form>
            </FormProvider>
            <Components.Table
                columns={[
                    {
                        title: t("dashboard.table.games.game"),
                        dataIndex: "id",
                        render: (data, game) => (
                            <Link
                                to={paths.games.details(game?.id)}
                                className="group flex items-center gap-2 w-fit"
                            >
                                <Components.Game
                                    dataSource={{
                                        id: game?.id,
                                        is_avatar: game?.is_avatar
                                    } as GameProps}
                                    nolink
                                    size={12}
                                />
                                <p className="text-default group-hover:text-primary transition-colors cursor-pointer">{game?.title}</p>
                            </Link>
                        )
                    },
                    {
                        title: t("dashboard.table.games.version"),
                        dataIndex: "version"
                    },
                    {
                        title: t("dashboard.table.games.date_created"),
                        dataIndex: "date_created",
                        render: (date) => dayjs(date)?.isValid() && dayjs(date).format("HH:mm DD.MM.YYYY")
                    },
                    {
                        title: t("dashboard.table.games.date_updated"),
                        dataIndex: "date_updated",
                        render: (date) => dayjs(date)?.isValid() && dayjs(date).format("HH:mm DD.MM.YYYY")
                    }
                ]}
                data={query?.data?.items}
                loading={query?.isPending}
                footer={(
                    <Components.Pagination
                        total={query?.data?.total || 1}
                        current={current_page}
                        per_page={max}
                        onChange={(offset, page) => {
                            searchParams.set("page", String(page));
                            setSearchParams(searchParams);
                            query.refetch();
                        }}
                    />
                    
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

export default Likes;