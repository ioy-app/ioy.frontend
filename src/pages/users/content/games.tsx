import fetchAPI from "@/api";
import { users_games } from "@/api/routes/users";
import { Button, Game, Spin } from "@/components";
import { useNotify } from "@/hooks";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const content_limit: number = 50;

export default function Games() {
    const params = useParams();
    
    const [ data, setData ] = useState([]);
    const [ total, setTotal ] = useState<number>(0);
    const [ current, setCurrent ] = useState<number>(0);

    const [ isLoading, setLoading ] = useState<boolean>(true);
    const [ isLocalLoading, setLocalLoading ] = useState<boolean>(false);

    const { login } = params;
    const { notify } = useNotify();

    const handleNext = async (offset: number = current, limit: number = content_limit) => {
        try {
            setLocalLoading(true);

            const us = new URLSearchParams();
            us.set("offset", String(offset));
            us.set("limit", String(limit));

            const response = await users_games(login, us);
            const json = await response.json();

            if (!response.ok)
                throw new Error(json?.msg);

            setData((prev) => [...prev, ...json?.items]);
            setTotal(json?.total);
            setCurrent(Number((json?.offset || 0)) + Number(json?.limit));
            
        }
        catch(err) { notify(err?.message?.toString(), "error"); }
        finally { setLocalLoading(false); }
    }
    
    useEffect(() => {
        (async () => {
            setLoading(true);
                await handleNext(0, 5);
            setLoading(false);
        })();
    }, [ login ]);

    const isNext = current < total;

    return (
        <Spin loading={isLoading}>
            {data?.length > 0 && (
                <div className="block">
                    <div className="block_header">
                        <p className="text title">Игры</p>
                    </div>
                    <div className="block_body">
                        {data.map((game, i: number) => (
                            <Game
                                dataSource={{
                                    id: game.id
                                }}
                                key={i}
                            />
                        ))}
                        {isNext ? (
                            <Button
                                disabled={isLocalLoading}
                                onClick={() => handleNext()}
                                className="game compact"
                            >
                                ...
                            </Button>
                        ) : current > 0 && (
                            <Button
                                disabled={isLocalLoading}
                                onClick={() => {
                                    setData([]);
                                    handleNext(0, 5)
                                }}
                                className="game compact"
                            >
                                {'<'}
                            </Button>
                        )}
                    </div>
                </div>  
            )}
        </Spin>
    )
}