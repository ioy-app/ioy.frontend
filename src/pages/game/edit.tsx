import confStatus from "../dashboard/status.json";

import { Routes } from "@/api";
import { games_create, games_details } from "@/api/routes/games";
import { Button, File, Game, Input, Select, Spin } from "@/components";
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
                tags: data?.tags && data?.tags?.split(", ") || []
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

    return (
        <FormProvider {...methods}>
            <Spin loading={isLoading}>
                <form onSubmit={methods.handleSubmit(handleSubmit)}>
                    <div className="gamepage">
                        <div className="gamepage_header">
                            <p className="text title">{isCreate ? t("games.titles.create") : title}</p>
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
                            <img
                                src={handlePreviewIcon || Routes.games.icon(id)}
                                className="icon preview"
                            />
                            <File
                                label="Icon"
                                {...methods.register("icon")}
                            />
                            <Input
                                placeholder="Title"
                                {...methods.register("title")}
                            />
                            <Input
                                placeholder="Version"
                                {...methods.register("version")}
                            />
                            <Input
                                placeholder="Description"
                                {...methods.register("description")}
                            />
                            <Input
                                placeholder="Tags"
                                {...methods.register("tags")}
                            />
                            <iframe
                                src={handlePreviewGame || `/api/v1/games/${id}/game`}
                                className="gamepage_body__game preview"
                                allowFullScreen
                            />
                            <File
                                label="Game Resources"
                                {...methods.register("game")}
                            />
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
                </form>
            </Spin>
        </FormProvider>
    );
}