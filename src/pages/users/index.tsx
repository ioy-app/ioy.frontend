import React, { useEffect, useReducer, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { User, Button, Spin } from "@/components";

import "./styles/index.less";
import { UserProps } from "@/types";
import { StoreProps } from "@/stories";
import * as Icons from "@/icons";

import Games from "./content/games";
import Edit from "./edit";

import fetchAPI, { Routes } from "@/api";
import { users_details, users_subscribe } from "@/api/routes/users";
import { useModal, useNotify } from "@/hooks";
import Subscribers from "./content/subscribers";
import Favorites from "./content/favorites";
import { useTranslation } from "react-i18next";
import Likes from "./content/likes";
import { user_paths } from "@/routes/user";
import { dashboard_paths } from "@/routes/dashboard";



export default function Profile() {
    const { t } = useTranslation();
    const navigator = useNavigate();
    const { token } = useSelector((state: StoreProps) => state.login);
    const params = useParams();
    const [ isLoading, setLoading ] = useState<boolean>(true);
    const [ data, setData ] = useState<UserProps | null>(null);
    const [ update, forceUpdate ] = useReducer((x: number) => x + 1, 0);
    const { login } = params;

    const { notify } = useNotify();

    const handleSubscribe = async () => {
        try {
            if (!data)
                throw new Error("Пользователь не найден");

            const response: Response = await users_subscribe(login);
            const json = await response.json();

            if (!response.ok)
                throw json.msg;

            if (!data.controls)
                throw new Error("Нет авторизации");
            data.controls.is_subscribe = json?.status == "created" ? true : false;
            data.subscribers = data.subscribers + (json?.status == "created" ? 1 : -1);

            notify(t(json?.status == "created" ? "profile.success.subscribe" : "profile.success.unsubscribe", { login }), json?.status == "created" ? "success" : "warning");

            setData(data);
            forceUpdate();
        }
        catch(err) { notify(err?.message?.toString(), "error"); }
    }

    useEffect(() => {
        setLoading(true);
        (async () => {
            try {
                const response = await users_details(login);
                const json = await response.json();
                if (!response.ok)
                    throw json.msg;
                
                setData(json as UserProps);
            }
            catch(err) {
                notify(err?.message?.toString(), "error");
                navigator("/");
            }
            finally { setLoading(false); }
        })();
    }, [ login ]);
    
    return (
        <Spin loading={isLoading}>
            <div className="profile">
                <div className="profile_header" key={update}>
                    <User data={data} />
                    <p className="text title">{data?.login}</p>
                    
                    <div className="profile_header__description">
                        {data?.description?.map(({ type, content }) => {
                            switch(type) {
                                case "main":
                                    return (
                                        <p className="profile_header__description_main text">
                                            {content}
                                        </p>
                                    )
                                break;
                                default: {
                                    const icons = {
                                        "telegram": Icons.SocialTelegram,
                                        "youtube": Icons.SocialYoutube,
                                        "gamejolt": Icons.SocialGameJolt,
                                        "itch": Icons.SocialItch,
                                        "steam": Icons.SocialSteam,
                                        "appstore": Icons.SocialAppStore,
                                        "google-play": Icons.SocialGooglePlay
                                    }
                                    return (
                                        <a
                                            className="profile_header__description_link"
                                            href={content}
                                            target="_blank"
                                        >
                                            <img src={icons[type]} />
                                        </a>
                                    )
                                } break;
                            }
                            
                            return null;
                        })}
                    </div>
                    <p className="text" key={data?.subscribers}>{t("profile.subscribers", { count: data?.subscribers })}</p>
                    {token && <div className="profile_header__controls">
                        {(data?.controls?.is_me) ? (
                            <>
                                <Button
                                    type="second"
                                    htmlType="button"
                                    onClick={() => navigator(dashboard_paths.list)}
                                >
                                    {t("buttons.dashboard")}
                                </Button>
                                <Button
                                    type="primary"
                                    onClick={() => navigator(user_paths.edit(login))}
                                >
                                    {t("buttons.settings")}
                                </Button>
                                
                            </>
                        ) : (
                            <>
                                <Button
                                    onClick={handleSubscribe}
                                    type={data?.controls?.is_subscribe ? "danger" : "second"}
                                >
                                    {!data?.controls?.is_subscribe ? t("buttons.subscribe") : t("buttons.unsubscribe")}
                                </Button>
                                
                            </>
                        )}
                    </div>}
                </div>
                <div className="profile_body">
                    <Games />
                    <Subscribers />
                    <Favorites />
                    <Likes />
                </div>
            </div>
        </Spin>
    );
}

export {
    Edit as ProfileEdit
}