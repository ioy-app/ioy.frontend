import React, { useEffect, useState } from "react";
import GameProps from "./interface";

import "./styles.less";
import { data, NavLink, useNavigate } from "react-router-dom";
import { Routes } from "@/api";
import Spin from "@/components/base/spin";
import { BiError, BiImageAlt } from "react-icons/bi";
import { useTranslation } from "react-i18next";

import { Profile } from "@/icons";

export default function Game({
    dataSource,
    compact=true,
    preview,
    onClick
}: {
    dataSource: GameProps;
    compact?: boolean;
    onClick?: () => void;
    preview?: string;
}) {
    const navigate = useNavigate();
    const [ isLoading, setLoading ] = useState<boolean>(false);
    const [ isError, setError ] = useState<boolean>(false);
    const [ file, setFile ] = useState<string>(null);

    const { t } = useTranslation();

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setError(false);
                setFile(null);

                if (typeof(dataSource?.is_avatar) != "undefined" && !dataSource?.is_avatar)
                    throw new Error();

                const file: Response = await fetch(preview || Routes.games.icon(dataSource.id));
                const resource = await file.blob();

                if (!file.ok)
                    throw new Error();

                setFile(URL.createObjectURL(resource));
            }
            catch(err) { setError(true); }
            finally { setLoading(false); }
        })();
    }, []);

    return (
        <NavLink to={`/g/${dataSource?.id}`}>
            <div
                className={`flex justify-center items-center w-24 h-24 overflow-hidden border bg-white border-gray-200 rounded-xl box-border`}
            >
                <Spin loading={isLoading}>
                    {isError ? (
                        <div className="flex w-full h-full items-center justify-center flex-col gap-2 bg-primary">
                            <img src={Profile} />
                        </div>
                    ) : (
                        <img
                            src={file}
                            onLoad={() => URL.revokeObjectURL(file)}
                            className="h-full aspect-square"
                        />
                    )}
                </Spin>
            </div>
        </NavLink>
    );
}