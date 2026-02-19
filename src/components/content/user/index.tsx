import React, { useEffect, useState } from "react";
import { Profile } from "@/icons";
import { NavLink, useNavigate } from "react-router-dom";
import { Routes } from "@/api";
import { users_details } from "@/api/routes/users";
import { useNotify } from "@/hooks";
import Spin from "../../base/spin";
import { paths } from "@/routes";
import { useQuery } from "@tanstack/react-query";
import { UserProps } from "@/types";

const User: React.FC<{
    /** Логин */
    login?: string;
    /** Предпросмотр изображения */
    preview?: string;
    size?: number | string;
    nolink?: boolean;
    className?: string;
    dataSource?: UserProps;
    ref?: React.Ref<HTMLDivElement>;
    onClick?: (login: string) => void;
}> = ({
    login,
    preview,
    nolink,
    size=24,
    className,
    dataSource,
    ref,
    onClick
}) => {
    const {
        status,
        data,
        isError
    } = useQuery({
        queryKey: ["avatar", login, preview],
        queryFn: async () => {
            if (!dataSource?.is_avatar)
                return null;

            if (preview) {
                const file = await fetch(preview);
                if (!file.ok)
                    throw new Error();

                const resource = await file.blob();
                return URL.createObjectURL(resource);
            }

            return `/api/v1${Routes.users.avatar(login)}`;

            const file = await fetch(preview || Routes.users.avatar(login));
            
            if (!file.ok)
                throw new Error();

            const resource = await file.blob();
            return URL.createObjectURL(resource);
        },
        retry: false
    });

    const root = (
        <div
            className={`group flex flex-col items-center gap-1 max-w-${size} w-${size} overflow-hidden ${className && className || ""}`}
            key={`user-${login}-${size}`}
            ref={ref}
            onClick={() => onClick && nolink && onClick(login)}
        >
            <div className={`w-${size} h-${size} rounded-full overflow-hidden aspect-square border border-br ${!nolink && "group-hover:border-primary transition-colors" || ""}`}>
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
            {dataSource?.login && <p className={`max-w-${size} overflow-hidden text-placeholder wrap-break-word line-clamp-2 text-center ... group-hover:text-primary transition-colors`}>{dataSource.login}</p>}
        </div>
    )

    return (
        !nolink ? (
            <NavLink to={`/u/${login}`} className={`w-fit`}>
                {root}
            </NavLink>
        ) : root
    );
}

export default User;