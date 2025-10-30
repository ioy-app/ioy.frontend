import fetchAPI from "@/api";
import { users_games } from "@/api/routes/users";
import { Game } from "@/components";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Games() {
    const params = useParams();
    
    const [ data, setData ] = useState([]);
    const [ isLoading, setLoading ] = useState<boolean>(true);
    const [ error, setError ] = useState<ErrorInstance | null>(null);

    const { login } = params;
    
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await users_games(login);
                const json = await response.json();

                if (!response.ok)
                    throw new Error(json?.msg);

                setData(json);
            }
            catch(err) { setError(err); }
            finally { setLoading(false); }
        })();
    }, [ login ]);

    if (isLoading)
        return (
            <p>Загрузка...</p>
        );

    if (error)
        return (
            <p>Произошла ошибка: {error.toString()}</p>
        );

    return (
        data?.length > 0 && (
            <div className="block">
                <div className="block_header">
                    <p className="text title">Игры</p>
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
        )
    )
}