import { games_details, games_like, games_subscribe } from "@/api/routes/games";
import { Button, Game, LinkifyText, Player, Spin, Tag, User } from "@/components";
import GameProps from "@/types/game";
import { useModal, useNotify } from "@/hooks";
import { UserProps } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { BiBookmark, BiChevronsLeft, BiCopyAlt, BiHeart, BiMessageError, BiShare } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";
import Comments from "./comments";

export default function GamePage() {
    const params = useParams();
    const id = params?.id;
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { notify } = useNotify();
    const { modal } = useModal();
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: [ "games", id ],
        queryFn: async () => {
            const response = await games_details(Number(id)).then(e => e.json());
            return response;
        }
    });

    const like = useMutation({
        mutationFn: async () => {
            const response = await games_like(Number(id)).then(e => e.json());
            return response;
        },
        onError: err => notify(t(err.toString()), "error"),
        onSuccess: data => {
            const is_like = data?.status == "liked";
            notify(t(`notify.${is_like ? "like" : "unlike"}`), is_like ? "success" : "warning");
            queryClient.setQueryData(["games", id], (current: GameProps) => ({
                ...current,
                is_like
            }));
        }
    });

    const subscribe = useMutation({
        mutationFn: async () => {
            const response = await games_subscribe(Number(id)).then(e => e.json());
            return response;
        },
        onError: err => notify(t(err.toString()), "error"),
        onSuccess: data => {
            const is_subscribe = data?.status == "created";
            notify(t(`notify.${is_subscribe ? "subscribe" : "unsubscribe"}`), is_subscribe ? "success" : "warning");
            queryClient.setQueryData(["games", id], (current: GameProps) => ({
                ...current,
                is_subscribe
            }));
        }
    });

    const report = () => {

    }

    const repost = () => {
        const url = window.location.href;
        modal(
            () => (
                <div className="flex flex-col gap-2 w-full items-center">
                    <Game
                        dataSource={{
                            id
                        } as any}
                        nolink
                    />
                    <p className="text-title">{query?.data?.title}</p>
                    <p className="text-default max-w-xl line-clamp-2 text-center ...">{query?.data?.description}</p>
                    <p className="w-full text-placeholder">{t("games.labels.repost.link")}</p>
                    <div className="text-default p-4 w-full rounded-xl border border-br flex flex-row gap-4 justify-between items-center text-text">
                        <p>{url}</p>
                        <BiCopyAlt />
                    </div>
                </div>
            ),
            (onClose) => (
                <div className="flex w-full pt-4 justify-end items-center">
                    <Button
                        variant="primary"
                        onClick={() => onClose()}
                    >
                        {t("buttons.ok")}
                    </Button>
                </div>
            ) 
        );
    }

    return (
        <Spin loading={query?.status == "pending"} key={id}>
            <div className="w-full flex flex-col gap-4 items-center">
                <div className="w-[65%] max-lg:w-full flex flex-col gap-4 items-start">
                    <Button
                        variant="text"
                        onClick={() => navigate(-1)}
                    >
                        <BiChevronsLeft />
                        {t("buttons.back")}
                    </Button>
                    <div className="flex gap-4 items-center h-12">
                        <Game
                            dataSource={{
                                id: Number(id)
                            } as any}
                            size={12}
                            nolink
                        />
                        <h1 className="text-title">{query?.data?.title}</h1>
                        {query?.data?.version && <span className="border px-4 py-1 font-light font-roboto rounded-xl border-gray-200">{query?.data?.version}</span>}
                    </div>
                    <Player gameId={Number(id)} />
                    <div className="flex gap-4 w-full justify-end items-center">
                        <Button
                            variant={query?.data?.is_like && "second" || "default"}
                            onClick={() => like.mutate()}
                            disabled={like.isPending}
                            loading={like.isPending}
                        >
                            <BiHeart />
                        </Button>
                        <Button
                            variant={query?.data?.is_subscribe && "second" || "default"}
                            onClick={() => subscribe.mutate()}
                            disabled={subscribe.isPending}
                            loading={subscribe.isPending}
                        >
                            <BiBookmark />
                        </Button>
                        <Button
                            onClick={() => repost()}
                        >
                            <BiShare />
                        </Button>
                        <Button variant="default">
                            <BiMessageError />
                        </Button>
                    </div>
                    <div className="flex gap-4 w-full">
                        <div className="flex flex-col gap-2 w-fit">
                            <p className="text-placeholder">{t("games.labels.authors")}</p>
                            <div className="flex flex-col gap-4 w-fit border border-br rounded-xl p-4 h-fit">
                                {query?.data?.authors_data?.map((author: UserProps, i: number) => (
                                    <User
                                        login={author?.login}
                                        dataSource={author}
                                        key={i}
                                        size={12}
                                        className="flex-row w-fit gap-4"
                                    />
                                ))}
                            </div>
                        </div>
                        {query?.data?.description && (
                            <div className="flex flex-col gap-2 w-full">
                                <p className="text-placeholder">{t("games.labels.description")}</p>
                                <div className="p-4 border border-br rounded-xl flex flex-col gap-4 w-full">
                                    <LinkifyText>{query?.data?.description}</LinkifyText>
                                    <div className="flex flex-row flex-wrap gap-4">
                                        {query?.data?.tags?.map((tag: string, i: number) => <Tag title={tag} key={i} />)}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-1 w-full items-end text-placeholder">
                        <p>{dayjs(query?.data?.date_created).format("HH:mm DD.MM.YYYY")}</p>
                        {query?.data?.date_updated && <p>{t("games.labels.edited")}: {dayjs(query?.data?.date_updated).format("HH:mm DD.MM.YYYY")}</p>}
                    </div>
                    {query?.data?.recomendator?.length > 0 && (
                        <div className="flex flex-col gap-2 w-full">
                            <p className="text-placeholder">{t("games.labels.recomends")}</p>
                            <div className="flex flex-row flex-wrap gap-4 p-4 border border-br rounded-xl w-full">
                                {query?.data?.recomendator?.map((game: GameProps, i: number) => <Game dataSource={game} key={i} />)}
                            </div>
                        </div>
                    )}
                    <Comments />
                </div>
            </div>
        </Spin>
    );
}