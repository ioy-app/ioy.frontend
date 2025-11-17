import React, { useEffect, useState } from "react";
import "./styles.less";
import { Profile } from "../../icons";
import { useNavigate } from "react-router-dom";
import { Routes } from "@/api";
import { users_details } from "@/api/routes/users";
import { useNotify } from "@/hooks";
import Spin from "../spin";
import { paths } from "@/routes";

const User: React.FC<{
    /** Логин */
    login?: string;
    /** Ссылка на страницу профиля */
    link?: boolean;
    /** Компактный режим (Без логина) */
    compact?: boolean;
    /** Предпросмотр изображения */
    preview?: FileList;
    /** Callback-функция при клике */
    onClick?: () => void;
    /** Объект с данными о пользователе */
    data?: any;
}> = ({
    login,
    link,
    compact=true,
    preview,
    onClick,
    data
}) => {
    const navigator = useNavigate();
    const { notify } = useNotify();

    const [ isLoading, setLoading ] = useState<boolean>(true);
    const [ isAvatar, setAvatar ] = useState<boolean>(false);
    const [ localLogin, setLogin ] = useState<string | null>(login);

    const handleError = () => setAvatar(false);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setAvatar(false);

                if (data) {
                    setAvatar(data?.is_avatar);
                    setLogin(data?.login);
                }

                if (!login)
                    return;

                const response = await users_details(login);
                const json = await response.json();

                if (!response.ok)
                    throw json?.msg;

                setAvatar(json?.is_avatar);
                setLogin(json?.login);
            }
            catch(err) { notify(err?.message?.toString()); }
            finally { setLoading(false); }
        })();
    }, [ login, data ]);

    return (
        <div
            className={`user ${link && "link" || ""} ${compact && "compact" || ""}`}
            onClick={() => {
                onClick && onClick();
                if (link)
                    navigator(paths.users.details(localLogin));
            }}
        >
            <div className="user_avatar">
                <Spin loading={isLoading}>
                    <img
                        src={preview ? preview : (isAvatar ? Routes.users.avatar(localLogin) : Profile)}
                        onError={handleError}
                    />
                </Spin>
            </div>
            {!compact && <p className="user_login">{localLogin}</p>}
        </div>
    );
}

export default User;