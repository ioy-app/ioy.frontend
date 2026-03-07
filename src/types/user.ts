type ControlsProps = {
	is_subscribe: boolean;
	is_me: boolean;
}

export default interface UserProps {
	id: number;
	login: string;
	description?: string;
	subscribers: number;
	date_ban?: Date;
	date_deleted?: Date;
	ban_count: number;
	controls?: ControlsProps;
}