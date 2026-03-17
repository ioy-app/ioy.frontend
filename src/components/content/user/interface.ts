import GameProps from "../game/interface";

export default interface UserProps {
	id: number;
	login: string;
	avatar: string;
	subscribers: number;
	games?: GameProps[];
};;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
