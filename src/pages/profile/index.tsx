import React, { useEffect, useReducer, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { User, Button } from "@/components";

import "./styles.less";
import { UserProps } from "@/types";
import { StoreProps } from "@/store";
import * as Icons from "@/icons";

import Games from "./games";
import Edit from "./edit";

import fetchAPI, { Routes } from "@/api";
import { users_details, users_subscribe } from "@/api/routes/users";



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

            setData(data);

            forceUpdate();
        }
        catch(err) {
            console.log(err);
        }
    }

    

    useEffect(() => {
        setLoading(true);
        (async () => {
            try {
                const response = await users_details(login);

                
                if (!response.ok) {
                    const json = await response.json();
                    throw json.msg;
                }

                const json: UserProps = await response.json();
                setData(json);
            }
            catch(err) {
                console.log(err);
            }
            finally {
                setLoading(false);
            }
        })();
    }, [ login, token ]);

    if (isLoading)
        return (
            <p>Загрузка...</p>
        );

    if (!data)
        return (
            <p>Пользователя не существует</p>
        );
    
    return (
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
                            <Button type="second">
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
            </div>
        </div>
    );
}

export {
    Edit as ProfileEdit
}