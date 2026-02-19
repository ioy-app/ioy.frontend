import confStatus from "../dashboard/status.json";

import { Routes } from "@/api";
import { games_create, games_delete, games_details, games_edit } from "@/api/routes/games";
import { Button, Code, File, Game, Input, Player, Select, Spin, Tag, Textarea } from "@/components";
import { useModal, useNotify } from "@/hooks";
import { paths } from "@/routes";
import { dashboard_paths } from "@/routes/dashboard";
import GameProps from "@/types/game";
import { useEffect, useMemo, useRef, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { BiChevronsLeft, BiX } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";

export default function Edit() {
    const params = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [ isLoading, setLoading ] = useState<boolean>(true);
    const { notify } = useNotify();
    const { modal } = useModal();

    const isCreate: boolean = Boolean(typeof(params.id) == "undefined");

    const methods = useForm();
    const handleSubmit = async (data: FormData) => {
        try {
            setLoading(true);
            const isCreate = typeof(params?.id) == "undefined";
            let response;
            if (isCreate) {
                response = await games_create({
                    ...data,
                    icon: data?.icon?.[0],
                    game: data?.game?.[0],
                    tags: data?.tags || []
                });
            } else {
                response = await games_edit(params?.id, {
                    ...data,
                    icon: data?.icon?.[0],
                    game: data?.game?.[0],
                    tags: data?.tags || []
                });
            }

            if (isCreate)
                navigate(paths.games.edit(response.id));
        }
        catch(err) { notify(err); }
        finally { setLoading(false); }
    }

    const handleVerify = async () => {
        notify(t("games.notify.delete_success"), "success");
        navigate(-1, { replace: true });
    }

    const handleDelete = async () => {
        modal(
            t("games.warnings.delete"),
            (onClose: () => void) => (
                <>
                    <Button
                        variant="clear"
                        onClick={() => onClose()}
                        disabled={isLoading}
                    >
                        {t("buttons.cancel")}
                    </Button>
                    <Button
                        variant="danger"
                        disabled={isLoading}
                        onClick={async (e) => {
                            setLoading(true);
                            
                            try {
                                const response = await games_delete(Number(params.id));
                                onClose();
                                
                                modal(
                                    "",
                                    (onClosed: () => void) => <Code
                                        onSubmit={data => {
                                            handleVerify(data);
                                            onClosed();
                                        }}
                                        onCancel={() => onClosed()}
                                    />
                                );
                            }
                            finally { setLoading(false); }
                        }}>
                        {t("buttons.delete")}
                    </Button>
                    
                </>
            )
        )
    }

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                
                if (!isCreate) {
                    const id: number = Number(params.id);
                    const response = await games_details(id);

                    for (const [ key, value ] of Object.entries(response))
                        methods.setValue(key, value);
                }
            }
            catch(err) {
                notify(t("games.errors.exists"), "error");
                navigate("/", { replace: true });
            }
            finally { setLoading(false); }
        })();
    }, [ params?.id ]);

    const icon = methods.watch("icon");
    const game = methods.watch("game");

    const handlePreviewIcon = useMemo(() => {
        if (icon && icon.length > 0)
            return URL.createObjectURL(icon[0]);

        return null;
    }, [ icon ]);

    const handlePreviewGame = useMemo(() => {
        if (game && game.length > 0)
            return URL.createObjectURL(game[0]);

        return null;
    }, [ game ]);
    

    const refPreviewIcon = useRef<string | null>(null);
    const refPreviewGame = useRef<string | null>(null);

    useEffect(() => {
        if (refPreviewIcon.current)
            URL.revokeObjectURL(refPreviewIcon.current);
        if (refPreviewGame.current)
            URL.revokeObjectURL(refPreviewGame.current);
        

        refPreviewIcon.current = handlePreviewIcon;
        refPreviewGame.current = handlePreviewGame;
    }, [ refPreviewIcon, refPreviewGame ]);

    const title = methods.watch("title");
    const id = methods.watch("id");
    const tags = methods.watch("tags") || [];

    return (
        <FormProvider {...methods}>
            <Spin loading={isLoading}>
                <form
                    onSubmit={methods.handleSubmit(handleSubmit)}
                    style={{
                        display: "flex",
                        justifyContent: "center"
                    }}
                    className="w-full"
                >
                    <div className="w-[65%] max-lg:w-full flex flex-col gap-4 items-start">
                        <div className="w-full flex flex-col gap-2 items-start mb-8">
                            <Button
                                variant="text"
                                onClick={() => navigate(-1)}
                            >
                                <BiChevronsLeft />
                                {t("buttons.back")}
                            </Button>
                            <p className="text-title">{isCreate ? t("games.titles.create") : t("games.titles.edit", { title })}</p>
                        </div>
                        <div className="flex w-full justify-center">
                            <label className="flex flex-col justify-center gap-4 items-center p-4 border-4 border-dotted border-br rounded-2xl cursor-pointer">
                                <div className="w-32 h-32">
                                    <Game
                                        dataSource={{
                                            id
                                        } as GameProps}
                                        size="full"
                                        preview={handlePreviewIcon}
                                        nolink
                                    />
                                </div>
                                <p className="text-placeholder">{t("games.labels.icon")}</p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    {...methods.register("icon")}
                                    className="hidden"
                                    
                                />
                            </label>
                        </div>
                        <Input
                            placeholder={t("games.placeholders.title")}
                            label={t("games.labels.title")}
                            {...methods.register("title")}
                        />
                        <Input
                            placeholder={t("games.placeholders.version")}
                            label={t("games.labels.version")}
                            {...methods.register("version")}
                        />
                        <Textarea
                            placeholder={t("games.placeholders.description")}
                            label={t("games.labels.description")}
                            {...methods.register("description")}
                        />
                        <div className="flex w-full flex-col gap-4">
                            <Input
                                name="tags"
                                placeholder={t("games.placeholders.tags")}
                                label={t("games.labels.tags")}
                                onChange={({ target: { value }}) => {
                                    console.log(value);
                                }}
                                onKeyPress={(e) => {
                                    if (e.key == "Enter" || e.key == ",") {
                                        if (e.target.value.trim()) {
                                            tags.push(e.target.value);
                                            e.target.value = "";
                                            methods.setValue("tags", tags);
                                        }
                                        e.preventDefault();
                                    }
                                }}
                            />
                            <div className="flex flex-row gap-4 flex-wrap">
                                {tags?.map((tag: string, i: number) => (
                                    <span
                                        className="pr-2 border border-br rounded-xl cursor-pointer flex gap-2 items-center"
                                        onClick={() => {
                                            methods.setValue("tags", tags.filter((t: string) => t != tag));
                                        }}
                                    >
                                        <Tag
                                            title={tag}
                                            key={i}
                                        />
                                        <BiX className="text-2xl"/>
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="flex w-full justify-center flex-col gap-4">
                            <Player
                                gameId={id}
                                src={handlePreviewGame}
                                key={handlePreviewGame}
                            />
                            <label className="w-full flex flex-col justify-center gap-4 items-center p-4 border-4 border-dotted border-br rounded-2xl cursor-pointer">
                                
                                <p className="text-placeholder">{t("games.labels.game")}</p>
                                <input
                                    type="file"
                                    {...methods.register("game")}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        <div className="flex gap-4 items-center justify-between w-full">
                            <Select
                                options={confStatus.filter(record => record.value != "all").map(record => ({
                                    ...record,
                                    label: t(record.label)
                                }))}
                                {...methods.register("status")}
                            />
                            <Button
                                variant="primary"
                                htmlType="submit"
                            >
                                {t("buttons.save")}
                            </Button>
                        </div>
                        {!isCreate && (
                            <div className="w-full mt-20 mb-5 flex flex-col">
                                <Button
                                    variant="danger"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleDelete();
                                    }}
                                >
                                    {t("buttons.delete")}
                                </Button>
                            </div>
                        )}
                    </div>
                </form>
            </Spin>
        </FormProvider>
    );
}