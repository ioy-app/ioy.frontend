import { sessions_delete, sessions_list } from "@/api/routes/sessions";
import { Button } from "@/components";
import { useAPI } from "@/hooks";
import dayjs from "dayjs";
import { useEffect, useReducer, useState } from "react";
import { UAParser } from "ua-parser-js";

export default function Sessions() {
    const [ isLoading, setLoading ] = useState<boolean>(true);
    const [ sessions, setSessions ] = useState(null);
    const [ update, forceUpdate ] = useReducer((x: number) => x + 1, 0);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setSessions(null);
                const response = await sessions_list();
                const json = await response.json();
                
                if (!response.ok) {
                    throw new Error(json?.msg);
                    
                }

                setSessions(json);
            }
            catch(err) {
                console.log(err);
            }
            finally {
                setLoading(false);
            }
        })();
    }, [ update ]);

    const handleRemoveSession = async (id: number) => {
        try {
            setLoading(true);
            const response = await sessions_delete(id);
            
            if (!response.ok) {
                const json = await response.json();
                throw new Error(json?.msg);
            }

            forceUpdate();
        }
        catch(err) {
            console.log(err);
        }
        finally { setLoading(false); }
    }

    if (isLoading)
        return <p>Загрузка...</p>;

    return (
        <>
            <p className="profile_header__title edit">Активные сессии</p>
            {!sessions?.length && <p>Список пуст</p>}
            {sessions?.map((session, i) => {
                const parse = new UAParser(session.user_agent);
                const os = parse.getOS();
                const browser = parse.getBrowser();
                return (
                    <div className="session" key={i}>
                        <div className="session_header">
                            <p>{browser.name} ({browser.version})</p>
                            <p>{os.name} ({os.version})</p>
                        </div>
                        <div className="session_body">
                            <div>
                                <p>{session.ip}</p>
                                <p>{dayjs(session.date_created).format("HH:mm DD.MM.YYYY")}</p>
                            </div>
                            <p>{dayjs(session.date_expires).diff(Date.now(), 'days')} дней</p>
                            <Button
                                type="danger"
                                onClick={() => {
                                    handleRemoveSession(session.id);
                                }}
                            >
                                Удалить
                            </Button>
                        </div>
                    </div>
                )
            })}
        </>
    )
}