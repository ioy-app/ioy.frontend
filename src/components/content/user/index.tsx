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
    dataSource?: UserProps
}> = ({
    login,
    preview,
    nolink,
    size=24,
    className,
    dataSource
}) => {
    const {
        status,
        data,
        isError
    } = useQuery({
        queryKey: ["avatar", login, preview],
        queryFn: async () => {
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
            className={`group flex flex-col gap-4 w-${size} ${className}`}
            key={`user-${login}-${size}`}
        >
            <div className={`user flex justify-center items-center w-${size} h-${size} overflow-hidden border bg-white border-gray-200 rounded-xl box-border`}>
                <Spin loading={status == "pending"}>
                    {(isError || !data) ? (
                        <div className={`flex w-${size} h-${size} items-center justify-center flex-col gap-2 bg-second`}>
                            <img src={Profile} className="h-full aspect-square" />
                        </div>
                    ) : (
                        <img
                            src={data}
                            className="h-full aspect-square"
                        />
                    )}
                </Spin>
            </div>
            {dataSource?.login && <p className="text text-wrap text-center text-xs text-gray-500 group-hover:text-gray-800 wrap-anywhere line-clamp-2 ...">{dataSource.login}</p>}
        </div>
    )

    return (
        !nolink ? (
            <NavLink to={`/u/${login}`}>
                {root}
            </NavLink>
        ) : root
    );
}

export default User;