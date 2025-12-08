import { RouteObject } from "react-router-dom";

export const search_paths = {
    list: `/s`
}

const search: RouteObject[] = [
    {
        path: search_paths.list,
        element: <></>
    }
];

export default search;