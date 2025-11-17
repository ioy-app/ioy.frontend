import React from "react";
import "./styles.less";
import PostProps from "./interface";
import User from "../user";
import Game from "../game";
import dayjs from "dayjs";

export default function Post({
    id,
    title,
    body,
    author,
    likes,
    game,
    date_created,
    date_updated
}: PostProps) {
    return (
        <div className="post">
            <div className="post_header">
                {author && (
                    <User
                        data={author}
                        compact={false}
                        link
                    />
                )}
                <p className="post_header__title">{title}</p>
                
                {game && (
                    <div className="post_header__game">
                        <Game
                            dataSource={{
                                id: game.id,
                                title: game.title
                            }}
                        />
                        {game.title}
                    </div>
                )}
            </div>
            {body && (
                <div className="post_body">
                    {body}
                </div>
            )}
            <div className="post_footer">
                <p className="post_footer__date">{dayjs(date_created).format("HH:mm DD.MM.YYYY")}</p>
                <p className="post_footer__date">{date_updated && `(Изм. ${dayjs(date_updated)?.format("HH:mm DD.MM.YYYY")})`}</p>
            </div>
        </div>
    )
}