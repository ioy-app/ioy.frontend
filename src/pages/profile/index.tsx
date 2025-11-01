import React, { useEffect, useReducer, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { User, Button, Spin } from "@/components";

import "./styles/index.less";
import { UserProps } from "@/types";
import { StoreProps } from "@/store";
import * as Icons from "@/icons";

import Games from "./content/games";
import Edit from "./edit";

import fetchAPI, { Routes } from "@/api";
import { users_details, users_subscribe } from "@/api/routes/users";
import { useNotify } from "@/hooks";
import Subscribers from "./content/subscribers";
import Favorites from "./content/favorites";



export default function Profile() {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigator = useNavigate();
    const { token } = useSelector((state: StoreProps) => state.login);
    const params = useParams();
    const [ isLoading, setLoading ] = useState<boolean>(true);
    const [ isEdit, setEdit ] = useState<boolean>(location.pathname.includes("edit"));
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

            notify(json?.status == "created" ? "Вы подписались" : "Вы отписались", json?.status == "created" ? "success" : "warning");

            setData(data);
            forceUpdate();
        }
        catch(err) { notify(err.toString(), "error"); }
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
                console.log(json);
            }
            catch(err) { notify(err.toString(), "error"); }
            finally { setLoading(false); }
        })();
    }, [ login, token ]);
    
    return (
        <Spin loading={isLoading}>
            <div className="profile">
                <div className="profile_header" key={update}>
                    <User dataSource={data}/>
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
                    <p className="text">{data?.subscribers} подписчиков</p>
                    {token && <div className="profile_header__controls">
                        {(data?.controls?.is_me) ? (
                            <>
                                <Button
                                    type="second"
                                    htmlType="button"
                                    onClick={() => {
                                        notify("Test!!!!", "info");
                                    }}
                                >
                                    Новая игра
                                </Button>
                                
                                <Button
                                    type="primary"
                                    onClick={() => navigator(`/u/${login}/edit`)}
                                >
                                    Настройки
                                </Button>
                                <Button>
                                    Статистика
                                </Button>
                                
                            </>
                        ) : (
                            <>
                                <Button
                                    onClick={handleSubscribe}
                                    type={data?.controls?.is_subscribe ? "danger" : "second"}
                                >
                                    {data?.controls?.is_subscribe ? "Отписаться" : "Подписаться"}
                                </Button>
                                
                            </>
                        )}
                    </div>}
                </div>
                <div className="profile_body">
                    <Games />
                    <Subscribers />
                    <Favorites />
                </div>
            </div>
        </Spin>
    );
}

export {
    Edit as ProfileEdit
}