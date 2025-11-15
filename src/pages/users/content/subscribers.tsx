import fetchAPI from "@/api";
import { users_games, users_subscribers } from "@/api/routes/users";
import { Game, Spin, User } from "@/components";
import { useNotify } from "@/hooks";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Subscribers() {
    const params = useParams();
    
    const [ data, setData ] = useState([]);
    const [ isLoading, setLoading ] = useState<boolean>(true);
    const [ error, setError ] = useState<ErrorInstance | null>(null);

    const { login } = params;
    const { notify } = useNotify();
    
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await users_subscribers(login);
                const json = await response.json();

                if (!response.ok)
                    throw new Error(json?.msg);

                setData(json.items);
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
                        <p className="text title">Подписки</p>
                    </div>
                    <div className="block_body">
                        {data.map((user) => (
                            <User
                                dataSource={{
                                    id: user.id,
                                    login: user.login
                                }}
                                link
                                compact
                            />
                        ))}
                    </div>
                </div>  
            )}
        </Spin>
    )
}