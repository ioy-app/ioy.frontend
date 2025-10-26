import React from "react";
import GameProps from "./interface";

import "./styles.less";
import User from "../user";
import { useNavigate } from "react-router-dom";
import { Routes } from "@/api";

export default function Game({
    dataSource,
    compact=true,
    onClick
}: {
    dataSource: GameProps;
    compact?: boolean;
    onClick?: () => void;
}) {
    const navigate = useNavigate();

    return (
        <div className={`game ${compact && "compact" || ""}`} onClick={() => {
            onClick && onClick();
            navigate(`/g/${dataSource?.id}`);
        }}>
            <div className="game_avatar">
                <img src={Routes.games.icon(dataSource.id)} />
            </div>
        </div>
    )
}