import GameProps from "@/types/game";

import { NavLink } from "react-router-dom";
import { Routes } from "@/api";
import Spin from "@/components/base/spin";
import { Profile } from "@/icons";
import { useQuery } from "@tanstack/react-query";

const Game: React.FC<{
    /** Game data */
    dataSource: GameProps;
    /** Preview game's avatar */
    preview?: string;
    /** Disabled link */
    nolink?: boolean;
    /** Avatar size */
    size?: number | string;
}> = ({
    dataSource,
    preview,
    nolink,
    size=24
}) => {
    const {
        status,
        data,
        isError
    } = useQuery({
        queryKey: ["game", dataSource, preview],
        queryFn: async () => {
            if (typeof(dataSource?.is_avatar) != "undefined" && !dataSource?.is_avatar)
                    throw new Error();

            const file =await fetch(preview || Routes.games.icon(dataSource.id));
            
            if (!file.ok)
                throw new Error();

            const resource = await file.blob();
            return URL.createObjectURL(resource);
        },
        retry: false
    });

    const root = (
        <div className={`group flex flex-col items-center gap-1 max-w-${size} overflow-hidden`}>
            <div className={`w-full h-${size} rounded-xl overflow-hidden aspect-square border border-br ${!nolink && "group-hover:border-primary transition-colors" || ""}`}>
                <Spin loading={status == "pending"}>
                    {(isError || !data) ? (
                        <div className="flex w-full h-full items-center justify-center flex-col gap-2 bg-primary">
                            <img src={Profile} />
                        </div>
                    ) : (
                        <img
                            src={data}
                            className="w-full h-full"
                        />
                    )}
                </Spin>
                
            </div>
            {dataSource?.title && <p className={`max-w-${size} overflow-hidden text-placeholder wrap-anywhere line-clamp-2 text-center ... group-hover:text-primary transition-colors`}>{dataSource.title}</p>}
        </div>
    );

    return (
        !nolink ? (
            <NavLink to={`/g/${dataSource?.id}`} className={`w-${size}`}>
                {root}
            </NavLink>
        ) : root
    );
}

export default Game;