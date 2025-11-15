import fetchAPI from "@/api";
import { users_games, users_likes } from "@/api/routes/users";
import { Game, Spin } from "@/components";
import { useNotify } from "@/hooks";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Likes() {
    const params = useParams();
    
    const [ data, setData ] = useState([]);
    const [ isLoading, setLoading ] = useState<boolean>(true);

    const { login } = params;
    const { notify } = useNotify();
    
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const response = await users_likes(login);
                const json = await response.json();

                if (!response.ok)
                    throw new Error(json?.msg);

                setData(json?.items);
            }
            catch(err) { notify(err?.message?.toString(), "error"); }
            finally { setLoading(false); }
        })();
    }, [ login ]);

    return (
        <Spin loading={isLoading}>
            {data?.length > 0 && (
                <div className="block">
                    <div className="block_header">
                        <p className="text title">Понравилось</p>
                    </div>
                    <div className="block_body">
                        {data.map((game) => (
                            <Game
                                dataSource={{
                                    id: game.id
                                }}
                            />
                        ))}
                    </div>
                </div>  
            )}
        </Spin>
    )
}