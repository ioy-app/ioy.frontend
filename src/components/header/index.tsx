import * as Icons from "@/icons";

import "./styles.less";

import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import User from "../user";
import Input from "../input";
import Spin from "../spin";
import { useModal } from "@/hooks";
import { Auth } from "@/pages";

export default function Header() {
    const navigator = useNavigate();
    const { token, login, loading } = useSelector((state: any) => state?.login);
    const { modal } = useModal();


    return (
        <header className="header">
            <div className="header_title">
                <button onClick={() => navigator("/")} key="home">
                    <img
                        src={Icons.Logo}
                        className="logo"
                    />
                </button>
                <div className="search">
                    <Input
                        type="search"
                        placeholder="Поиск..."
                    />
                    <button>
                        <img
                            src={Icons.Search}
                            className="search_input__icon logo"
                        />
                    </button>
                </div>
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
                            <NavLink to="/stories" key="stories">
                                <button>
                                    <img
                                        src={Icons.List}
                                        className="nav__icon logo"
                                    />
                                </button>
                            </NavLink>
                            <button key="user">
                                <User login={login} link compact />
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
                            <User compact />
                        </button>
                    )}
                </Spin>
            </nav>
        </header>
    )
}