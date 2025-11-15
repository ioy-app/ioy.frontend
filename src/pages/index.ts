import Home from "./home";
import Stories from "./stories";
import Content from "./content";
import Profile, { ProfileEdit } from "./users";
import Game from "./game";
import ErrorPage from "./error";

import Auth, {
    Login as AuthLogin,
    Reg as AuthReg
} from "./auth";

export {
    Content,
    Home,
    Stories,
    Auth,
    AuthLogin,
    AuthReg,
    Profile,
    ProfileEdit,
    Game,
    ErrorPage
}