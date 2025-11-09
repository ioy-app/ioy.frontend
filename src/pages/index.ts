import Home from "./home";
import Stories from "./stories";
import Content from "./content";
import Profile, { ProfileEdit } from "./users";
import Game from "./game";
import ErrorPage from "./error";

import oAuth, {
    Login as oAuthLogin,
    Reg as oAuthReg
} from "./auth";

export {
    Content,
    Home,
    Stories,
    oAuth,
    oAuthLogin,
    oAuthReg,
    Profile,
    ProfileEdit,
    Game,
    ErrorPage
}