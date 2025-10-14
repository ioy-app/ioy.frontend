import React from "react";
import "./styles.less";
import UserProps from "./interface";
import { Profile } from "../../icons";
import { useNavigate } from "react-router-dom";

export default function User({
    dataSource,
    compact=true,
    link,
    onClick
}: {
    dataSource: UserProps;
    compact?: boolean;
    link?: boolean;
    onClick?: () => void;
}) {
    const navigate = useNavigate();

    return (
        <div
            className={`user ${compact && "compact" || ""} ${link && "link" || ""}`}
            onClick={() => {
                onClick && onClick();
                if (link)
                    navigate(`/u/${dataSource?.login}`);
            }}
        >
            <div className="user_avatar">
                <img src={dataSource && dataSource.avatar && dataSource.avatar || Profile} />
            </div>
            {!compact && (
                <>
                    <p className="user_login">
                        {dataSource.login}
                    </p>
                </>
            )}
        </div>
    )
}