import { RouteObject } from "react-router-dom";
import { Dashboard, Profile, ProfileEdit, UserContent } from "@/pages";
import { users_favorites, users_games, users_likes, users_subscribers } from "@/api/routes/users";

export const user_paths = {
    details: (login: string) => `/u/${login}`
}

const user: RouteObject[] = [
    {
        path: user_paths.details(":login"),
        element: <Profile />
    }
];

export default user;