import confPackage from "@/../package.json";
import React, { useState } from "react";
import * as Icons from "@/icons";

import "./styles.less";

import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import User from "../user";
import Input from "../input";
import Spin from "../spin";

export default function Header() {
    const navigator = useNavigate();

    const [ isOpenSearch, setOpenSearch ] = useState<boolean>(false);
    const [ searchValue, setSearchValue ] = useState<string>("");

    const { id, token, login, loading } = useSelector(state => state?.login);


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
                        onChange={(e) => {
                            setSearchValue(e?.target?.value)
                            setOpenSearch(e.target?.value?.length > 2);

                        }}
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
                <Spin loading={loading}>
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
                                <User dataSource={{ id, login }} link compact />
                            </button>
                        </>
                    ) : (
                        <NavLink to="/oauth" key="user">
                            <button>
                                <User compact />
                            </button>
                        </NavLink>
                    )}
                </Spin>
            </nav>
        </header>
    )
}