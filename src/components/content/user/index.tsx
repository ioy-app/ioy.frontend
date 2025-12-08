import React, { useEffect, useState } from "react";
import { Profile } from "@/icons";
import { NavLink, useNavigate } from "react-router-dom";
import { Routes } from "@/api";
import { users_details } from "@/api/routes/users";
import { useNotify } from "@/hooks";
import Spin from "../../base/spin";
import { paths } from "@/routes";

const User: React.FC<{
    /** Логин */
    login?: string;
    /** Предпросмотр изображения */
    preview?: string;
    /** Объект с данными о пользователе */
    data?: any;
    size?: number | string;
    nolink?: boolean;
    className?: string;
}> = ({
    login,
    preview,
    data,
    nolink,
    size=24,
    className
}) => {
    const [ isLoading, setLoading ] = useState<boolean>(true);
    const [ isError, setError ] = useState<boolean>(false);
    const [ file, setFile ] = useState<string>(null);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setError(false);
                setFile(null);

                if (typeof(data?.is_avatar) != "undefined" && !data?.is_avatar)
                    throw new Error();

                const file: Response = await fetch(preview || Routes.users.avatar(login));
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
        <NavLink to={!nolink && `/u/${login}`}>
            <div
                className={`user flex justify-center items-center w-${size} h-${size} overflow-hidden border bg-white border-gray-200 rounded-xl box-border ${className}`}
                key={`user-${login}-${size}`}
            >
                <Spin loading={isLoading}>
                    {isError ? (
                        <div className={`flex w-full h-full items-center justify-center flex-col gap-2 bg-second`}>
                            <img src={Profile} className="h-full aspect-square" />
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

export default User;