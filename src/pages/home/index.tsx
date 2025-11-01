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

    const repeatArray = (arr, n) => [].concat(...Array(n).fill(arr));

    return (
        <Components.Spin loading={isLoading}>
            <div className="grid">
                {repeatArray(data?.games, 5)?.map((game, index) => (<Components.Game dataSource={game} key={index} />))}
            </div>
            <div className="tags">
                <p className="text title"># Популярные теги</p>
                <div className="content">
                    {data?.tags?.map((tag, index) => (
                        <p className="text" key={index}>{tag}</p>
                    ))}
                </div>
            </div>
        </Components.Spin>
    );
}