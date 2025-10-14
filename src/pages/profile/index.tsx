import React, { useEffect, useReducer, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { User, Button } from "@/components";

import "./styles.less";


import { clearLogin } from "../../store/login";


export default function Profile() {
    const dispatch = useDispatch();
    const navigator = useNavigate();
    const { token } = useSelector(state => state?.login);
    const params = useParams();
    const [ isLoading, setLoading ] = useState<boolean>(true);
    const [ data, setData ] = useState(null);
    const [ update, forceUpdate ] = useReducer((x: number) => x + 1, 0);
    const { login } = params;


    const handleSubscribe = async () => {
        try {
            const response = await fetch(`/api/users/${login}/subscribe`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }), json = await response.json();
            if (!response.ok)
                throw json.msg;

            data.controls.is_subscribe = json?.status == "created" ? true : false;
            data.subscribers = parseInt(data.subscribers) + (json?.status == "created" ? 1 : -1);

            setData(data);

            forceUpdate();
        }
        catch(err) {
            console.log(err);
        }
    }
    const handleLogout = () => {
        dispatch(clearLogin());
        navigator("/");
    }

    

    useEffect(() => {
        setLoading(true);
        (async () => {
            try {
                const response = await fetch(`/api/users/${login}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                const json = await response.json();
                if (!response.ok)
                    throw json.msg;

                setData(json);
            }
            catch(err) {
                console.log(err);
            }
            finally {
                setLoading(false);
            }
        })();
    }, [ login ]);

    if (isLoading)
        return (
            <p>Загрузка...</p>
        )
    
    return (
        <div className="profile" key={update}>
            <div className="profile_header">
                <User dataSource={data}/>
                <p className="profile_header__title">{data?.login}</p>
                <p className="profile_header__subscribes">{data?.subscribers} подписчиков</p>
                
                {token && <div className="profile_header__controls">
                    {(data?.controls?.is_me) ? (
                        <>
                            <Button>
                                Редактировать
                            </Button>
                            <Button
                                type="danger"
                                onClick={handleLogout}
                            >
                                Выйти из аккаунта
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                onClick={handleSubscribe}
                                type={data?.controls?.is_subscribe ? "danger" : null}
                            >
                                {data?.controls?.is_subscribe ? "Отписаться" : "Подписаться"}
                            </Button>
                        </>
                    )}
                </div>}
            </div>
            
        </div>
    );
}