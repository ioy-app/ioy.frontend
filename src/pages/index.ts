import Home from "./home";
import Content from "./content";
import Profile, { ProfileEdit } from "./users";
import UserContent from "./users/content";
import Game from "./games/details";
import GameEdit from "./games/edit";
import Dashboard from "./dashboard";
import ErrorPage from "./error";
import About from "./home/pages/about";
import Verify from "./verify";
import Feed from "./home/pages/feed";
import PictureEdit from "./pictures/edit";

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
	Verify,
	Feed,
	PictureEdit
};
