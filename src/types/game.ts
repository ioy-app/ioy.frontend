import UserProps from "./user";

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
	is_avatar?: boolean;
	date_created: Date;
	date_updated?: Date;
}
