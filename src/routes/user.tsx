import { RouteObject } from "react-router-dom";
import { Dashboard, Profile, ProfileEdit, UserContent } from "@/pages";
import { users_favorites, users_games, users_likes, users_subscribers } from "@/api/routes/users";

export const user_paths = {
    details: (login: string) => `/u/${login}`,
    edit: (login: string) => `/u/${login}/edit`,
    content: {
        games: (login: string) => `/u/${login}/games`,
        favorites: (login: string) => `/u/${login}/favorites`,
        subscribers: (login: string) => `/u/${login}/subscribers`,
        likes: (login: string) => `/u/${login}/likes`
    }
}

const user: RouteObject[] = [
    {
        path: user_paths.details(":login"),
        element: <Profile />
    },
    {
        path: user_paths.edit(":login"),
        element: <ProfileEdit />
    },
    {
        path: user_paths.content.favorites(":login"),
        element: <UserContent fn={users_favorites} id="favorites" />
    },
    {
        path: user_paths.content.games(":login"),
        element: <UserContent fn={users_games} id="games" />
    },
    {
        path: user_paths.content.subscribers(":login"),
        element: <UserContent fn={users_subscribers} id="subscribers" />
    },
    {
        path: user_paths.content.likes(":login"),
        element: <UserContent fn={users_likes} id="likes" />
    }
];

export default user;