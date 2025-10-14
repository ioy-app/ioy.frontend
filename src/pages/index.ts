import Home from "./home";
import Stories from "./stories";
import Content from "./content";
import Profile from "./profile";
import Game from "./game";
import Error from "./error";

import oAuth, {
    Login as oAuthLogin,
    Reg as oAuthReg
} from "./oauth";

export {
    Content,
    Home,
    Stories,
    oAuth,
    oAuthLogin,
    oAuthReg,
    Profile,
    Game,
    Error
}