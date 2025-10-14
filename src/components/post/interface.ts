import UserProps from "../user/interface";

export default interface PostProps {
    id: number;
    title: string;
    author: UserProps[];
    body?: string;
    likes?: number;
    game?: {
        id: number;
        title: string;
    }
}