import React, { useEffect, useReducer, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { User, Button, Spin, Block, Game } from "@/components";

import { UserProps } from "@/types";
import { StoreProps } from "@/stories";
import * as Icons from "@/icons";

import Edit from "./edit";

import fetchAPI, { Routes } from "@/api";
import { users_details, users_favorites, users_games, users_likes, users_subscribe, users_subscribers } from "@/api/routes/users";
import { useModal, useNotify } from "@/hooks";
import { useTranslation } from "react-i18next";
import { user_paths } from "@/routes/user";
import { dashboard_paths } from "@/routes/dashboard";
import { BiAlignLeft, BiDetail, BiUser } from "react-icons/bi";



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
            <div className="w-full px-4 py-4 flex gap-4 flex-col">
                <div className="flex gap-4 flex-col items-center pb-16" key={update}>
                    <div className="w-32 h-32">
                        <User
                            login={login}
                            size="full"
                            nolink
                        />
                    </div>
                    <p className="text title">{data?.login}</p>
                    <div className="profile_header__description">
                        {data?.description?.map(({ type, content }) => {
                            switch(type) {
                                case "main":
                                    return (
                                        <p className="profile_header__description_main text flex items-center gap-2">
                                            <BiDetail />
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
                    <p className="text flex items-center gap-2" key={data?.subscribers}>
                        <BiUser />
                        {data?.subscribers || 0}
                    </p>
                    {token && <div className="flex flex-row gap-4 justify-center items-center">
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
                <div className="flex flex-col gap-4">
                    <Block
                        title={t("games.title")}
                        id="games"
                        request={async (page: number, count: number) => {
                            const search = new URLSearchParams();
                            search.set("offset", String((page - 1) * count));
                            search.set("limit", String(count));

                            const games = await users_games(login, search);
                            const json = await games.json();

                            return {
                                items: json.items.map(item => ({
                                    dataSource: {
                                        id: item.id
                                    }
                                })),
                                total: json.total
                            }
                        }}
                        Component={Game}
                    />
                    <Block
                        title={t("subscribers.title")}
                        id="subscribers"
                        request={async (page: number, count: number) => {
                            const search = new URLSearchParams();
                            search.set("offset", String((page - 1) * count));
                            search.set("limit", String(count));

                            const users = await users_subscribers(login, search);
                            const json = await users.json();

                            return {
                                items: json.items.map(item => ({
                                    login: item.login
                                })),
                                total: json.total
                            }
                        }}
                        Component={User}
                    />
                    <Block
                        title={t("favorites.title")}
                        id="favorites"
                        request={async (page: number, count: number) => {
                            const search = new URLSearchParams();
                            search.set("offset", String((page - 1) * count));
                            search.set("limit", String(count));

                            const games = await users_favorites(login, search);
                            const json = await games.json();

                            return {
                                items: json.items.map(item => ({
                                    dataSource: {
                                        id: item.id
                                    }
                                })),
                                total: json.total
                            }
                        }}
                        Component={Game}
                    />
                    <Block
                        title={t("likes.title")}
                        id="likes"
                        request={async (page: number, count: number) => {
                            const search = new URLSearchParams();
                            search.set("offset", String((page - 1) * count));
                            search.set("limit", String(count));

                            const games = await users_likes(login, search);
                            const json = await games.json();

                            console.log(json);

                            return {
                                items: json.items.map(item => ({
                                    dataSource: {
                                        id: item.id
                                    }
                                })),
                                total: json.total
                            }
                        }}
                        Component={Game}
                    />
                </div>
            </div>
        </Spin>
    );
}

export {
    Edit as ProfileEdit
}