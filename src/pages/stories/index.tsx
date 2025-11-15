import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Post } from "../../components";

import "./styles.less";

export default function Stories() {
    const dispatch = useDispatch();
    //const { items, loading, error } = useSelector(state => state.Stories.Stories);

    useEffect(() => {
        //dispatch(fetchStories());
    }, [])

    return (
        <div className="stories">
            {items?.map((item) => (
                <Post
                    title={item.title}
                    body={item.body}
                    likes={item.reactions.likes}
                    game={{
                        id: item.userId,
                        title: item.tags.at(1)
                    }}
                    author={{
                        id: item.userId,
                        login: item.tags.at(0)
                    }}
                />
            ))}
        </div>
    )
}