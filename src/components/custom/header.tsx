import * as Icons from "@/icons";
import { BiCalendarAlt, BiLogIn, BiUser } from "react-icons/bi";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    User,
    Spin
} from "@/components";
import { useModal } from "@/hooks";
import { Auth } from "@/pages";

/**
 * Header
 * @example
 * return <Header />
*/
const Header: React.FC<{}> = ({}) => {
   const { token, login, loading } = useSelector((state: any) => state?.login);
    const { modal } = useModal();

    return (
        <header className="sticky top-0 flex flex-row gap-4 items-center justify-between box-border w-full h-12 bg-back border-b border-b-br px-2 py-1 z-10">
            <div className="h-full">
                <NavLink
                    to="/"
                    className="h-full aspect-square p-0 m-0"
                >
                    <img
                        src={Icons.Logo}
                        className="aspect-square h-full"
                    />
                </NavLink>
            </div>
            <nav className="h-full flex gap-4 items-center justify-end px-2">
                <button
                    className="h-full aspect-square cursor-pointer"
                    onClick={(e) => {
                        if (token || loading)
                            return;

                        e.preventDefault();
                        modal(Auth, () => (<></>));
                    }}
                >
                    <Spin
                        loading={loading}
                        key={login}
                    >
                        {token ? <User login={login} size={"full"} /> : <BiUser className="w-full h-full p-1" />}
                    </Spin>
                </button>
            </nav>
        </header>
    )
}

export default Header;