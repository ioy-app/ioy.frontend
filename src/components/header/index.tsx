import confPackage from "@/../package.json";
import React, { useState } from "react";
import * as Icons from "@/icons";

import "./styles.less";

import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import User from "../user";
import Search from "./search";
import Button from "../button";

export default function Header() {
    const navigator = useNavigate();

    const [ isOpenSearch, setOpenSearch ] = useState<boolean>(false);
    const [ searchValue, setSearchValue ] = useState<string>("");

    const { id, token, login, loading } = useSelector(state => state?.login);


    return (
        <header className="header">
            <div className="header_title">
                <button onClick={() => navigator("/")}>
                    <img
                        src={Icons.Logo}
                        className="logo"
                    />
                </button>
                
            </div>
            <div className="search_content">
                <div className="search">
                    <input
                        type="search"
                        placeholder="Поиск..."
                        className="search_input"
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
                <NavLink to="/jams">
                    <button>
                        <img
                            src={Icons.Jam}
                            className="nav__icon logo"
                        />
                    </button>
                </NavLink>
                {loading ? <p>Загрузка...</p> : 
                    (token ? (
                        <>
                            <NavLink to="/stories">
                                <button>
                                    <img
                                        src={Icons.List}
                                        className="nav__icon logo"
                                    />
                                </button>
                            </NavLink>
                            <button>
                                <User dataSource={{ id, login }} link compact />
                            </button>
                        </>
                    ) : (
                        <NavLink to="/oauth">
                            <Button>Вход</Button>
                        </NavLink>
                    )
                )}
                
            </nav>
            {isOpenSearch && (
                <Search searchValue={searchValue} onClose={() => setOpenSearch(false)} />
            )}
        </header>
    )
}