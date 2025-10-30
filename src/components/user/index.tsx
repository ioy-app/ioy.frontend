import React, { useState } from "react";
import "./styles.less";
import { UserProps } from "@/types";
import { Profile } from "../../icons";
import { useNavigate } from "react-router-dom";

export default function User({
    dataSource,
    compact=true,
    link,
    preview,
    onClick
}: {
    dataSource: UserProps;
    compact?: boolean;
    link?: boolean;
    preview: FileList;
    onClick?: () => void;
}) {
    const navigate = useNavigate();
    const [ isError, setError ] = useState<boolean>(false);
    

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
                <img
                    src={isError ? Profile : (preview || `/api/v1/users/${dataSource?.login}/avatar`)}
                    onError={() => setError(true)}
                />
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