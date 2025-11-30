import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";

import "./styles.less";
import { Spin, User } from "@/components";
import GameComponents from "@/components/game";
import { Button, Input, Post } from "../../components";
import * as Icons from "@/icons";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import Comment from "./comment";
import fetchAPI from "@/api";
import { useNotify } from "@/hooks";
import { games_like, games_subscribe } from "@/api/routes/games";

export default function Game() {
    const params = useParams();
    const [ isLoading, setLoading ] = useState<boolean>(true);
    const [ isControlLoading, setControlLoading ] = useState<boolean>(false);
    const [ data, setData ] = useState(null);
    const [ comments, setComments ] = useState([]);
    const { id } = params;
    const iframe = useRef(null);
    const info = useSelector(state => state?.login);
    const { token } = info;
    const [ searchParams, setSearchParams ] = useSearchParams();
    const { notify } = useNotify();
    const navigator = useNavigate();

    const { register, handleSubmit, formState: { errors }, setError, clearErrors, setValue, watch } = useForm({
        defaultValues: {
            comment: null,
            answer_id: null
        }
    });

    const handleFavorite = async (e) => {
        try {
            setControlLoading(true);
            const response = await games_subscribe(Number(id));
            const json = await response.json();

            if (!response.ok)
                throw json?.msg;

            data.is_subscribe = json?.status == "created" ? true : false;

            notify(json?.status == "created" ? "Вы сохранили игру" : "Вы отписались от игры", json?.status == "created" ? "success" : "warning");
            setData(data);
        }
        catch(err) { notify(err.toString(), "error"); }
        finally { setControlLoading(false); }
    }

    const handleLike = async (e) => {
        try {
            setControlLoading(true);
            const response = await games_like(Number(id));
            const json = await response.json();

            if (!response.ok)
                throw json?.msg;

            data.is_like = json?.status == "liked" ? true : false;

            notify(json?.status == "liked" ? "Вам понравилась игра" : "Вам не понравилась игра", json?.status == "liked" ? "success" : "warning");
            setData(data);
        }
        catch(err) { notify(err.toString(), "error"); }
        finally { setControlLoading(false); }
    }

    const submit = async (data) => {
        try {
            clearErrors();
            if (!data?.comment) throw "Пустое сообщение";
            const response = await fetchAPI(`/api/v1/comments/${id}`, {
                method: "POST",
                body: JSON.stringify(data)
            });
            const json = await response.json();

            if (!response.ok)
                throw json?.msg;
            
            if (data?.answer_id) {
                const comment = comments.filter(comment => comment.id == data?.answer_id)[0];
                if (!comment)
                    return;

                comment.answers.push({
                    id: json.id,
                    comment: data?.comment,
                    author: {
                        id: info?.id,
                        login: info?.login
                    },
                    date_created: new Date()
                });

            } else {
                comments.unshift({
                    id: json.id,
                    comment: data?.comment,
                    author: {
                        id: info?.id,
                        login: info?.login
                    },
                    answers: [],
                    date_created: new Date(),
                    total: comments.length + 1,
                    is_open: false
                });
            }
            setComments(comments);
            setValue("comment", null);
            
        }
        catch(err) {
            setError("comment", {
                type: "comment",
                message: err.toString()
            });
        }
        finally { setValue("answer_id", null); }
    }

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
                const response = await fetchAPI(`/api/v1/games/${id}`);
                if (!response.ok) {
                    if (response.status == 404) {
                        notify("errors.404", "error");
                        navigator("/");
                        return;
                    }

                    const json = await response?.json();
                    throw json?.msg;
                }
                const json = await response?.json();

                setData(json);
                console.log(json);
                document.title = json?.title;
            }
            catch(err) {
                console.log(err);
            }
            finally { setLoading(false); }
        })();
    }, [ id ]);

    useEffect(() => {
        (async () => {
            try {
                const response = await fetchAPI(`/api/v1/comments/${id}?${searchParams.toString()}`),
                      json = await response.json();
                if (!response.ok)
                    throw json?.msg;

                setComments(json);
            }
            catch(err) {
                console.log(err);
            }
        })();
    }, [ id, searchParams ]);

    return (
        <Spin loading={isLoading}>
            <div className="gamepage">
                <div className="gamepage_header">
                    <img className="gamepage_header__avatar" src={`/api/v1/games/${id}/icon`} />
                    <div>
                        <h1>{data?.title}</h1>
                        <p>{data?.version}</p>
                    </div>
                </div>
                <div className="gamepage_context">
                    <div className="gamepage_body">
                        <iframe
                            ref={iframe}
                            src={`/api/v1/games/${id}/game`}
                            className="gamepage_body__game"
                            allowFullScreen
                        />
                        <div className="gamepage_body__controls">
                            <div className="gamepage_body__controls_date">
                                {data?.date_created && <p>{dayjs(data?.date_created).format("HH:mm DD.MM.YYYY")}</p>}
                                {data?.date_updated && <p>(Изм. {dayjs(data?.date_updated).format("HH:mm DD.MM.YYYY")})</p>}
                            </div>
                            <div className="gamepage_body__controls_buttons">
                                <Button
                                    type={data?.is_like ? "second" : "clear"}
                                    disabled={isControlLoading}
                                    onClick={handleLike}
                                >
                                    <img src={Icons.Like}/>
                                </Button>
                                <Button
                                    type={data?.is_subscribe ? "second" : "clear"}
                                    onClick={handleFavorite}
                                    disabled={isControlLoading}
                                >
                                    <img src={Icons.Favorite}/>
                                </Button>
                                <Button type="clear" onClick={handleFullScreen}>
                                    <img src={Icons.Fullscreen}/>
                                </Button>
                            </div>
                        </div>
                        <p className="gamepage_body__description">{data?.description}</p>
                        <div className="gamepage_body__tags">
                            {data?.tags?.map((tag: string) => (
                                <p className="gamepage_body__tags_tag">{tag}</p>
                            ))}
                        </div>
                        
                        <div className="gamepage_body__authors">
                            <p className="gamepage_body__title">{data?.authors_data?.length > 1 ? "Авторы" : "Автор"}</p>
                            {data?.authors_data?.map(profile => <User data={profile} compact={false} link />)}
                        </div>
                        
                    </div>
                    
                    <div className="gamepage_comments" key={comments}>
                        <div className="gamepage_nav">
                            {data?.recomendator?.map(game => <GameComponents dataSource={game} />)}
                        </div>
                        {token && !watch("answer_id") && (
                            <>
                                <form className="gamepage_comments__form" onSubmit={handleSubmit(submit)}>
                                    <Input
                                        type="text"
                                        placeholder="Ваш комментарий..."
                                        {...register("comment")}
                                        disabled={watch("answer_id")}
                                    />
                                    <Button disabled={watch("answer_id")}>OK</Button>
                                </form>
                                {errors?.comment && <p className="gamepage_comments__form_error">{errors?.comment?.message}</p>}
                            </>
                        )}
                        <p className="gamepage_body__title">Комментарии ({comments?.length && comments[0]?.total || 0})</p>
                        {comments?.map((comment, i) => (
                            <Comment
                                {...comment}
                                key={i}
                                onSubmit={async (data) => {
                                    try {
                                        const response = await fetchAPI(`/api/v1/comments/${id}`, {
                                            method: "POST",
                                            headers: {
                                                "Content-Type": "application/json",
                                                "Authorization": `Bearer ${token}`
                                            },
                                            body: JSON.stringify({
                                                comment: data?.comment,
                                                answer_id: comment?.id
                                            })
                                        });
                                        const json = await response.json();

                                        if (!response.ok)
                                            throw json?.msg;

                                        return {
                                            id: json.id,
                                            comment: data?.comment,
                                            author: {
                                                id: info?.id,
                                                login: info?.login
                                            },
                                            date_created: new Date()
                                        }
                                    }
                                    catch(err) {
                                        console.log(err);
                                    }
                                }}
                                onEdit={async (data) => {
                                    try {
                                        const response = await fetchAPI(`/api/v1/comments/${data?.isEdit}`, {
                                            method: "PUT",
                                            headers: {
                                                "Content-Type": "application/json",
                                                "Authorization": `Bearer ${token}`
                                            },
                                            body: JSON.stringify({
                                                comment: data?.comment
                                            })
                                        });
                                        const json = await response.json();

                                        if (!response.ok)
                                            throw json?.msg;

                                        return {
                                            id: data?.isEdit,
                                            comment: data?.comment
                                        }
                                    }
                                    catch(err) {
                                        console.log(err);
                                    }
                                }}
                                onDelete={async (msg_id: number) => {
                                    try {
                                        const response = await fetchAPI(`/api/v1/comments/${msg_id}`, {
                                            method: "DELETE",
                                            headers: {
                                                "Content-Type": "application/json",
                                                "Authorization": `Bearer ${token}`
                                            }
                                        });
                                        const json = await response.json();

                                        if (!response.ok)
                                            throw json?.msg;

                                        return true;
                                    }
                                    catch(err) {
                                        console.log(err);
                                    }
                                }}
                            />
                        ))}
                        {(searchParams.get("limit") - 0 || 3) < comments?.at(0)?.total && <div
                            className="gamepage_comments__sub_open"
                            onClick={() => {
                                searchParams.set("limit", ((searchParams.get("limit") - 0) || 3) + 3);
                                setSearchParams(searchParams);
                            }}
                        >
                            Загрузить еще
                        </div>}
                        {!comments?.length && <p className="gamepage_body__empty">Нет комментариев</p>}
                    </div>
                </div>
            </div>
        </Spin>
    )
}