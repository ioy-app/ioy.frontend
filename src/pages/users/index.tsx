import React, { useEffect, useReducer, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { User, Button, Spin, Block, Game, LinkifyText } from "@/components";

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
import { BiAlignLeft, BiCog, BiDetail, BiSitemap, BiUser } from "react-icons/bi";


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
                <div className="flex gap-4 flex-col items-center pb-4" key={update}>
                    <div className="w-32 h-32">
                        <User
                            login={login}
                            size="full"
                            nolink
                        />
                    </div>
                    <p className="text-title">{data?.login}</p>
                    <p className="text-default flex items-center gap-2" key={data?.subscribers}>
                        <BiUser />
                        {data?.subscribers || 0}
                    </p>
                    {data?.description && (
                        <p className="w-[60%] max-md:w-full text-default flex flex-wrap justify-center items-center gap-2 border border-br p-4 rounded-xl">
                            <LinkifyText className="flex justify-center items-center text-default">
                                {data?.description}
                            </LinkifyText>
                        </p>
                    )}
                    {token && <div className="flex flex-row gap-4 justify-center items-center">
                        {(data?.controls?.is_me) ? (
                            <>
                                <Button
                                    variant="default"
                                    htmlType="button"
                                    onClick={() => navigator(dashboard_paths.list)}
                                >
                                    <BiSitemap />
                                    {t("buttons.dashboard")}
                                </Button>
                                <Button
                                    variant="default"
                                    onClick={() => navigator(user_paths.edit(login))}
                                >
                                    <BiCog />
                                    {t("buttons.settings")}
                                </Button>
                                
                            </>
                        ) : (
                            <>
                                <Button
                                    onClick={handleSubscribe}
                                    variant={data?.controls?.is_subscribe ? "second" : "primary"}
                                >
                                    {!data?.controls?.is_subscribe ? t("buttons.subscribe") : t("buttons.unsubscribe")}
                                </Button>
                                
                            </>
                        )}
                    </div>}
                </div>
                <div className="flex flex-col md:grid gap-4">
                    <div className="flex flex-col md:grid gap-4 md:grid-cols-[repeat(auto-fit,minmax(500px,1fr))]">
                        <Block
                            title={t("profile.titles.games")}
                            id="games"
                            request={async (page: number, count: number) => {
                                const search = new URLSearchParams();
                                search.set("offset", String((page - 1) * count));
                                search.set("limit", String(count));

                                const games = await users_games(login, search);
                                const json = await games.json();

                                return {
                                    items: json.items.map(item => ({
                                        dataSource: item
                                    })),
                                    total: json.total
                                }
                            }}
                            Component={Game}
                        />
                        <Block
                            title={t("profile.titles.subscribers")}
                            id="subscribers"
                            request={async (page: number, count: number) => {
                                const search = new URLSearchParams();
                                search.set("offset", String((page - 1) * count));
                                search.set("limit", String(count));

                                const users = await users_subscribers(login, search);
                                const json = await users.json();

                                return {
                                    items: json.items.map(item => ({
                                        login: item.login,
                                        dataSource: item
                                    })),
                                    total: json.total
                                }
                            }}
                            Component={User}
                        />
                    </div>
                    <div className="flex flex-col md:grid gap-4 md:grid-cols-[repeat(auto-fit,minmax(500px,1fr))]">
                        <Block
                            title={t("profile.titles.favorites")}
                            id="favorites"
                            request={async (page: number, count: number) => {
                                const search = new URLSearchParams();
                                search.set("offset", String((page - 1) * count));
                                search.set("limit", String(count));

                                const games = await users_favorites(login, search);
                                const json = await games.json();

                                return {
                                    items: json.items.map(item => ({
                                        dataSource: item
                                    })),
                                    total: json.total
                                }
                            }}
                            Component={Game}
                        />
                        <Block
                            title={t("profile.titles.likes")}
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
                                        dataSource: item
                                    })),
                                    total: json.total
                                }
                            }}
                            Component={Game}
                        />
                    </div>
                </div>
            </div>
        </Spin>
    );
}

export {
    Edit as ProfileEdit
}