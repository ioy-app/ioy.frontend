import UserProps from "../user/interface";

export default interface GameProps {
    id: number;
    title: string;
    description: string;
    banner: string;
    author: UserProps;
    version?: string;
    tags: string[];
    status: "draft" | "public";
    comments?: {
        id: number;
        author: UserProps;
        content: string;
    }[];
    date_created: Date;
    date_updated?: Date;
}