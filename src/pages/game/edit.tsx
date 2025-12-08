import confStatus from "../dashboard/status.json";

import { Routes } from "@/api";
import { games_create, games_details } from "@/api/routes/games";
import { Button, File, Game, Input, Player, Select, Spin, Textarea } from "@/components";
import { useNotify } from "@/hooks";
import { dashboard_paths } from "@/routes/dashboard";
import { useEffect, useMemo, useRef, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

export default function Edit() {
    const params = useParams();
    const navigator = useNavigate();
    const { t } = useTranslation();
    const [ isLoading, setLoading ] = useState<boolean>(true);
    const { notify } = useNotify();

    const isCreate: boolean = Boolean(typeof(params.id) == "undefined");

    const methods = useForm();
    const handleSubmit = async (data: FormData) => {
        try {
            setLoading(true);
            const response = await games_create({
                ...data,
                icon: data?.icon?.[0],
                game: data?.game?.[0],
                tags: data?.tags || []
            });
            const json = await response.json();

            if (!response.ok)
                throw json?.msg;

            console.log(json);
        }
        catch(err) { notify(err); }
        finally { setLoading(false); }
    }

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                
                if (!isCreate) {
                    const id: number = Number(params.id);
                    const response = await games_details(id);
                    const json = await response.json();

                    if (!response.ok)
                        throw json?.msg;

                    for (const [ key, value ] of Object.entries(json))
                        methods.setValue(key, value);
                }
            }
            catch(err) {

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
    const tags = methods.watch("tags");

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
                    <div className="wp_content half">
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                gap: "var(--size-gap)",
                                alignItems: "flex-start"
                            }}
                        >
                            <p className="text title">{isCreate ? t("games.titles.create") : t("games.titles.edit", { title })}</p>
                            <div>
                                <Button
                                    type="primary"
                                    onClick={() => navigator(-1)}
                                >
                                    {t("buttons.back")}
                                </Button>
                            </div>
                        </div>
                        <div className="gamepage_body">
                            <div
                                style={{
                                    display: "flex",
                                    gap: "var(--size-gap)"
                                }}
                            >
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
                            </div>
                            <File
                                label={t("games.labels.icon")}
                                {...methods.register("icon")}
                            />
                            <div
                                style={{
                                    display: "flex",
                                    gap: "var(--size-gap)",
                                    flexWrap: "wrap"
                                }}
                            >
                                <label>
                                    <img
                                        src={handlePreviewIcon || Routes.games.icon(id)}
                                        className="icon preview"
                                        style={{
                                            width: "256px",
                                            height: "256px",
                                            borderRadius: "var(--size-border-radius)"
                                        }}
                                    />
                                    <p className="text">256x256</p>
                                </label>
                                <label>
                                    <img
                                        src={handlePreviewIcon || Routes.games.icon(id)}
                                        className="icon preview"
                                        style={{
                                            width: "128px",
                                            height: "128px",
                                            borderRadius: "var(--size-border-radius)"
                                        }}
                                    />
                                    <p className="text">128x128</p>
                                </label>
                                <label>
                                    <img
                                        src={handlePreviewIcon || Routes.games.icon(id)}
                                        className="icon preview"
                                        style={{
                                            width: "64px",
                                            height: "64px",
                                            borderRadius: "var(--size-border-radius)"
                                        }}
                                    />
                                    <p className="text">64x64</p>
                                </label>
                            </div>
                            <Textarea
                                placeholder={t("games.placeholders.description")}
                                label={t("games.labels.description")}
                                {...methods.register("description")}
                            />
                            <div>
                                <Input
                                    placeholder={t("games.placeholders.tags")}
                                    label={t("games.labels.tags")}
                                    onChange={({ target: { value }}) => {
                                        console.log(value);
                                    }}
                                    onKeyPress={e => {
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
                                <div
                                    className="gamepage_body__tags"
                                    style={{
                                        paddingTop: "var(--size-padding)"
                                    }}
                                >
                                    {tags?.map((tag: string, i: number) => (
                                        <p
                                            key={i}
                                            className="gamepage_body__tags_tag"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => {
                                                methods.setValue("tags", tags.filter(t => t != tag));
                                            }}
                                        >
                                            {tag}
                                            <span style={{ paddingLeft: "var(--size-padding)"}}>x</span>
                                        </p>
                                    ))}
                                </div>
                            </div>
                            <File
                                label={t("games.labels.game")}
                                {...methods.register("game")}
                            />
                            <Player
                                gameId={id}
                                src={handlePreviewGame}
                            />
                            <div className="wp_control">
                                <Select
                                    options={confStatus.filter(record => record.value != "all").map(record => ({
                                        ...record,
                                        label: t(record.label)
                                    }))}
                                    {...methods.register("status")}
                                />
                                <Button
                                    type="second"
                                    htmlType="submit"
                                >
                                    {t("buttons.save")}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </Spin>
        </FormProvider>
    );
}