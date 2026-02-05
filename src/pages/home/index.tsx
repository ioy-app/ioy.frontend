import { FormProvider, useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { BiBox, BiSearch, BiSolidHot } from "react-icons/bi";
import { Button, Checkbox, Game, Input, Spin, Table, Tabs, Tag, User } from "@/components";
import { games_list } from "@/api/routes/games";
import { useTranslation } from "react-i18next";
import GameProps from "@/types/game";
import imgLabel from "@/icons/label.svg";
import { search } from "@/api/routes/search";
import { paths } from "@/routes";
import dayjs from "dayjs";
import { useEffect } from "react";

export default function Home() {
    const navigation = useNavigate();
    const [ searchParams, setSearchParams ] = useSearchParams();
    const methods = useForm();
    const { t } = useTranslation();
    

    document.title = t("home.title");

    const {
        isFetching,
        data: {
            games,
            tags
        }
    } = useQuery({
        queryKey: ["home", "games"],
        queryFn: async () => {
            const response = await games_list();
            return (await response.json());
        },
        initialData: () => ({
            games: [],
            tags: []
        })
    });

    useEffect(() => {
        methods.setValue("search", null);

        if (searchParams.get("search"))
            methods.setValue("search", searchParams.get("search"));
        if (searchParams.get("status"))
            methods.setValue("status", searchParams.get("status"));
    }, [ searchParams ]);

    const isSearch = searchParams.get("search");
    const max = 20;
    const current_page = Number(searchParams.get("page") || 1);

    const submit = (data) => {
        const us = new URLSearchParams(data);

        if (!data?.search)
            us.delete("search");

        setSearchParams(us);
    }

    const searchQuery = useQuery({
        queryKey: [ "search", searchParams?.toString() ],
        queryFn: async () => {
            if (!searchParams.get("search"))
                return {
                    items: [],
                    total: 0
                }
            
            const us = new URLSearchParams();

            us.set("offset", String((current_page - 1) * max));
            us.set("limit", String(max));
            us.set("search", searchParams.get("search"));
            
            const response = await search(us);
            const json = await response.json();
            console.log(json);
            return json;
        },
        initialData: {
            items: [],
            total: 0
        }
    })

    

    


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

    const pagination = handleGetPages(current_page, Math.ceil((searchQuery?.data?.total || 1) / max));

    return (
        <Spin loading={isFetching}>
            <div className="flex flex-col gap-4">
                <div className="w-full flex justify-center">
                    <div className="w-[40%] max-md:w-full flex justify-center items-center">
                        <img
                            src={imgLabel}
                            className="w-full p-8"
                        />
                    </div>
                </div>
                <div className="flex gap-4 w-full max-md:flex max-md:flex-col-reverse">
                    <FormProvider {...methods}>
                        <form
                            className="col-span-4 flex flex-col gap-4 w-full h-fit"
                            onSubmit={methods.handleSubmit(submit)}
                        >
                            <div className="flex gap-4">
                                <Input
                                    placeholder={t("home.search.placeholders.search")}
                                    type="search"
                                    {...methods.register("search")}
                                />
                                <Button
                                    variant="primary"
                                    htmlType="submit"
                                >
                                    <BiSearch />
                                </Button>
                            </div>
                            <div className="flex gap-4 flex-wrap justify-start items-center">
                                {tags?.map((tag: string, i: number) => (
                                    <NavLink
                                        to={`/?search=${tag}`}
                                        className="cursor-pointer"
                                    >
                                        <Tag
                                            title={tag}
                                            key={i}
                                        />
                                    </NavLink>
                                ))}
                            </div>
                            {isSearch ? (
                                <Table
                                    columns={[
                                        {
                                            title: t("dashboard.games.table.game"),
                                            dataIndex: "id",
                                            render: (data, game) => (
                                                <Link
                                                    to={paths.games.details(game?.id)}
                                                    className="group flex items-center gap-2 w-fit"
                                                >
                                                    <Game
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
                                            title: t("dashboard.games.table.author"),
                                            dataIndex: "creater_data",
                                            render: (data, game) => (
                                                <Link
                                                    to={paths.users.details(data?.login)}
                                                    className="group flex items-center gap-2 w-fit"
                                                >
                                                    <User
                                                        login={data.login}
                                                        nolink
                                                        size={12}
                                                    />
                                                    <p className="text-default group-hover:text-primary transition-colors cursor-pointer">{data?.login}</p>
                                                </Link>
                                            )
                                        },
                                        {
                                            title: t("dashboard.games.table.version"),
                                            dataIndex: "version"
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
                                    data={searchQuery?.data?.items}
                                    loading={searchQuery?.isPending}
                                    footer={(
                                        <div className="flex gap-4 items-center justify-end flex-wrap">
                                            {pagination && pagination?.map((page: number, i: number) => (
                                                <Button
                                                    disabled={page == current_page}
                                                    key={i}
                                                    onClick={() => handleChangePage(page)}
                                                    variant={!i || i == (pagination.length - 1) ? "primary" : "default"}
                                                >
                                                    {page}
                                                </Button>
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
                            ) : (
                                <Tabs
                                    headers={[
                                        {
                                            label: t("home.tabs.games"),
                                            value: "games"
                                        },
                                        {
                                            label: t("home.tabs.jams"),
                                            value: "jams"
                                        }
                                    ]}
                                    content={{
                                        games: (
                                            <div className="flex flex-wrap gap-4 h-fit">
                                                {games?.map((game: GameProps, i: number) => (
                                                    <Game
                                                        dataSource={game}
                                                        key={i}
                                                    />
                                                ))}
                                            </div>
                                        )
                                    }}
                                />
                            )}
                        </form>
                    </FormProvider>
                </div>
            </div>
        </Spin>
    );
}