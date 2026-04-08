import { UserProps } from "@/types";

export default interface CommentProps {
	id: number;
	comment: string | null;
	source_id?: number;
	target_id: number;
	target_type: "game" | "comment";
	date_created?: string;
	date_updated?: string;
	author: UserProps;
	answers_total?: number;
	deleted?: boolean;
	answers?: CommentProps[];
	likes?: number;
	is_like?: boolean;
	is_me?: boolean;
}