import { RouteObject } from "react-router-dom";
import { Dashboard, Profile, ProfileEdit } from "@/pages";

export const user_paths = {
    details: (login: string) => `/u/${login}`,
    edit: (login: string) => `/u/${login}/edit`
}

const user: RouteObject[] = [
    {
        path: user_paths.details(":login"),
        element: <Profile />
    },
    {
        path: user_paths.edit(":login"),
        element: <ProfileEdit />
    }
];

export default user;