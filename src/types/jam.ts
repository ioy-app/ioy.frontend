import UserProps from "./user";

export default interface JamProps {
  id: number;
  title: string;
  description: string;
  author: UserProps;
  version?: string;
  status: "draft" | "public";
  comments?: {
    id: number;
    author: UserProps;
    content: string;
  }[];
  is_avatar?: boolean;
  date_created: Date;
  date_updated?: Date;
}