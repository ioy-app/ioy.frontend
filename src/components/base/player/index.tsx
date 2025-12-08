import "./styles.less";

import { useEffect, useRef, useState } from "react";
import Spin from "../spin";
import Button from "../button";
import { BiError, BiPlay } from "react-icons/bi";
import { useTranslation } from "react-i18next";

const Player: React.FC<{
    /** ID Игры */
    gameId?: number;
    /** Другая ссылка на игру */
    src?: string;
}> = ({
    gameId,
    src
}) => {
    const ref = useRef(null);
    const [ isLoading, setLoading ] = useState<boolean>(true);
    const [ gameFile, setGameFile ] = useState<string>(null);
    const [ isPlay, setPlay ] = useState<boolean>(false);
    const [ isError, setError ] = useState<boolean>(false);

    const { t } = useTranslation();

    const handleLoad = async () => {
        try {
            setLoading(true);
            setPlay(true);
            setError(false);
            const file: Response = await fetch(src || `/api/v1/games/${gameId}/game`);
            const resource = await file.blob();

            if (!file.ok)
                throw new Error();

            setGameFile(URL.createObjectURL(resource));
        }
        catch(err) { setError(true); }
        finally { setLoading(false); }
    }

    useEffect(() => {
        setPlay(false);
        setError(false);
    }, [ gameId ]);

    return (
        <div
            className="wp_player"
            ref={ref}
        >
                {isPlay ? (
                    <Spin loading={isLoading}>
                        {isError ? (
                            <div className="flex w-full h-full items-center justify-center flex-col gap-2">
                                <BiError size="2em" />
                                <p className="text">{t("games.errors.exists")}</p>
                            </div>
                        ) : (
                            <iframe
                                src={gameFile}
                                onLoad={() => URL.revokeObjectURL(gameFile)}
                            />
                        )}
                    </Spin>
                ) : (
                    <div className="flex justify-center items-center h-full">
                        <Button
                            type="second"
                            onClick={handleLoad}
                        >
                            <BiPlay size="2em" />
                        </Button>
                    </div>
                )}
        </div>
    );
}

export default Player;