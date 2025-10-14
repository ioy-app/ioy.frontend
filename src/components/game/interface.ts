import UserProps from "../user/interface";

export default interface GameProps {
    id: number;
    title: string;
    description: string;
    banner: string;
    author: UserProps;
    tags: string[];
    comments?: {
        id: number;
        author: UserProps;
        content: string;
    }[];
    create_date: Date;
    update_date?: Date;
}