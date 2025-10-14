import * as Icons from "@/icons";
import "./styles.less";
import { Button } from "@/components";
import { NavLink } from "react-router-dom";

export default function Error(props) {
    return (
        <div className="error">
            <img src={Icons.Logo} />
            <h1>Произошла ошибка</h1>
            <p>Описание ошибки</p>
            <NavLink to="/">
                <Button>
                    Главная страница
                </Button>
            </NavLink>
        </div>
    )
}