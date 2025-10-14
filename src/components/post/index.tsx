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
    game
}: PostProps) {
    return (
        <div className="post">
            <div className="post_header">
                {author && (
                    <User
                        dataSource={author}
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
                <p className="post_footer__date">{dayjs(new Date()).format("HH:mm DD.MM.YYYY")}</p>
            </div>
        </div>
    )
}