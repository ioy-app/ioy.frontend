import { Button, Game, Spin, User } from "@/components";
import GameProps from "@/components/content/game/interface";
import { UserProps } from "@/types";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next";
import { BiArrowBack, BiArrowToBottom, BiChevronsLeft, BiDownArrowAlt } from "react-icons/bi";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

export default function UserContent({
    id,
    fn
}: {
    id: string,
    fn: (login: string, us: URLSearchParams) => Promise<Response>
}) {
    const { t } = useTranslation();
    const params = useParams();
    const navigator = useNavigate();

    const queryFn = async ({ pageParam = 0 }) => {
        const limit: number = 50;
        const us = new URLSearchParams({
            offset: String(pageParam),
            limit: String(limit)
        });

        const response = await fn(params.login, us);
        return (await response.json());
    }

    const {
        status,
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: ["user", params.login, "content", id],
        queryFn,
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            const next = Number(lastPage.offset) + Number(lastPage.limit);
            if (next < lastPage.total)
                return next;

            return null;
        }
    });

    document.title = t(`profile.titles.${id}`);

    return (
        <div className="flex-1 px-4 py-4 w-full gap-4 flex flex-col">
            <div className="w-full flex flex-col gap-2 items-start">
                <Button
                    type="text"
                    onClick={() => navigator(-1)}
                >
                    <BiChevronsLeft />
                    {t("buttons.back")}
                </Button>
                <p className="text-title">{t(`profile.titles.${id}`)}</p>
            </div>
            <div className="flex flex-col gap-8 mt-4">
                <Spin loading={status == "pending"}>
                    <div className="flex flex-wrap gap-4 justify-center">
                        {data?.pages?.map((page) =>
                            page.items.map(((item: GameProps | UserProps, i: number) => {
                                switch(id) {
                                    case "subscribers":
                                        return (<User login={(item as UserProps).login} />);
                                    break;
                                    default:
                                        return (<Game dataSource={item as GameProps} />);
                                    break;
                                }
                            }))
                        )}
                    </div>
                </Spin>
                {hasNextPage && (
                    <Button
                        type="second"
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                    >
                        <BiDownArrowAlt size="1.5em" />
                    </Button>
                )}
            </div>
        </div>
    )
}