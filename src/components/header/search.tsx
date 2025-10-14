import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { fetchHomePageContent } from "../../store/HomePageContent";
import Game from "../game";
import { useAPI } from "../../hooks";
import User from "../user";
import * as Icons from "@/icons";
import { NavLink } from "react-router-dom";

export default function Search({
    searchValue,
    onClose
}: {
    searchValue?: string;
    onClose?: () => void;
}) {
    const [ items, isLoading, error ] = useAPI(`/api/search?search=${searchValue}`, (localData) => {
        return localData;
    }, null, [ searchValue ]);

    const games = items?.content?.filter(item => item.type == "game") || [],
          users = items?.content?.filter(item => item.type == "user") || [];

    return (
        <div className="search_block" onBlur={onClose}>
            {isLoading ? (
                <div className="search_block__nocontent">
                    <img src={Icons.Logo} className="loading"/>
                </div>
            ) : (
                error ? (
                    <p>Ошибка: {error}</p>
                ) : (
                    items?.content?.length > 0 ? (
                        <div className="search_content">
                            {games.length > 0 && (
                                <>
                                    <p>Игры({games.length})</p>
                                    <div className="search_block__row">
                                        {games.map((item, i) => (
                                            <Game
                                                dataSource={item}
                                                key={i}
                                                onClick={onClose}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                            {users.length > 0 && (
                                <>
                                    <p>Пользователи({users.length})</p>
                                    <div className="search_block__row">
                                        {users.map((item, i) => (
                                            <User
                                                dataSource={{
                                                    ...item,
                                                    login: item.title
                                                }}
                                                key={i}
                                                link
                                                onClick={onClose}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="search_block__nocontent">
                            <img src={Icons.Empty}/>
                            <p>Я ничего не нашел</p>
                        </div>
                    )
                )
            )}
            
            <div className="search_block__footer">
                <NavLink to="/search">
                    Расширенный поиск
                </NavLink>
            </div>
        </div>
    )
}