import React, { useEffect, useState } from "react";
import "./styles.less";
import { UserProps } from "@/types";
import { Profile } from "../../icons";
import { useNavigate } from "react-router-dom";
import fetchAPI from "@/api";
import { users_details } from "@/api/routes/users";
import { useNotify } from "@/hooks";
import Spin from "../spin";

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
    const [ isLoading, setLoading ] = useState<boolean>(true);
    const [ isAvatar, setAvatar ] = useState<boolean>(false);
    const { notify } = useNotify();

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setAvatar(false);

                if (!dataSource?.login)
                    return;

                const response = await users_details(dataSource?.login);
                const json = await response.json();

                if (!response.ok)
                    throw json?.msg;

                setAvatar(json?.is_avatar);
            }
            catch(err) { notify(err?.message?.toString()); }
            finally { setLoading(false); }
        })();
    }, [ dataSource ]);
    

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
                <Spin loading={isLoading}>
                    <img
                        src={(isError || !isAvatar) ? Profile : (preview || `/api/v1/users/${dataSource?.login}/avatar`)}
                        onError={() => setError(true)}
                    />
                </Spin>
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