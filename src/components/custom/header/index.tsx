import * as Icons from "@/icons";
import { BiSearch } from "react-icons/bi";
import "./styles.less";

import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    User,
    Input,
    Spin
} from "@/components";
import { useModal } from "@/hooks";
import { Auth } from "@/pages";

export default function Header() {
    const navigator = useNavigate();
    const { token, login, loading } = useSelector((state: any) => state?.login);
    const { modal } = useModal();


    return (
        <header className="header border-b-gray-200 border-b">
            <div className="header_title">
                <button onClick={() => navigator("/")} key="home">
                    <img
                        src={Icons.Logo}
                        className="logo"
                    />
                </button>
            </div>
            <nav>
                <NavLink to="/jams" key="jams">
                    <button>
                        <img
                            src={Icons.Jam}
                            className="nav__icon logo"
                        />
                    </button>
                </NavLink>
                <Spin loading={loading} key={login}>
                    {token ? (
                        <>
                            <button key="user">
                                <User login={login} size={"full"} />
                            </button>
                        </>
                    ) : (
                        <button
                            key="user"
                            onClick={(e) => {
                                e.preventDefault();
                                modal(Auth, () => (<></>));
                            }}
                        >
                            <User nolink />
                        </button>
                    )}
                </Spin>
            </nav>
        </header>
    )
}