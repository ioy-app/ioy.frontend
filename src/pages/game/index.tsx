import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";

import "./styles.less";
import { User } from "@/components";
import GameComponents from "@/components/game";
import { Button, Post } from "../../components";
import * as Icons from "@/icons";

export default function Game() {
    const params = useParams();
    const [ isLoading, setLoading ] = useState<boolean>(true);
    const [ data, setData ] = useState(null);
    const { id } = params;
    const iframe = useRef(null);

    const handleFullScreen = () => {
        const game = iframe?.current;

        if (!game)
            return;
        
        if (game.requestFullscreen) game.requestFullscreen();
        else if (game.mozRequestFullscreen) game.mozRequestFullscreen();
        else if (game.msRequestFullscreen) game.msRequestFullscreen();
    }
    
    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/games/${id}`),
                      json = await response.json();
                if (!response.ok)
                    throw json.msg;

                setData(json);
                document.title = json?.title;
            }
            catch(err) {
                console.log(err);
            }
            finally { setLoading(false); }
        })();
    }, [ id ])

    return (
        <div className="gamepage">
            <div className="gamepage_header">
                <img className="gamepage_header__avatar" src={`/api/games/${id}/icon`} />
                <div>
                    <h1>{data?.title}</h1>
                    <p>{data?.version}</p>
                </div>
            </div>
            <div className="gamepage_context">
                <div className="gamepage_body">
                    <iframe
                        ref={iframe}
                        src={`/api/games/${id}/game`}
                        className="gamepage_body__game"
                        allowFullScreen
                    />
                    <div className="gamepage_body__controls">
                        <div className="gamepage_body__controls_date">
                            {data?.date_created && <p>{dayjs(data?.date_created).format("HH:mm DD.MM.YYYY")}</p>}
                            {data?.date_updated && <p>(Изм. {dayjs(data?.date_updated).format("HH:mm DD.MM.YYYY")})</p>}
                        </div>
                        <div className="gamepage_body__controls_buttons">
                            <Button type="clear">
                                <img src={Icons.Like}/>
                            </Button>
                            <Button type="clear">
                                <img src={Icons.Favorite}/>
                            </Button>
                            <Button type="clear" onClick={handleFullScreen}>
                                <img src={Icons.Fullscreen}/>
                            </Button>
                        </div>
                    </div>
                    <p className="gamepage_body__description">{data?.description}</p>
                    <div className="gamepage_body__tags">
                        {data?.tags.map((tag: string) => (
                            <p className="gamepage_body__tags_tag">{tag}</p>
                        ))}
                    </div>
                    
                    <div className="gamepage_body__authors">
                        <p className="gamepage_body__title">{data?.authors_data?.length > 1 ? "Авторы" : "Автор"}</p>
                        {data?.authors_data?.map(profile => (
                            <User dataSource={profile} compact={false} link />
                        ))}
                    </div>
                    
                </div>
                <div className="gamepage_nav">
                    {data?.recomendator?.map(game => <GameComponents dataSource={game} />)}
                </div>
                <div className="gamepage_comments">
                    <p className="gamepage_body__title">Отзывы</p>
                    <Post
                        id={1}
                        title=""
                        body="Тест комментария"
                        author={{
                            id: 1,
                            login: "tester"
                        }}
                    />
                    <Post
                        id={1}
                        title=""
                        body="Тест комментария"
                        author={{
                            id: 1,
                            login: "tester"
                        }}
                    />
                    <Post
                        id={1}
                        title=""
                        body="Тест комментария"
                        author={{
                            id: 1,
                            login: "tester"
                        }}
                    />
                    <Post
                        id={1}
                        title=""
                        body="Тест комментария"
                        author={{
                            id: 1,
                            login: "tester"
                        }}
                    />
                    <Post
                        id={1}
                        title=""
                        body="Тест комментария"
                        author={{
                            id: 1,
                            login: "tester"
                        }}
                    />
                    <Post
                        id={1}
                        title=""
                        body="Тест комментария"
                        author={{
                            id: 1,
                            login: "tester"
                        }}
                    />
                </div>
            </div>
        </div>
    )
}