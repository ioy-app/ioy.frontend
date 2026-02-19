import { sessions_delete, sessions_delete_all, sessions_list } from "@/api/routes/sessions";
import { Button, Session, Spin } from "@/components";
import { useNotify } from "@/hooks";
import { Session as SessionProps } from "@/types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const Sessions: React.FC = () => {
    const { t } = useTranslation();
    const { notify } = useNotify();
    const [ isLoading, setLoading ] = useState<boolean>(true);
    const [ isLocalLoading, setLocalLoading ] = useState<boolean>(false);
    const [ data, setData ] = useState<SessionProps[] | null>(null);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setLocalLoading(true);
                setData(null);

                const response = await sessions_list();

                setData(response as SessionProps[]);
            }
            catch(err) { notify(t("sessions." + err?.message?.toString()), "error"); }
            finally {
                setLoading(false);
                setLocalLoading(false);
            }
        })();
    }, []);

    const handleCallback = async (func: () => Promise<void>): Promise<void> => {
        try {
            setLocalLoading(true);
            await func();
        }
        catch(err) { notify(t("sessions." + err?.message?.toString()), "error"); }
        finally { setLocalLoading(false); }
    }

    return (
        <Spin loading={isLoading}>
            <p className="text title">{t("sessions.title")}</p>
            {!data?.length && <p>{t("sessions.empty")}</p>}
            {data?.map((session: SessionProps, i: number) => (
                <Session
                    key={i}
                    {...session}
                    disabled={isLocalLoading}
                    onDelete={(id: number) => handleCallback(async () => {
                        await sessions_delete(id);
                        notify(t("sessions.success.delete"), "success");
                        setData(prev => prev.filter((s: SessionProps) => s.id != id));
                    })}
                />
            ))}
            {data?.length > 1 && (
                <Button
                    type="danger"
                    disabled={isLocalLoading}
                    onClick={() => handleCallback(async () => {
                        await sessions_delete_all();
                        notify(t("sessions.success.delete_all"), "success");
                        setData(null);
                    })}
                >
                    {t("buttons.delete_all_sessions")}
                </Button>
            )}
        </Spin>
    )
}

export default Sessions;