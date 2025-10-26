import React, { useState, useEffect } from "react";
import * as Components from "@/components";

import "./style.less";
import { useNavigate } from "react-router-dom";
import { useAPI } from "../../hooks";
import { Routes } from "@/api";

export default function Home() {
    const navigate = useNavigate();

    const [ data, isLoading, error ] = useAPI(Routes.games.list, (localData) => {
        return localData;
    });

    if (isLoading)
        return (<p>Загрузка...</p>);

    return (
        <>
            <div className="grid">
                {data?.games?.map((game, index) => (<Components.Game dataSource={game} key={index} />))}
            </div>
            <div className="tags">
                <p># Популярные теги</p>
                <div className="content">
                    {data?.tags?.map((tag, index) => (
                        <p key={index}>{tag}</p>
                    ))}
                </div>
            </div>
        </>
    );
}