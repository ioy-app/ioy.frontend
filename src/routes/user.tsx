import { Profile, ProfileEdit } from "@/pages";
import { RouteObject } from "react-router-dom";

const user: RouteObject[] = [
    {
        path: "/u/:login",
        element: <Profile />
    },
    {
        path: "/u/:login/edit",
        element: <ProfileEdit />
    }
];

export default user;