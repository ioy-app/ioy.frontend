import { Button, Game, Pagination, Select, Spin, User } from "@/components";
import { paths } from "@/routes";
import { UserProps } from "@/types";
import GameProps from "@/types/game";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BiArrowBack, BiArrowToBottom, BiChevronsLeft, BiDownArrowAlt, BiRightArrowAlt } from "react-icons/bi";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

export default function UserContent({
    id,
    fn,
    login,
    onClose
}: {
    id: string,
    fn: (login: string, us: URLSearchParams) => Promise<Response>
}) {
    const { t } = useTranslation();
    const [ page, setPage ] = useState<number>(1);
    const per_page = 40;

    const query = useQuery({
        queryKey: [ "user", login, "content", id, page ],
        queryFn: async () => {
            const us = new URLSearchParams();
            us.set("offset", String((page - 1) * per_page));
            us.set("limit", String(per_page));
            
            const response = await fn(login, us);
            return (await response.json());
        }
    });

    return (
        <div className="w-full flex flex-1 justify-center">
            <div className="w-full gap-4 flex flex-col">
                <div className="w-full flex flex-col gap-2 items-start">
                    <div className="w-full flex flex-row items-center justify-between gap-4">
                        <p className="text-title">{t(`profile.titles.${id}`)}</p>
                        <Select
                            options={[
                                {
                                    label: t("order.new"),
                                    value: "new"
                                },
                                {
                                    label: t("order.older"),
                                    value: "older"
                                },
                                {
                                    label: t("order.popular"),
                                    value: "popular"
                                }
                            ]}
                            className="w-50"
                            isFirstOption
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-8">
                    <Pagination
                        current={page}
                        total={query?.data?.total}
                        per_page={per_page}
                        onChange={(offset, page) => setPage(page)}
                        disabled={query?.status == "pending"}
                    />
                    <Spin loading={query.status == "pending"}>
                        <div className="grid grid-cols-5 gap-4">
                            {query?.data?.items?.map(((item: GameProps | UserProps, i: number) => {
                                switch(id) {
                                    case "subscribers":
                                        return (
                                            <User
                                                login={(item as UserProps).login}
                                                nolink
                                                onClick={(_login) => onClose && onClose(paths.users.details(_login))}
                                            />
                                        );
                                    break;
                                    default:
                                        return (
                                            <Game
                                                dataSource={item as GameProps}
                                                nolink
                                                onClick={(id) => onClose && onClose(paths.games.details(id))}
                                            />
                                        );
                                    break;
                                }
                            }))}
                        </div>
                    </Spin>
                    <Pagination
                        current={page}
                        total={query?.data?.total}
                        per_page={per_page}
                        onChange={(offset, page) => setPage(page)}
                        disabled={query?.status == "pending"}
                    />
                </div>
            </div>
        </div>
    )
}