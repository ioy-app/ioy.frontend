import Home from "./home";
import Content from "./content";
import Profile, { ProfileEdit } from "./users";
import UserContent from "./users/content";
import Game from "./game";
import GameEdit from "./game/edit";
import Dashboard from "./dashboard";
import ErrorPage from "./error";
import About from "./about";

import Auth, {
	Login as AuthLogin,
	Reg as AuthReg,
} from "./auth";

export {
	Content,
	Home,
	Auth,
	AuthLogin,
	AuthReg,
	Profile,
	ProfileEdit,
	Game,
	ErrorPage,
	Dashboard,
	GameEdit,
	UserContent,
	About,
};
